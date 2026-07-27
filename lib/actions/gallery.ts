'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function uploadGalleryImage(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('image') as File | null
  if (!file || file.size === 0) return { error: 'No se recibió ninguna imagen' }

  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `gallery/${randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('images').upload(path, file, {
    contentType: file.type,
  })
  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(path)

  const { data: maxSort } = await supabase
    .from('gallery')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('gallery').insert({
    image_url: publicUrl,
    sort_order: (maxSort?.sort_order ?? 0) + 1,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/galeria')
  revalidatePath('/galeria')
  return { error: null }
}

export async function updateGalleryCaption(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const caption = formData.get('caption')?.toString() ?? ''
  if (!id) return

  await supabase.from('gallery').update({ caption }).eq('id', id)
  revalidatePath('/admin/galeria')
  revalidatePath('/galeria')
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  if (!id) return

  await supabase.from('gallery').delete().eq('id', id)
  revalidatePath('/admin/galeria')
  revalidatePath('/galeria')
}

export async function moveGalleryItem(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const direction = formData.get('direction')?.toString()
  if (!id || !direction) return

  const { data: items } = await supabase
    .from('gallery')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })

  if (!items) return

  const index = items.findIndex((i) => i.id === id)
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return

  const current = items[index]
  const target = items[targetIndex]

  await Promise.all([
    supabase.from('gallery').update({ sort_order: target.sort_order }).eq('id', current.id),
    supabase.from('gallery').update({ sort_order: current.sort_order }).eq('id', target.id),
  ])

  revalidatePath('/admin/galeria')
  revalidatePath('/galeria')
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function revalidateAll() {
  revalidatePath('/admin/testimonios')
  revalidatePath('/')
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name')?.toString().trim() ?? ''
  const text = formData.get('text')?.toString().trim() ?? ''
  const rating = Number(formData.get('rating')?.toString() ?? '5')

  if (!name || !text) {
    redirect(`/admin/testimonios?error=${encodeURIComponent('Faltan campos requeridos')}`)
  }

  const { data: maxSort } = await supabase
    .from('testimonials')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('testimonials').insert({
    name,
    text,
    rating,
    sort_order: (maxSort?.sort_order ?? 0) + 1,
  })

  revalidateAll()
  redirect(
    `/admin/testimonios?${error ? 'error' : 'ok'}=${encodeURIComponent(
      error ? error.message : 'Testimonio agregado'
    )}`
  )
}

export async function updateTestimonial(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const name = formData.get('name')?.toString().trim() ?? ''
  const text = formData.get('text')?.toString().trim() ?? ''
  const rating = Number(formData.get('rating')?.toString() ?? '5')
  if (!id) return

  await supabase.from('testimonials').update({ name, text, rating }).eq('id', id)
  revalidateAll()
}

export async function toggleTestimonialActive(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const current = formData.get('current')?.toString() === 'true'
  if (!id) return

  await supabase.from('testimonials').update({ is_active: !current }).eq('id', id)
  revalidateAll()
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  if (!id) return

  await supabase.from('testimonials').delete().eq('id', id)
  revalidateAll()
}

'use server'

import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'
import type { PriceType, ProductCategory } from '@/types/database'

async function uploadProductImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
) {
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `products/${randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('images').upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(path)

  return publicUrl
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id')?.toString() || null
  const name = formData.get('name')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() || null
  const category = formData.get('category')?.toString() as ProductCategory
  const priceType = formData.get('price_type')?.toString() as PriceType
  const priceRaw = formData.get('price')?.toString()
  const price = priceType === 'fixed' && priceRaw ? Number(priceRaw) : null
  const isActive = formData.get('is_active') === 'on'
  const isFeatured = formData.get('is_featured') === 'on'
  const imageFile = formData.get('image') as File | null

  if (!name || !category || !priceType) {
    redirect(
      `/admin/productos/${id ?? 'nuevo'}?error=${encodeURIComponent('Faltan campos requeridos')}`
    )
  }

  let imageUrl = formData.get('current_image_url')?.toString() || null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadProductImage(supabase, imageFile)
  }

  if (id) {
    const { error } = await supabase
      .from('products')
      .update({
        name,
        description,
        category,
        price_type: priceType,
        price,
        image_url: imageUrl,
        is_active: isActive,
        is_featured: isFeatured,
      })
      .eq('id', id)

    if (error) {
      redirect(`/admin/productos/${id}?error=${encodeURIComponent(error.message)}`)
    }
  } else {
    const slug = slugify(name)
    const { data: maxSort } = await supabase
      .from('products')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { error } = await supabase.from('products').insert({
      name,
      slug,
      description,
      category,
      price_type: priceType,
      price,
      image_url: imageUrl,
      is_active: isActive,
      is_featured: isFeatured,
      sort_order: (maxSort?.sort_order ?? 0) + 1,
    })

    if (error) {
      redirect(`/admin/productos/nuevo?error=${encodeURIComponent(error.message)}`)
    }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  revalidatePath('/')
  redirect(`/admin/productos?ok=${encodeURIComponent('Producto guardado correctamente')}`)
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  if (!id) return

  const { error } = await supabase.from('products').delete().eq('id', id)

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  revalidatePath('/')
  redirect(
    `/admin/productos?${error ? 'error' : 'ok'}=${encodeURIComponent(
      error ? error.message : 'Producto eliminado'
    )}`
  )
}

export async function toggleProductActive(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const current = formData.get('current')?.toString() === 'true'
  if (!id) return

  await supabase.from('products').update({ is_active: !current }).eq('id', id)

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  revalidatePath('/')
}

export async function moveProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const direction = formData.get('direction')?.toString()
  if (!id || !direction) return

  const { data: products } = await supabase
    .from('products')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })

  if (!products) return

  const index = products.findIndex((p) => p.id === id)
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || targetIndex < 0 || targetIndex >= products.length) return

  const current = products[index]
  const target = products[targetIndex]

  await Promise.all([
    supabase.from('products').update({ sort_order: target.sort_order }).eq('id', current.id),
    supabase.from('products').update({ sort_order: current.sort_order }).eq('id', target.id),
  ])

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  revalidatePath('/')
}

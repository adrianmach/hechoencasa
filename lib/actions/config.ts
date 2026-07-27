'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function revalidateAll() {
  revalidatePath('/admin/configuracion')
  revalidatePath('/')
  revalidatePath('/sobre-mi')
  revalidatePath('/cotizar')
  revalidatePath('/faq')
}

export async function updateHero(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title')?.toString() ?? ''
  const subtitle = formData.get('subtitle')?.toString() ?? ''

  await supabase
    .from('site_config')
    .upsert({ key: 'hero', value: { title, subtitle } })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

export async function updateAbout(formData: FormData) {
  const supabase = await createClient()
  const text = formData.get('text')?.toString() ?? ''
  let imageUrl = formData.get('current_image_url')?.toString() ?? ''

  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.type === 'image/png' ? 'png' : 'jpg'
    const path = `about/${randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('images')
      .upload(path, imageFile, { contentType: imageFile.type })
    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(path)
      imageUrl = publicUrl
    }
  }

  await supabase
    .from('site_config')
    .upsert({ key: 'about', value: { text, image_url: imageUrl } })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

export async function updateContact(formData: FormData) {
  const supabase = await createClient()
  const value = {
    whatsapp: formData.get('whatsapp')?.toString() ?? '',
    instagram: formData.get('instagram')?.toString() ?? '',
    tiktok: formData.get('tiktok')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    delivery_zone: formData.get('delivery_zone')?.toString() ?? '',
    hours: formData.get('hours')?.toString() ?? '',
    neighborhood: formData.get('neighborhood')?.toString() ?? '',
  }

  await supabase.from('site_config').upsert({ key: 'contact', value })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

function parseList(raw: string) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function updateQuoteForm(formData: FormData) {
  const supabase = await createClient()
  const value = {
    tortaSizes: parseList(formData.get('tortaSizes')?.toString() ?? ''),
    postreSizes: parseList(formData.get('postreSizes')?.toString() ?? ''),
    fillings: parseList(formData.get('fillings')?.toString() ?? ''),
    coatings: parseList(formData.get('coatings')?.toString() ?? ''),
  }

  await supabase.from('site_config').upsert({ key: 'quote_form', value })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

export async function updateDelivery(formData: FormData) {
  const supabase = await createClient()
  const value = {
    modality: formData.get('modality')?.toString() ?? '',
    cadete_note: formData.get('cadete_note')?.toString() ?? '',
    lead_time_tortas: formData.get('lead_time_tortas')?.toString() ?? '',
    lead_time_postres: formData.get('lead_time_postres')?.toString() ?? '',
    lead_time_alfajores: formData.get('lead_time_alfajores')?.toString() ?? '',
    urgencias_note: formData.get('urgencias_note')?.toString() ?? '',
    payment_methods: parseList(formData.get('payment_methods')?.toString() ?? ''),
  }

  await supabase.from('site_config').upsert({ key: 'delivery', value })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

export async function updateFaq(formData: FormData) {
  const supabase = await createClient()
  const raw = formData.get('faq')?.toString() ?? ''

  const value = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...rest] = line.split('::')
      return { question: question.trim(), answer: rest.join('::').trim() }
    })
    .filter((item) => item.question && item.answer)

  await supabase.from('site_config').upsert({ key: 'faq', value })

  revalidateAll()
  redirect('/admin/configuracion?ok=Cambios guardados')
}

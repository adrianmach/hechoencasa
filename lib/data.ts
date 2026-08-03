import { createClient } from '@/lib/supabase/server'
import type {
  GalleryItem,
  Product,
  ProductCategory,
  SiteConfigMap,
  Testimonial,
} from '@/types/database'

const DEFAULT_CONFIG: SiteConfigMap = {
  hero: {
    title: 'Pastelería artesanal, hecha con amor',
    subtitle: 'Tortas, postres y alfajores frescos y de calidad en Montevideo',
  },
  about: {
    text: '',
    image_url: '',
  },
  contact: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
    instagram: '',
    tiktok: '',
    email: '',
    delivery_zone:
      'Zona de retiro (Pick up): Parque Batlle. Zona de envío: Montevideo (sujeto a disponibilidad y cotización).',
    hours: '',
    neighborhood: '',
  },
  delivery: {
    modality: '',
    cadete_note: '',
    lead_time_tortas: '',
    lead_time_postres: '',
    lead_time_alfajores: '',
    urgencias_note: '',
    payment_methods: ['Efectivo', 'Transferencia bancaria'],
  },
  faq: [],
  quote_form: {
    tortaSizes: [],
    postreSizes: [],
    fillings: [],
    coatings: ['Buttercream', 'Ganache', 'Crema', 'Sin cobertura'],
  },
}

export async function getActiveProducts(category?: ProductCategory): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query
  return data ?? []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })

  return data ?? []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  return data
}

export async function getGallery(): Promise<GalleryItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })

  return data ?? []
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return data ?? []
}

export async function getSiteConfig(): Promise<SiteConfigMap> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_config').select('key, value')

  const config = { ...DEFAULT_CONFIG }
  for (const row of data ?? []) {
    ;(config as Record<string, unknown>)[row.key] = row.value
  }
  return config
}

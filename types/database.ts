export type PriceType = 'fixed' | 'quote'
export type ProductCategory = 'tortas' | 'postres' | 'alfajores' | 'temporada'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  price_type: PriceType
  category: ProductCategory
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface HeroConfig {
  title: string
  subtitle: string
}

export interface AboutConfig {
  text: string
  image_url: string
}

export interface ContactConfig {
  whatsapp: string
  instagram: string
  tiktok: string
  email: string
  delivery_zone: string
  hours: string
  neighborhood: string
}

export interface DeliveryConfig {
  modality: string
  cadete_note: string
  lead_time_tortas: string
  lead_time_postres: string
  lead_time_alfajores: string
  urgencias_note: string
  payment_methods: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface QuoteFormConfig {
  tortaSizes: string[]
  postreSizes: string[]
  fillings: string[]
  coatings: string[]
}

export interface SiteConfigMap {
  hero: HeroConfig
  about: AboutConfig
  contact: ContactConfig
  delivery: DeliveryConfig
  faq: FaqItem[]
  quote_form: QuoteFormConfig
}

export interface SiteConfigRow<K extends keyof SiteConfigMap = keyof SiteConfigMap> {
  key: K
  value: SiteConfigMap[K]
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Partial<Product> & {
          name: string
          slug: string
          price_type: PriceType
          category: ProductCategory
        }
        Update: Partial<Product>
        Relationships: []
      }
      site_config: {
        Row: SiteConfigRow
        Insert: SiteConfigRow
        Update: Partial<SiteConfigRow>
        Relationships: []
      }
      gallery: {
        Row: GalleryItem
        Insert: Partial<GalleryItem> & { image_url: string }
        Update: Partial<GalleryItem>
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: Partial<Testimonial> & { name: string; text: string }
        Update: Partial<Testimonial>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

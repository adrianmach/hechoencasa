import type { ProductCategory } from '@/types/database'

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  tortas: 'Torta',
  postres: 'Postre',
  alfajores: 'Alfajores',
  temporada: 'Temporada',
  cookies: 'Cookies',
}

export const CATEGORY_COLOR: Record<ProductCategory, string> = {
  tortas: 'rose',
  postres: 'lavender',
  alfajores: 'sand',
  temporada: 'sage',
  cookies: 'taupe',
}

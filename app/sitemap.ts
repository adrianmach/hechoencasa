import type { MetadataRoute } from 'next'
import { getActiveProducts } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const products = await getActiveProducts()

  const staticRoutes = ['', '/catalogo', '/galeria', '/cotizar', '/sobre-mi', '/faq'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/catalogo/${product.slug}`,
    lastModified: new Date(product.updated_at),
  }))

  return [...staticRoutes, ...productRoutes]
}

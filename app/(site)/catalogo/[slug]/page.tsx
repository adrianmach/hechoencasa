import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_LABEL } from '@/lib/categories'
import { getProductBySlug } from '@/lib/data'
import { productMessage, whatsappLink } from '@/lib/whatsapp'
import { Reveal } from '@/components/site/Reveal'
import { goldButtonPrimary, sectionLabel } from '@/lib/site/ui'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: product.image_url
      ? { images: [{ url: product.image_url }] }
      : undefined,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: product.image_url ?? undefined,
    category: CATEGORY_LABEL[product.category],
    ...(product.price_type === 'fixed' && product.price != null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'UYU',
            price: product.price,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }

  return (
    <div className="bg-cream py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-5xl gap-10 px-5 md:grid-cols-2">
        <Reveal variant="scale" className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-gold">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </Reveal>

        <div className="flex flex-col items-center justify-center gap-4 text-center md:items-start md:text-left">
          <Reveal variant="fade">
            <span className={sectionLabel}>{CATEGORY_LABEL[product.category]}</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h1 className="font-accent text-3xl text-text md:text-4xl">{product.name}</h1>
          </Reveal>
          {product.description && (
            <Reveal variant="fade" delay={200}>
              <p className="font-body leading-[1.7] text-text/75">{product.description}</p>
            </Reveal>
          )}

          {product.price_type === 'fixed' ? (
            <>
              <Reveal variant="fade" delay={300}>
                <p className="font-accent text-2xl text-text">
                  {product.price != null ? `$${product.price}` : ''}
                </p>
              </Reveal>
              <Reveal variant="fade" delay={400}>
                <a
                  href={whatsappLink(productMessage(product.name, product.price))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={goldButtonPrimary}
                >
                  Pedir por WhatsApp
                </a>
              </Reveal>
            </>
          ) : (
            <>
              <Reveal variant="fade" delay={300}>
                <p className="font-accent text-lg italic text-text/80">Precio a cotizar</p>
              </Reveal>
              <Reveal variant="fade" delay={400}>
                <Link
                  href={`/cotizar?producto=${encodeURIComponent(product.slug)}`}
                  className={goldButtonPrimary}
                >
                  Pedir presupuesto
                </Link>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

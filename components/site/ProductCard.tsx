import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABEL } from '@/lib/categories'
import type { Product } from '@/types/database'

export function ProductCard({
  product,
  imageAspect = 'aspect-[4/5]',
}: {
  product: Product
  imageAspect?: string
}) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div className={`relative ${imageAspect} overflow-hidden rounded-[4px] bg-bg-alt`}>
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
        <span className="absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      </div>
      <div className="pt-3">
        <p className="font-body text-[0.7rem] uppercase tracking-[0.15em] text-gold">
          {CATEGORY_LABEL[product.category]}
        </p>
        <h3 className="mt-1 font-accent text-lg text-text">{product.name}</h3>
        <p className="mt-1 font-body text-sm text-text/70">
          {product.price_type === 'fixed' && product.price != null
            ? `$${product.price}`
            : 'Consultar'}
        </p>
      </div>
    </Link>
  )
}

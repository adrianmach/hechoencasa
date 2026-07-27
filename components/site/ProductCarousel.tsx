'use client'

import { Reveal } from '@/components/site/Reveal'
import { Carousel } from '@/components/site/Carousel'
import { ProductCard } from '@/components/site/ProductCard'
import type { Product } from '@/types/database'

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <Carousel
      items={products}
      itemKey={(product) => product.id}
      itemClassName="w-[83%] shrink-0 snap-start sm:w-[45%] md:w-[23%]"
      renderItem={(product, i) => (
        <Reveal variant="card" delay={i * 100}>
          <ProductCard product={product} />
        </Reveal>
      )}
    />
  )
}

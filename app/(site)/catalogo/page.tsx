import type { Metadata } from 'next'
import { CategoryFilter } from '@/components/site/CategoryFilter'
import { ProductCard } from '@/components/site/ProductCard'
import { Reveal } from '@/components/site/Reveal'
import { sectionLabel } from '@/lib/site/ui'
import { getActiveProducts } from '@/lib/data'
import type { ProductCategory } from '@/types/database'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Postres, alfajores y tortas artesanales. Elegí tu favorito y pedilo por WhatsApp.',
}

const VALID_CATEGORIES: ProductCategory[] = ['tortas', 'postres', 'alfajores', 'temporada']

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const category = VALID_CATEGORIES.includes(categoria as ProductCategory)
    ? (categoria as ProductCategory)
    : undefined

  const products = await getActiveProducts(category)

  return (
    <div className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center md:text-left">
          <Reveal variant="fade">
            <span className={sectionLabel}>Nuestra carta</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h1 className="mt-3 font-accent text-3xl text-text md:text-4xl">
              Nuestro <em className="italic">catálogo</em>
            </h1>
          </Reveal>
          <Reveal variant="fade" delay={200}>
            <p className="mt-4 font-body text-text/70 md:max-w-xl">
              Todo hecho a mano. Las tortas y los postres se cotizan a medida; alfajores y
              productos de temporada tienen precio fijo.
            </p>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={300} className="mt-10">
          <CategoryFilter active={category ?? ''} />
        </Reveal>

        {products.length === 0 ? (
          <p className="mt-16 text-center font-body text-text/60 md:text-left">
            No hay productos en esta categoría todavía.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.id} variant="card" delay={(i % 4) * 100}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

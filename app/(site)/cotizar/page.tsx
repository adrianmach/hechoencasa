import type { Metadata } from 'next'
import { QuoteForm } from '@/components/site/QuoteForm'
import { Reveal } from '@/components/site/Reveal'
import { sectionLabel } from '@/lib/site/ui'
import { getProductBySlug, getSiteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Pedí tu presupuesto',
  description: 'Pedí presupuesto para tu torta o postre personalizado: tamaño, relleno, cobertura y fecha.',
}

export default async function CotizarPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>
}) {
  const { producto } = await searchParams
  const [config, product] = await Promise.all([
    getSiteConfig(),
    producto ? getProductBySlug(producto) : Promise.resolve(null),
  ])

  return (
    <div className="bg-sand py-16 md:py-24">
      <div className="mx-auto max-w-xl px-5">
        <div className="text-center">
          <Reveal variant="fade">
            <span className={sectionLabel}>Hacemos tu pedido</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h1 className="mt-3 font-accent text-3xl text-text md:text-4xl">
              Pedí tu <em className="italic">presupuesto</em>
            </h1>
          </Reveal>
          <Reveal variant="fade" delay={200}>
            <p className="mt-4 font-body leading-[1.7] text-text/70">
              Contame los detalles de tu torta o postre y te armo un mensaje de WhatsApp con todo
              listo para enviar.
            </p>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={300} className="mt-10">
          <QuoteForm
            quoteConfig={config.quote_form}
            productName={product?.name}
            productCategory={product?.category}
          />
        </Reveal>
      </div>
    </div>
  )
}

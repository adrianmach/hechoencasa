import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/site/Lightbox'
import { Reveal } from '@/components/site/Reveal'
import { sectionLabel } from '@/lib/site/ui'
import { getGallery } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Fotos de tortas, postres y trabajos hechos a medida.',
}

export default async function GaleriaPage() {
  const items = await getGallery()

  return (
    <div className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center md:text-left">
          <Reveal variant="fade">
            <span className={sectionLabel}>Nuestro trabajo</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h1 className="mt-3 font-accent text-3xl text-text md:text-4xl">
              Galería <em className="italic">de fotos</em>
            </h1>
          </Reveal>
          <Reveal variant="fade" delay={200}>
            <p className="mt-4 font-body text-text/70">
              Algunos de los trabajos que más disfruté hacer.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          {items.length === 0 ? (
            <p className="text-center font-body text-text/60 md:text-left">
              Todavía no hay fotos cargadas.
            </p>
          ) : (
            <GalleryGrid items={items} />
          )}
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/data'
import { Reveal } from '@/components/site/Reveal'
import { sectionLabel } from '@/lib/site/ui'

export const metadata: Metadata = {
  title: 'Sobre mí',
  description: 'Conocé la historia detrás de Hecho en Casa.',
}

export default async function SobreMiPage() {
  const config = await getSiteConfig()

  return (
    <div className="flex flex-col md:flex-row md:items-stretch">
      {config.about.image_url && (
        <Reveal
          variant="scale"
          className="relative order-1 aspect-[4/3] w-full overflow-hidden border-b border-gold md:aspect-auto md:min-h-[70vh] md:w-[60%] md:border-b-0 md:border-r"
        >
          <div
            className="parallax-bg absolute inset-0"
            style={{ backgroundImage: `url(${config.about.image_url})` }}
          />
        </Reveal>
      )}

      <div className="order-2 flex w-full flex-col items-center justify-center gap-6 bg-cream px-6 py-16 text-center md:w-[40%] md:items-start md:px-14 md:text-left">
        <Reveal variant="fade">
          <span className={sectionLabel}>La historia</span>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h1 className="font-accent text-3xl text-text md:text-4xl">
            Sobre <em className="italic">mí</em>
          </h1>
        </Reveal>
        <Reveal variant="fade" delay={200}>
          <p className="whitespace-pre-line font-body leading-[1.7] text-text/80">
            {config.about.text}
          </p>
        </Reveal>

        <Reveal variant="fade" delay={300}>
          <div className="grid grid-cols-2 gap-4 border-t border-gold/30 pt-6 text-sm">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">
                Zona de entrega
              </p>
              <p className="mt-1 font-body text-text/80">{config.contact.delivery_zone}</p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">Barrio</p>
              <p className="mt-1 font-body text-text/80">{config.contact.neighborhood}</p>
            </div>
          </div>
        </Reveal>

        <Reveal variant="fade" delay={400}>
          <div className="flex flex-wrap justify-center gap-5 font-body text-sm md:justify-start">
            {config.contact.instagram && (
              <a
                href={`https://instagram.com/${config.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text underline decoration-gold underline-offset-4 transition-colors duration-300 hover:text-gold"
              >
                {config.contact.instagram}
              </a>
            )}
            {config.contact.tiktok && (
              <a
                href={`https://tiktok.com/@${config.contact.tiktok.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text underline decoration-gold underline-offset-4 transition-colors duration-300 hover:text-gold"
              >
                {config.contact.tiktok} (TikTok)
              </a>
            )}
            {config.contact.email && (
              <a
                href={`mailto:${config.contact.email}`}
                className="text-text underline decoration-gold underline-offset-4 transition-colors duration-300 hover:text-gold"
              >
                {config.contact.email}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}

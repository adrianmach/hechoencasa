import Link from 'next/link'
import Image from 'next/image'
import { ProductCarousel } from '@/components/site/ProductCarousel'
import { Testimonials } from '@/components/site/Testimonials'
import { Reveal } from '@/components/site/Reveal'
import { GoldDivider } from '@/components/site/GoldDivider'
import { getActiveProducts, getGallery, getSiteConfig, getTestimonials } from '@/lib/data'
import { whatsappLink } from '@/lib/whatsapp'
import { goldButtonPrimary, goldButtonPrimaryDark, goldButtonSecondary, sectionLabel } from '@/lib/site/ui'

const STEPS = [
  { title: 'Elegí', text: 'Mirá el catálogo de tortas, postres y alfajores.' },
  { title: 'Consultá', text: 'Pedí presupuesto con tamaño, relleno y fecha.' },
  { title: 'Coordinamos', text: 'Confirmamos detalles y forma de entrega.' },
  { title: 'Disfrutá', text: 'Retirás o te lo llevamos a domicilio.' },
]

export default async function HomePage() {
  const [products, config, testimonials, gallery] = await Promise.all([
    getActiveProducts(),
    getSiteConfig(),
    getTestimonials(),
    getGallery(),
  ])

  const featured = products.slice(0, 6)
  const tortaProduct = products.find((p) => p.category === 'tortas')
  const galleryPreview = gallery.slice(0, 4)

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative flex h-[50vh] items-end overflow-hidden md:h-[68vh]">
        {featured[0]?.image_url && (
          <div
            className="parallax-bg absolute inset-0"
            style={{ backgroundImage: `url(${featured[0].image_url})` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.35))',
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-12 text-center md:items-start md:pb-16 md:text-left">
          <p
            className="stagger-in font-body text-xs uppercase tracking-[0.2em] text-cream"
            style={{ animationDelay: '200ms', textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)' }}
          >
            Pastelería artesanal
          </p>
          <h1
            className="stagger-in mt-3 max-w-xl font-accent text-4xl text-cream md:text-6xl"
            style={{ animationDelay: '400ms', textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {config.hero.title}
          </h1>
          <p
            className="stagger-in mt-4 max-w-md font-body text-cream/90"
            style={{ animationDelay: '600ms', textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {config.hero.subtitle}
          </p>
          <Link
            href="/catalogo"
            className="stagger-in mt-7 inline-block border border-cream px-7 py-3 font-body text-[0.8rem] font-medium uppercase tracking-[0.12em] text-cream transition-colors duration-300 hover:bg-cream hover:text-text"
            style={{ animationDelay: '800ms' }}
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* ============ Productos destacados — cream ============ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 text-center md:text-left">
          <Reveal variant="fade">
            <span className={sectionLabel}>Nuestros favoritos</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">
              Lo que más <em className="italic">piden</em>
            </h2>
          </Reveal>
          <div className="mt-10 text-left">
            <ProductCarousel products={featured} />
          </div>
        </div>
      </section>

      {tortaProduct && (
        <div className="bg-pink pt-16 md:pt-20">
          <GoldDivider />
        </div>
      )}

      {/* ============ Tortas personalizadas — pink, parallax ============ */}
      {tortaProduct && (
        <section className="relative overflow-hidden bg-pink pb-20 pt-8 md:pb-28 md:pt-10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
            <Reveal variant="scale" className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-gold">
              <div
                className="parallax-bg absolute inset-0"
                style={{ backgroundImage: `url(${tortaProduct.image_url})` }}
              />
            </Reveal>
            <div className="text-center md:text-left">
              <Reveal variant="fade">
                <span className={sectionLabel}>A medida</span>
              </Reveal>
              <Reveal variant="up" delay={100}>
                <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">
                  Tortas y postres <em className="italic">personalizados</em>
                </h2>
              </Reveal>
              <Reveal variant="fade" delay={200}>
                <p className="mt-5 font-body leading-[1.7] text-text/80">
                  Cumpleaños, casamientos, eventos o un antojo puntual: contanos qué necesitás y
                  armamos tu pedido según tamaño, relleno, cobertura y temática.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={400}>
                <Link href="/cotizar" className={`mt-7 ${goldButtonPrimary}`}>
                  Pedí tu presupuesto
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <div className="bg-bg-alt pt-16 md:pt-20">
        <GoldDivider />
      </div>

      {/* ============ Cómo pedir — bg-alt ============ */}
      <section className="bg-bg-alt pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal variant="fade">
            <span className={sectionLabel}>El proceso</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">Cómo pedir</h2>
          </Reveal>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gold/30 lg:block" />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} variant="up" delay={i * 150} className="relative bg-bg-alt px-2 text-center">
                <p className="font-accent text-4xl text-gold">{i + 1}</p>
                <p className="mt-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-text">
                  {step.title}
                </p>
                <p className="mt-2 font-body text-sm text-text/70">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-sage pt-16 md:pt-20">
        <GoldDivider />
      </div>

      {/* ============ Sobre mí — sage, parallax ============ */}
      <section className="relative overflow-hidden bg-sage pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center">
          <div className="order-2 text-center md:order-1 md:text-left">
            <Reveal variant="fade">
              <span className={sectionLabel}>Sobre mí</span>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">
                Hecho con <em className="italic">dedicación</em>, hecho en casa
              </h2>
            </Reveal>
            <Reveal variant="fade" delay={200}>
              <p className="mt-5 font-body leading-[1.7] text-text/80">
                {config.about.text.split('\n\n')[0]}
              </p>
            </Reveal>
            <Reveal variant="fade" delay={400}>
              <Link href="/sobre-mi" className={`mt-6 ${goldButtonSecondary}`}>
                Conocé más
              </Link>
            </Reveal>
          </div>
          {config.about.image_url && (
            <Reveal
              variant="scale"
              className="order-1 relative aspect-[4/3] overflow-hidden rounded-[4px] border border-gold md:order-2"
            >
              <div
                className="parallax-bg absolute inset-0"
                style={{ backgroundImage: `url(${config.about.image_url})` }}
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ Testimonios — lavender ============ */}
      <Testimonials items={testimonials} />

      {galleryPreview.length > 0 && (
        <div className="bg-cream pt-16 md:pt-20">
          <GoldDivider />
        </div>
      )}

      {/* ============ Galería — cream ============ */}
      {galleryPreview.length > 0 && (
        <section className="bg-cream pb-20 pt-8 md:pb-28 md:pt-10">
          <div className="mx-auto max-w-6xl px-5 text-center md:text-left">
            <Reveal variant="fade">
              <span className={sectionLabel}>Nuestro trabajo</span>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">Galería</h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {galleryPreview.map((item, i) => (
                <Reveal
                  key={item.id}
                  variant="scale"
                  delay={i * 100}
                  className={`relative overflow-hidden rounded-[4px] ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
                >
                  <Image
                    src={item.image_url}
                    alt={item.caption ?? 'Foto de galería'}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>

            <Reveal variant="fade" delay={300} className="mt-8">
              <Link href="/galeria" className={goldButtonSecondary}>
                Ver toda la galería
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {config.faq.length > 0 && (
        <div className="bg-sand pt-16 md:pt-20">
          <GoldDivider />
        </div>
      )}

      {/* ============ FAQ — sand ============ */}
      {config.faq.length > 0 && (
        <section className="bg-sand pb-20 pt-8 md:pb-28 md:pt-10">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Reveal variant="fade">
              <span className={sectionLabel}>Dudas frecuentes</span>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">
                Antes de <em className="italic">pedir</em>
              </h2>
            </Reveal>

            <div className="mt-10 flex flex-col gap-6 text-left">
              {config.faq.slice(0, 3).map((item, i) => (
                <Reveal key={item.question} variant="fade" delay={i * 150}>
                  <p className="font-accent text-lg text-text">{item.question}</p>
                  <p className="mt-1 font-body text-sm text-text/70">{item.answer}</p>
                </Reveal>
              ))}
            </div>

            <Reveal variant="fade" delay={500} className="mt-10">
              <Link href="/faq" className={goldButtonSecondary}>
                Ver todas las preguntas
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ CTA final ============ */}
      <section className="bg-text py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-center">
          <GoldDivider className="mb-4" />
          <p className="font-accent text-2xl text-cream">¿Hacemos un pedido?</p>
          <a
            href={whatsappLink('Hola! Quiero hacer un pedido.')}
            target="_blank"
            rel="noopener noreferrer"
            className={goldButtonPrimaryDark}
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

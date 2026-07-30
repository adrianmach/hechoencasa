import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/data'
import { Reveal } from '@/components/site/Reveal'
import { goldButtonPrimary, sectionLabel } from '@/lib/site/ui'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Anticipación, envíos, medios de pago y todo lo que necesitás saber para pedir.',
}

export default async function FaqPage() {
  const config = await getSiteConfig()

  return (
    <div className="bg-sand py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center md:text-left">
          <Reveal variant="fade">
            <span className={sectionLabel}>Antes de pedir</span>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <h1 className="mt-3 font-accent text-3xl text-text md:text-4xl">
              Preguntas <em className="italic">frecuentes</em>
            </h1>
          </Reveal>
          <Reveal variant="fade" delay={200}>
            <p className="mt-4 font-body leading-[1.7] text-text/70">
              Todo lo que necesitás saber antes de pedir. Si tenés otra duda, escribinos por
              WhatsApp.
            </p>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={300} className="mt-10 flex flex-col divide-y divide-gold/20 border-t border-gold/20">
          {config.faq.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-accent text-lg text-text">
                {item.question}
                <span className="shrink-0 font-accent text-xl text-gold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 font-body text-sm leading-[1.7] text-text/70">{item.answer}</p>
            </details>
          ))}

          {config.faq.length === 0 && (
            <p className="py-6 font-body text-text/60">Todavía no hay preguntas cargadas.</p>
          )}
        </Reveal>

        <Reveal variant="up" delay={100} className="mt-16 bg-cream p-8 text-center">
          <h2 className="font-accent text-xl text-text">
            Cómo <em className="italic">pedir</em>
          </h2>
          <p className="mt-3 font-body text-sm leading-[1.7] text-text/70">
            Elegí tu producto en el catálogo, pedí tu presupuesto con los detalles, coordinamos
            todo por WhatsApp y te lo entregamos (o lo retirás).
          </p>
          <Link href="/cotizar" className={`mt-6 ${goldButtonPrimary}`}>
            Pedí tu presupuesto
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-4 font-body text-sm text-text/75 sm:grid-cols-2">
          <Reveal variant="up" className="bg-cream p-6 text-center md:text-left">
            <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">Anticipación</p>
            <ul className="mt-3 flex flex-col gap-1">
              <li>Tortas: {config.delivery.lead_time_tortas}</li>
              <li>Postres: {config.delivery.lead_time_postres}</li>
              <li>Alfajores: {config.delivery.lead_time_alfajores}</li>
            </ul>
            {config.delivery.urgencias_note && (
              <p className="mt-3 text-xs text-text/60">{config.delivery.urgencias_note}</p>
            )}
          </Reveal>
          <Reveal variant="up" delay={100} className="bg-cream p-6 text-center md:text-left">
            <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">
              Medios de pago
            </p>
            <p className="mt-3">{config.delivery.payment_methods.join(', ')}</p>
          </Reveal>
          <Reveal
            variant="up"
            delay={200}
            className="bg-cream p-6 text-center sm:col-span-2 md:text-left"
          >
            <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">
              Zona de retiro y envío
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              <li>Zona de retiro (Pick up): Parque Batlle.</li>
              <li>Zona de envío: Montevideo (sujeto a disponibilidad y cotización).</li>
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

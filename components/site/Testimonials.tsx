import { Reveal } from '@/components/site/Reveal'
import { GoldDivider } from '@/components/site/GoldDivider'
import { sectionLabel } from '@/lib/site/ui'
import type { Testimonial } from '@/types/database'

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null

  return (
    <section className="bg-lavender pb-20 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-6xl px-5 text-center md:text-left">
        <GoldDivider className="mb-16" />
        <Reveal variant="fade">
          <span className={sectionLabel}>Confían en nosotros</span>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h2 className="mt-3 font-accent text-3xl text-text md:text-4xl">
            Lo que dicen <em className="italic">mis clientes</em>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              variant="card"
              delay={i * 100}
              className="flex flex-col items-center gap-3 rounded-[4px] bg-cream p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:items-start md:text-left"
            >
              <div className="text-gold" aria-hidden>
                {'★'.repeat(item.rating)}
                {'☆'.repeat(Math.max(0, 5 - item.rating))}
              </div>
              <blockquote className="font-body text-sm leading-[1.7] text-text/80">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <figcaption className="mt-auto font-accent text-base text-text">
                {item.name}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

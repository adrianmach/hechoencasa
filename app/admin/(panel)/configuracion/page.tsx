import { Suspense } from 'react'
import { ToastBanner } from '@/components/admin/ToastBanner'
import { AboutForm } from '@/components/admin/AboutForm'
import { getSiteConfig } from '@/lib/data'
import { updateContact, updateDelivery, updateFaq, updateHero, updateQuoteForm } from '@/lib/actions/config'

export default async function ConfiguracionPage() {
  const config = await getSiteConfig()

  const inputClass =
    'w-full rounded-md border border-soft bg-cream px-3 py-2.5 text-brown focus:border-chocolate focus:outline-none'
  const labelClass = 'text-sm font-medium text-brown'
  const sectionClass = 'rounded-lg border border-soft bg-warm-white p-6'

  const faqText = config.faq.map((item) => `${item.question}::${item.answer}`).join('\n')

  return (
    <div>
      <Suspense>
        <ToastBanner />
      </Suspense>

      <h1 className="text-2xl font-semibold text-brown">Configuración del sitio</h1>

      <div className="mt-6 flex flex-col gap-6">
        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Portada (Hero)</h2>
          <form action={updateHero} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Título</span>
              <input name="title" defaultValue={config.hero.title} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Subtítulo</span>
              <input name="subtitle" defaultValue={config.hero.subtitle} className={inputClass} />
            </label>
            <button
              type="submit"
              className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
            >
              Guardar cambios
            </button>
          </form>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Sobre mí</h2>
          <div className="mt-4">
            <AboutForm about={config.about} />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Contacto y redes</h2>
          <form action={updateContact} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>WhatsApp (con código de país, sin +)</span>
              <input name="whatsapp" defaultValue={config.contact.whatsapp} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Instagram</span>
              <input name="instagram" defaultValue={config.contact.instagram} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>TikTok</span>
              <input name="tiktok" defaultValue={config.contact.tiktok} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Email</span>
              <input name="email" type="email" defaultValue={config.contact.email} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Barrio</span>
              <input
                name="neighborhood"
                defaultValue={config.contact.neighborhood}
                placeholder="Ej: Pocitos, Montevideo"
                className={inputClass}
              />
              <span className="text-xs text-brown/50">
                No pongas la dirección exacta, solo el barrio.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Zona de entrega</span>
              <input
                name="delivery_zone"
                defaultValue={config.contact.delivery_zone}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Horarios</span>
              <input name="hours" defaultValue={config.contact.hours} className={inputClass} />
            </label>
            <button
              type="submit"
              className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
            >
              Guardar cambios
            </button>
          </form>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Entrega y pedidos</h2>
          <p className="mt-1 text-sm text-brown/60">
            Se muestra en el footer y en la página de preguntas frecuentes.
          </p>
          <form action={updateDelivery} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Modalidad</span>
              <input name="modality" defaultValue={config.delivery.modality} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Nota sobre cadetes</span>
              <input
                name="cadete_note"
                defaultValue={config.delivery.cadete_note}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Anticipación — tortas</span>
              <input
                name="lead_time_tortas"
                defaultValue={config.delivery.lead_time_tortas}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Anticipación — postres</span>
              <input
                name="lead_time_postres"
                defaultValue={config.delivery.lead_time_postres}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Anticipación — alfajores</span>
              <input
                name="lead_time_alfajores"
                defaultValue={config.delivery.lead_time_alfajores}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Nota para urgencias</span>
              <input
                name="urgencias_note"
                defaultValue={config.delivery.urgencias_note}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Medios de pago (separados por coma)</span>
              <input
                name="payment_methods"
                defaultValue={config.delivery.payment_methods.join(', ')}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
            >
              Guardar cambios
            </button>
          </form>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Formulario de presupuesto</h2>
          <p className="mt-1 text-sm text-brown/60">Separá las opciones con comas.</p>
          <form action={updateQuoteForm} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Porciones (tortas)</span>
              <input
                name="tortaSizes"
                defaultValue={config.quote_form.tortaSizes.join(', ')}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Tamaños (postres)</span>
              <input
                name="postreSizes"
                defaultValue={config.quote_form.postreSizes.join(', ')}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Rellenos sugeridos</span>
              <input
                name="fillings"
                defaultValue={config.quote_form.fillings.join(', ')}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Coberturas</span>
              <input
                name="coatings"
                defaultValue={config.quote_form.coatings.join(', ')}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
            >
              Guardar cambios
            </button>
          </form>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-medium text-brown">Preguntas frecuentes</h2>
          <p className="mt-1 text-sm text-brown/60">
            Una pregunta por línea, con el formato: Pregunta::Respuesta
          </p>
          <form action={updateFaq} className="mt-4 flex flex-col gap-4">
            <textarea
              name="faq"
              defaultValue={faqText}
              rows={8}
              className={inputClass}
              placeholder="¿Hacen envíos?::Sí, a domicilio en Montevideo."
            />
            <button
              type="submit"
              className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
            >
              Guardar cambios
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

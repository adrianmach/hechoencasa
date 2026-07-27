'use client'

import { useTransition } from 'react'
import { ConfirmSubmitButton } from '@/components/admin/ConfirmSubmitButton'
import {
  createTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
  updateTestimonial,
} from '@/lib/actions/testimonials'
import type { Testimonial } from '@/types/database'

export function TestimonialManager({ items }: { items: Testimonial[] }) {
  const [isPending, startTransition] = useTransition()

  const inputClass =
    'w-full rounded-md border border-soft bg-cream px-3 py-2 text-sm text-brown focus:border-chocolate focus:outline-none'

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-soft bg-warm-white p-6">
        <h2 className="text-lg font-medium text-brown">Agregar testimonio</h2>
        <form action={createTestimonial} className="mt-4 flex flex-col gap-3 md:max-w-lg">
          <input name="name" placeholder="Nombre del cliente" required className={inputClass} />
          <textarea name="text" placeholder="Testimonio" required rows={3} className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-brown">
            Calificación
            <select name="rating" defaultValue="5" className="rounded-md border border-soft bg-cream px-2 py-1.5">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="w-fit rounded-md bg-chocolate px-4 py-2 text-sm font-medium text-warm-white hover:bg-caramel"
          >
            Agregar
          </button>
        </form>
      </section>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-soft bg-warm-white p-5">
            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateTestimonial(formData)
                })
              }}
              className="flex flex-col gap-3 md:max-w-lg"
            >
              <input type="hidden" name="id" value={item.id} />
              <input name="name" defaultValue={item.name} className={inputClass} />
              <textarea name="text" defaultValue={item.text} rows={3} className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-brown">
                Calificación
                <select
                  name="rating"
                  defaultValue={item.rating}
                  className="rounded-md border border-soft bg-cream px-2 py-1.5"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-fit rounded-md border border-soft px-4 py-1.5 text-sm font-medium text-brown hover:bg-cream"
                >
                  Guardar
                </button>
              </div>
            </form>

            <div className="mt-3 flex items-center gap-3 border-t border-soft pt-3">
              <form action={toggleTestimonialActive}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="current" value={String(item.is_active)} />
                <button
                  type="submit"
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.is_active ? 'bg-caramel/20 text-chocolate' : 'bg-soft/60 text-brown/60'
                  }`}
                >
                  {item.is_active ? 'Activo' : 'Inactivo'}
                </button>
              </form>

              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={item.id} />
                <ConfirmSubmitButton
                  confirmMessage={`¿Eliminar el testimonio de "${item.name}"?`}
                  className="text-sm font-medium text-red-700 hover:underline"
                >
                  Eliminar
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}

        {items.length === 0 && <p className="text-brown/60">Todavía no hay testimonios.</p>}
      </div>
    </div>
  )
}

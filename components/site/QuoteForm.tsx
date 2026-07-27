'use client'

import { useState } from 'react'
import { quoteMessage, whatsappLink } from '@/lib/whatsapp'
import { goldButtonPrimary } from '@/lib/site/ui'
import type { ProductCategory, QuoteFormConfig } from '@/types/database'

const NEED_TYPES = ['Torta de cumpleaños', 'Torta para evento', 'Postre personalizado', 'Otro']

function defaultNeedType(productCategory?: ProductCategory) {
  if (productCategory === 'postres') return 'Postre personalizado'
  if (productCategory === 'tortas') return NEED_TYPES[0]
  return NEED_TYPES[0]
}

export function QuoteForm({
  quoteConfig,
  productName,
  productCategory,
}: {
  quoteConfig: QuoteFormConfig
  productName?: string
  productCategory?: ProductCategory
}) {
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [needType, setNeedType] = useState(defaultNeedType(productCategory))
  const isPostre = needType === 'Postre personalizado'
  const sizeOptions = isPostre ? quoteConfig.postreSizes : quoteConfig.tortaSizes
  const [size, setSize] = useState(sizeOptions[0] ?? '')
  const [filling, setFilling] = useState('')
  const [coating, setCoating] = useState(quoteConfig.coatings[0] ?? '')
  const [theme, setTheme] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [comments, setComments] = useState('')
  const [sent, setSent] = useState(false)

  function handleNeedTypeChange(value: string) {
    setNeedType(value)
    const nextSizes = value === 'Postre personalizado' ? quoteConfig.postreSizes : quoteConfig.tortaSizes
    setSize(nextSizes[0] ?? '')
  }

  function addFillingSuggestion(suggestion: string) {
    setFilling((prev) => {
      if (!prev.trim()) return suggestion
      const parts = prev
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      if (parts.includes(suggestion)) return prev
      return [...parts, suggestion].join(', ')
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const message = quoteMessage({
      customerName,
      phone,
      needType,
      size,
      filling,
      coating,
      theme,
      deliveryDate,
      personalMessage,
      comments,
      productName,
    })

    setSent(true)
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  const inputClass = 'field-underline font-body'
  const labelClass = 'font-body text-xs font-medium uppercase tracking-[0.15em] text-gold'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {productName && (
        <p className="border-l-2 border-gold bg-cream px-4 py-3 font-body text-sm text-text/80">
          Producto seleccionado: <span className="font-medium text-text">{productName}</span>
        </p>
      )}

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Nombre</span>
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className={inputClass}
          placeholder="Tu nombre"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Teléfono</span>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="09X XXX XXX"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>¿Qué necesitás?</span>
        <select
          value={needType}
          onChange={(e) => handleNeedTypeChange(e.target.value)}
          className={inputClass}
        >
          {NEED_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{isPostre ? 'Tamaño' : 'Porciones'}</span>
        <select value={size} onChange={(e) => setSize(e.target.value)} className={inputClass}>
          {sizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Relleno</span>
        <input
          value={filling}
          onChange={(e) => setFilling(e.target.value)}
          className={inputClass}
          placeholder="Ej: Dulce de leche, frutilla..."
        />
        {quoteConfig.fillings.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {quoteConfig.fillings.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => addFillingSuggestion(suggestion)}
                className="border border-gold/40 px-3 py-1 font-body text-xs text-text/70 transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Cobertura</span>
        <select
          value={coating}
          onChange={(e) => setCoating(e.target.value)}
          className={inputClass}
        >
          {quoteConfig.coatings.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Temática / decoración</span>
        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={inputClass}
          placeholder="Ej: infantil, elegante, colores..."
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Fecha de entrega</span>
        <input
          required
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className={inputClass}
        />
      </label>

      <p className="border-l-2 border-gold bg-sand/50 px-4 py-3 font-body text-sm text-text/80">
        Si tenés una foto de referencia, enviala junto con este mensaje por WhatsApp.
      </p>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Mensaje personalizado</span>
        <input
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
          className={inputClass}
          placeholder='Ej: "Feliz cumpleaños Sofi"'
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Comentarios adicionales</span>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className={inputClass}
          rows={4}
          placeholder="Alergias, referencias, etc."
        />
      </label>

      <button type="submit" className={`mt-2 w-fit ${goldButtonPrimary}`}>
        Armar mensaje y abrir WhatsApp
      </button>

      {sent && (
        <p className="border-l-2 border-gold bg-sage/50 px-4 py-3 font-body text-sm text-text">
          ¡Listo! Se abrió WhatsApp con tu mensaje armado. Si no se abrió, revisá que el navegador
          no haya bloqueado la ventana emergente.
        </p>
      )}
    </form>
  )
}

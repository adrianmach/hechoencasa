const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function productMessage(name: string, price: number | null) {
  if (price != null) {
    return `Hola! Me interesa pedir: ${name} ($${price})`
  }
  return `Hola! Quiero pedir ${name}`
}

interface QuoteMessageInput {
  customerName: string
  phone: string
  needType: string
  size: string
  filling: string
  coating: string
  theme: string
  deliveryDate: string
  personalMessage: string
  comments: string
  productName?: string
}

export function quoteMessage(input: QuoteMessageInput) {
  const lines = [
    'Hola! Quiero pedir un presupuesto.',
    '',
    `Nombre: ${input.customerName}`,
    `Teléfono: ${input.phone}`,
  ]

  if (input.productName) {
    lines.push(`Producto: ${input.productName}`)
  }

  lines.push(
    `¿Qué necesitás?: ${input.needType}`,
    `Tamaño / porciones: ${input.size}`,
    `Relleno: ${input.filling}`,
    `Cobertura: ${input.coating}`
  )

  if (input.theme.trim()) {
    lines.push(`Temática / decoración: ${input.theme}`)
  }

  lines.push(`Fecha de entrega: ${input.deliveryDate}`)

  if (input.personalMessage.trim()) {
    lines.push(`Mensaje personalizado: ${input.personalMessage}`)
  }

  if (input.comments.trim()) {
    lines.push('', `Comentarios: ${input.comments}`)
  }

  lines.push('', 'Si tengo una foto de referencia, la mando junto con este mensaje.')

  return lines.join('\n')
}

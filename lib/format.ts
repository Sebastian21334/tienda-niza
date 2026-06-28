export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export function whatsappLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function productInquiryMessage(productName: string): string {
  return `Hola, me interesa el producto: ${productName}`
}

export function comboInquiryMessage(comboName: string): string {
  return `Hola, me interesa el combo: ${comboName}`
}

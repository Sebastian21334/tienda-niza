import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/format'

interface WhatsappCtaProps {
  phone: string
  message: string
  label?: string
}

export function WhatsappCta({
  phone,
  message,
  label = 'Consultar por WhatsApp',
}: WhatsappCtaProps) {
  return (
    <a
      href={whatsappLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
    >
      <MessageCircle className="size-5" />
      {label}
    </a>
  )
}

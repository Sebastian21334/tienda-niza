import { Gift, HeartHandshake, ShieldCheck, Truck } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'

const items = [
  {
    icon: Truck,
    title: 'Envíos coordinados',
    text: 'Llegamos a todo el país de forma segura.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra acompañada',
    text: 'Confirmamos cada detalle antes del envío.',
  },
  {
    icon: Gift,
    title: 'Listo para regalar',
    text: 'Presentación cuidada en cada pedido.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención cercana',
    text: 'Te asesoramos personalmente por WhatsApp.',
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border/70 bg-card/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(({ icon: Icon, title, text }, index) => (
          <Reveal
            key={title}
            delay={index * 70}
            className="group flex flex-col items-center border-border/70 px-3 py-7 text-center sm:px-6 lg:items-start lg:text-left [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-gold/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
              <Icon className="size-4 text-gold" />
            </span>
            <h3 className="mt-3 font-sans text-sm font-medium tracking-tight">{title}</h3>
            <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

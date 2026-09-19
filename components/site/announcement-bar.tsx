import { Gem, Gift, MapPin, Sparkles } from 'lucide-react'

const benefits = [
  { icon: MapPin, label: 'Envíos a todo el país' },
  { icon: Sparkles, label: 'Piezas seleccionadas' },
  { icon: Gift, label: 'Packaging para regalar' },
  { icon: Gem, label: 'Asesoramiento personalizado' },
]

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-foreground text-background">
      <div className="announcement-track flex h-8 w-max items-center gap-10 px-5 text-[10px] uppercase tracking-[0.18em] sm:h-9 sm:w-full sm:justify-center lg:gap-14">
        {[...benefits, ...benefits].map(({ icon: Icon, label }, index) => (
          <span
            key={`${label}-${index}`}
            className={index >= benefits.length ? 'flex shrink-0 items-center gap-2 sm:hidden' : 'flex shrink-0 items-center gap-2'}
          >
            <Icon className="size-3 text-gold" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

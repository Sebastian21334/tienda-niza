import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Quote, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'

export function ExperienceSection() {
  return (
    <section className="overflow-hidden bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal direction="left" className="relative min-h-[420px] lg:min-h-[620px]">
          <Image
            src="/images/about.png"
            alt="Detalle de una pieza de joyería Niza"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover opacity-90 transition-transform duration-[1400ms] hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent lg:bg-gradient-to-r" />
          <span className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur-md">
            Detalles que hacen la diferencia
          </span>
        </Reveal>

        <div className="relative flex items-center px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute right-8 top-8 size-40 rounded-full bg-gold/10 blur-3xl" />
          <Reveal direction="right" className="relative max-w-lg">
            <span className="text-xs uppercase tracking-[0.24em] text-gold">La experiencia Niza</span>
            <h2 className="mt-5 text-balance font-heading text-4xl leading-tight sm:text-5xl">
              Elegir una joya también puede ser un momento especial
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-background/65">
              Te ayudamos a encontrar esa pieza que se siente propia. Atención cercana,
              recomendaciones honestas y una presentación pensada hasta el último detalle.
            </p>

            <div className="mt-9 border-l border-gold/50 pl-5">
              <Quote className="size-5 text-gold/70" />
              <p className="mt-3 font-heading text-xl leading-relaxed text-background/90">
                Cada pedido merece sentirse único, desde la elección de la pieza hasta el momento de abrirlo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Sparkles className="size-3.5 text-gold" />
                <span className="text-xs uppercase tracking-[0.16em] text-background/50">Nuestra promesa</span>
              </div>
            </div>

            <Link
              href="/contacto"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-gold"
            >
              Recibir asesoramiento
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

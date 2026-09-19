import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import { Reveal } from '@/components/motion/reveal'
import type { Category } from '@/types'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section id="categorias" className="relative mx-auto max-w-7xl scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <CornerFlourish corner="top-right" size={150} opacity={0.3} className="hidden lg:block" />

      <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          Explorá
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
          Nuestras categorías
        </h2>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Encontrá esa pieza que completa tu estilo y te acompaña en cada ocasión.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {categories.map((category, index) => (
          <Reveal key={category.id} delay={index * 90}>
          <Link
            href={`/tienda?category=${category.slug}`}
            className="image-shine group relative block overflow-hidden rounded-2xl ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10"
          >
            <div className="relative aspect-[3/4] bg-muted">
              <Image
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent transition-opacity duration-300 group-hover:from-foreground/80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
              <div>
                <h3 className="font-heading text-xl text-background">
                  {category.name}
                </h3>
                <span className="mt-0.5 inline-block text-xs text-background/80">
                  Ver productos
                </span>
              </div>

              <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/15 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-accent/90">
                <ArrowUpRight className="h-3.5 w-3.5 text-background" />
              </span>
            </div>
          </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

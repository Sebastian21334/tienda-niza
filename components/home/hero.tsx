import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import { whatsappLink } from '@/lib/format'
import type { StoreConfig } from '@/types'

export function Hero({ store }: { store: StoreConfig }) {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <CornerFlourish corner="top-left" size={160} opacity={0.25} className="hidden lg:block" />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
            {store.name} · Accesorios
          </span>

          <h1 className="mt-5 text-balance font-heading text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            {store.slogan}
          </h1>

          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {store.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/tienda" />}
              nativeButton={false}
              size="lg"
              className="group rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <Button
              render={
                <a
                  href={whatsappLink(
                    store.whatsapp,
                    `Hola ${store.name}, quiero hacer una consulta.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              size="lg"
              variant="outline"
              className="rounded-full border-foreground/15 transition-colors hover:border-accent/40 hover:bg-secondary"
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/5 ring-1 ring-black/5 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={store.heroImage || '/images/hero.png'}
              alt="Selección de joyería premium de la marca"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          </div>

          <CornerFlourish
            corner="bottom-right"
            size={130}
            opacity={0.3}
            withSpark
            className="hidden sm:block"
          />
        </div>
      </div>
    </section>
  )
}

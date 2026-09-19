import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import { whatsappLink } from '@/lib/format'
import type { StoreConfig } from '@/types'

export function Hero({ store }: { store: StoreConfig }) {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
      <CornerFlourish corner="top-left" size={160} opacity={0.25} className="hidden lg:block" />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 lg:order-1">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
            {store.name} · Accesorios
          </span>

          <h1 className="text-shimmer mt-5 text-balance font-heading text-5xl leading-[1.02] sm:text-6xl lg:text-[5.25rem]">
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

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-gold" /> Compra segura y acompañada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-gold" /> Selección cuidada
            </span>
          </div>
        </div>

        <div className="order-1 animate-in fade-in zoom-in-95 duration-1000 lg:order-2">
          <div className="image-shine group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={store.heroImage || '/images/hero.png'}
              alt="Selección de joyería premium de la marca"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            <div className="float-soft absolute bottom-5 left-5 rounded-2xl border border-white/25 bg-background/82 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-xl sm:bottom-7 sm:left-7">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Colección actual</p>
              <p className="mt-1 font-heading text-lg text-foreground">Piezas para todos los días</p>
            </div>
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

      <a
        href="#categorias"
        className="group absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground lg:flex"
      >
        Descubrir
        <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-1" />
      </a>
    </section>
  )
}

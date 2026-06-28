import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/format'
import type { StoreConfig } from '@/types'

export function Hero({ store }: { store: StoreConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent">
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
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
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
              className="rounded-full border-foreground/20 hover:bg-secondary"
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/hero.png"
              alt="Selección de joyería premium de la marca"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

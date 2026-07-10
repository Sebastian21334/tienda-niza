import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StoreConfig } from '@/types'

export function AboutStrip({ store }: { store: StoreConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-card lg:grid-cols-12">
        <div className="relative aspect-square min-h-72 lg:col-span-5">
          <Image
            src={store.aboutImage || '/images/about.png'}
            alt="Detalle de joyería usada"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="px-6 py-10 lg:col-span-7 lg:px-12">
          <span className="text-xs uppercase tracking-[0.2em] text-accent">
            Sobre {store.name}
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            Piezas pensadas para acompañarte todos los días
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
          Niza nació en La Paz, Entre Ríos, con el objetivo de acercar accesorios que 
          combinen estilo y versatilidad. Hoy también llegamos a Villa María, Córdoba, 
          ofreciendo piezas seleccionadas para realzar cada momento y acompañarte en tu día a día.
          </p>
          <Button
            render={<Link href="/contacto" />}
            nativeButton={false}
            variant="outline"
            className="mt-8 rounded-full border-foreground/20 hover:bg-secondary"
          >
            Conocenos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

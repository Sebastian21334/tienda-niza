import type { Metadata } from 'next'
import { Clock, MapPin, MessageCircle } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/format'
import { getStoreConfig } from '@/services/store-service'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = {
  title: 'Contacto',
}

export default async function ContactPage() {
  const store = await getStoreConfig()

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          Estamos para ayudarte
        </span>
        <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
          Contacto
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          ¿Tenés una consulta sobre un producto o querés un asesoramiento
          personalizado? Escribinos por WhatsApp y te respondemos a la brevedad.
        </p>
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
          className="mt-8 rounded-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
        >
          <MessageCircle className="h-5 w-5" />
          Escribir por WhatsApp
        </Button>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
        {store.address && (
          <Reveal className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl hover:shadow-black/5">
            <MapPin className="mx-auto h-6 w-6 text-accent" />
            <h2 className="mt-3 font-heading text-lg">Dirección</h2>
            <p className="mt-1 text-sm text-muted-foreground">{store.address}</p>
          </Reveal>
        )}
        {store.hours && (
          <Reveal delay={80} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl hover:shadow-black/5">
            <Clock className="mx-auto h-6 w-6 text-accent" />
            <h2 className="mt-3 font-heading text-lg">Horarios</h2>
            <p className="mt-1 text-sm text-muted-foreground">{store.hours}</p>
          </Reveal>
        )}
        {store.instagram && (
          <Reveal delay={160} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl hover:shadow-black/5">
            <FaInstagram className="mx-auto h-6 w-6 text-accent" />
            <h2 className="mt-3 font-heading text-lg">Instagram</h2>
            <a
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              @{store.instagram}
            </a>
          </Reveal>
        )}
      </div>
    </div>
  )
}

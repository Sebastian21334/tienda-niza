import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import type { Category, StoreConfig } from '@/types'

interface SiteFooterProps {
  store: StoreConfig
  categories: Category[]
}

export function SiteFooter({ store, categories }: SiteFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <CornerFlourish corner="top-right" size={180} opacity={0.2} className="hidden md:block" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-heading text-2xl">{store.name}</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              {store.footerInfo}
            </p>
            <div className="mt-5 flex gap-3">
              {store.instagram && (
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-sidebar-border p-2 transition-colors hover:border-sidebar-primary hover:text-sidebar-primary active:bg-sidebar-border/20"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
              )}
              {store.facebook && (
                <a
                  href={`https://facebook.com/${store.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-full border border-sidebar-border p-2 transition-colors hover:border-sidebar-primary hover:text-sidebar-primary active:bg-sidebar-border/20"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-sidebar-foreground/90">
              Catálogo
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sidebar-foreground/70">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tienda?category=${c.slug}`}
                    className="transition-colors hover:text-sidebar-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/combos"
                  className="transition-colors hover:text-sidebar-primary"
                >
                  Combos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-sidebar-foreground/90">
              Tienda
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sidebar-foreground/70">
              <li>
                <Link href="/tienda" className="transition-colors hover:text-sidebar-primary">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition-colors hover:text-sidebar-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-sidebar-foreground/90">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
              {store.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                  <span>{store.address}</span>
                </li>
              )}
              {store.hours && (
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                  <span>{store.hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {store.name}. Todos los derechos
            reservados.
          </p>
          <p>{store.slogan}</p>
        </div>
      </div>
    </footer>
  )
}

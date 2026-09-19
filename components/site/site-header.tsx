'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import { whatsappLink } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CartDrawer } from '@/components/cart/cart-drawer'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Catálogo' },
  { href: '/combos', label: 'Combos' },
  { href: '/contacto', label: 'Contacto' },
]

interface SiteHeaderProps {
  storeName: string
  whatsapp: string
  instagram: string
}

export function SiteHeader({ storeName, whatsapp, instagram }: SiteHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const waLink = whatsappLink(whatsapp, `Hola ${storeName}, quiero hacer una consulta.`)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/88 shadow-[0_8px_30px_rgb(52_43_32/0.025)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Abrir menú" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background">
              <div className="relative flex h-full flex-col overflow-hidden px-6 py-6">
                <CornerFlourish corner="bottom-right" size={140} opacity={0.25} />

                <SheetTitle className="font-heading text-2xl">
                  {storeName}
                </SheetTitle>
                <span className="-mt-1 block text-[11px] uppercase tracking-[0.2em] text-accent">
                  Accesorios
                </span>

                <nav className="mt-8 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-md px-3 py-3 text-sm transition-colors hover:bg-secondary active:bg-secondary',
                        isActive(link.href)
                          ? 'font-medium text-accent'
                          : 'text-foreground',
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6">
                  <Button
                    render={
                      <a href={waLink} target="_blank" rel="noopener noreferrer" />
                    }
                    nativeButton={false}
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Contactar por WhatsApp
                  </Button>

                  {instagram && (
                    <a
                      href={`https://instagram.com/${instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full border border-foreground/15 py-2 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent active:bg-secondary"
                    >
                      <FaInstagram className="h-4 w-4" />
                      Seguinos en Instagram
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href="/"
          className="group relative font-heading text-2xl tracking-tight text-foreground"
        >
          {storeName}
          <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-500 group-hover:w-full" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative py-2 text-sm transition-colors duration-300 hover:text-accent',
                isActive(link.href)
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-accent'
                  : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CartDrawer />

          <Button
            render={<Link href="/tienda" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            aria-label="Buscar productos"
            className="hover:text-accent"
          >
            <Search className="h-5 w-5" />
          </Button>

          {instagram && (
            <Button
              render={
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="ghost"
              size="icon"
              aria-label="Instagram"
              className="hidden hover:text-accent sm:inline-flex"
            >
              <FaInstagram className="h-5 w-5" />
            </Button>
          )}

          {/* Desktop / tablet: botón completo con texto */}
          <Button
            render={<a href={waLink} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="sm"
            className="ml-1 hidden rounded-full bg-foreground text-background hover:bg-foreground/90 sm:inline-flex"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </header>
  )
}

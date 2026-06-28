'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { whatsappLink } from '@/lib/format'
import { cn } from '@/lib/utils'

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

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
              <SheetTitle className="font-heading text-2xl">
                {storeName}
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-secondary',
                      isActive(link.href)
                        ? 'font-medium text-accent'
                        : 'text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href="/"
          className="font-heading text-2xl tracking-tight text-foreground"
        >
          {storeName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm transition-colors hover:text-accent',
                isActive(link.href)
                  ? 'text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-accent'
                  : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            render={<Link href="/tienda" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            aria-label="Buscar productos"
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
              className="hidden sm:inline-flex"
            >
              <FaInstagram className="h-5 w-5" />
            </Button>
          )}
          <Button
            render={
              <a
                href={whatsappLink(whatsapp, `Hola ${storeName}, quiero hacer una consulta.`)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
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

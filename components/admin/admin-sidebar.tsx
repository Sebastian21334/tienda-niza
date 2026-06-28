'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/(panel)/actions'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '▪' },
  { href: '/admin/productos', label: 'Productos', icon: '▪' },
  { href: '/admin/categorias', label: 'Categorías', icon: '▪' },
  { href: '/admin/combos', label: 'Combos', icon: '▪' },
  { href: '/admin/tienda', label: 'Tienda', icon: '▪' },
]

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Admin
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm transition-colors',
              isActive(link.href)
                ? 'bg-secondary font-medium text-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}

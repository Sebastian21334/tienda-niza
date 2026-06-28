import Link from 'next/link'
import { getDashboardStats } from '@/services/store-service'

const cards = [
  { key: 'totalProducts', label: 'Productos', href: '/admin/productos' },
  { key: 'totalCategories', label: 'Categorías', href: '/admin/categorias' },
  { key: 'totalCombos', label: 'Combos', href: '/admin/combos' },
  { key: 'featured', label: 'Destacados', href: '/admin/productos' },
  { key: 'outOfStock', label: 'Sin stock', href: '/admin/productos' },
] as const

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de tu tienda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-heading text-3xl text-foreground">
              {stats[card.key]}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg text-foreground">
          Productos por categoría
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {stats.categoryBreakdown.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-sm text-foreground">
                {c.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width: `${
                      stats.totalProducts > 0
                        ? (c.count / stats.totalProducts) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm text-muted-foreground">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

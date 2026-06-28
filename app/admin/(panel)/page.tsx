import { getProducts } from '@/services/product-service'
import { getCategories } from '@/services/category-service'
import { getCombos } from '@/services/combo-service'
import { getStoreConfig } from '@/services/store-service'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [{ total: totalProducts }, categories, combos, store] =
    await Promise.all([
      getProducts({ page: 1, perPage: 1 }),
      getCategories(),
      getCombos(),
      getStoreConfig(),
    ])

  const stats = [
    {
      label: 'Productos',
      value: totalProducts,
      href: '/admin/productos',
    },
    {
      label: 'Categorías',
      value: categories.length,
      href: '/admin/categorias',
    },
    {
      label: 'Combos',
      value: combos.length,
      href: '/admin/combos',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bienvenido al panel de {store.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-heading text-4xl text-foreground">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg text-foreground">
          Accesos rápidos
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/productos/nuevo"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            + Nuevo producto
          </Link>
          <Link
            href="/admin/categorias/nueva"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            + Nueva categoría
          </Link>
          <Link
            href="/admin/combos/nuevo"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            + Nuevo combo
          </Link>
          <Link
            href="/admin/tienda"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            Editar tienda
          </Link>
        </div>
      </div>
    </div>
  )
}

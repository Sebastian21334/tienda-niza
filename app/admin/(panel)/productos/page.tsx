import Link from 'next/link'
import { getAllProducts } from '@/services/product-service'
import { getCategories } from '@/services/category-service'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])

  const categoryById = new Map(categories.map((c) => [c.id, c]))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-foreground">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">No hay productos todavía.</p>
          <Link
            href="/admin/productos/nuevo"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Categoría
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Precio
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Stock
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {categoryById.get(product.categoryId)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    ${product.price.toLocaleString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={
                        product.available
                          ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      {product.available ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

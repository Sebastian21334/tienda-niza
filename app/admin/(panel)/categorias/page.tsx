import Link from 'next/link'
import { getCategories, countProductsByCategory } from '@/services/category-service'
import { DeleteCategoryButton } from '@/components/admin/delete-category-button'

export default async function CategoriasPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-foreground">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + Nueva categoría
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">No hay categorías todavía.</p>
          <Link
            href="/admin/categorias/nueva"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Crear la primera
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Descripción</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Productos</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Orden</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {cat.description || '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {countProductsByCategory(cat.id)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{cat.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categorias/${cat.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Editar
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
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

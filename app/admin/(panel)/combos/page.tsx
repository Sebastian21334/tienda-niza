import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAllCombos } from '@/services/combo-service'
import { DeleteComboButton } from '@/components/admin/delete-combo-button'

export default async function AdminCombosPage() {
  const combos = await getAllCombos()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Combos</h1>
          <p className="text-sm text-muted-foreground">
            {combos.length} combo{combos.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button render={<Link href="/admin/combos/nuevo" />} nativeButton={false}>
          + Nuevo combo
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo) => (
              <tr key={combo.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{combo.name}</td>
                <td className="px-4 py-3 text-foreground">${combo.price}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {combo.productIds.length}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      combo.available
                        ? 'rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent'
                        : 'rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground'
                    }
                  >
                    {combo.available ? 'Disponible' : 'Oculto'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/combos/${combo.id}`}
                      className="text-sm text-foreground transition-colors hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteComboButton id={combo.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {combos.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Todavía no creaste ningún combo.
          </p>
        )}
      </div>
    </div>
  )
}

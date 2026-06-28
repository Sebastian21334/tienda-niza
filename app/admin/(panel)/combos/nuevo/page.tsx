import { ComboForm } from '@/components/admin/combo-form'
import { createComboAction } from '@/app/admin/(panel)/combos/combo-actions'
import { getAllProducts } from '@/services/product-service'

export default async function NewComboPage() {
  const products = await getAllProducts()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Nuevo combo</h1>
        <p className="text-sm text-muted-foreground">
          Armá un set de productos con un precio especial.
        </p>
      </div>

      <ComboForm products={products} action={createComboAction} />
    </div>
  )
}

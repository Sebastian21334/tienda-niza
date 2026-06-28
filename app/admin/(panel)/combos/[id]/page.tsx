import { notFound } from 'next/navigation'
import { ComboForm } from '@/components/admin/combo-form'
import { updateComboAction } from '@/app/admin/(panel)/combos/combo-actions'
import { getComboById } from '@/services/combo-service'
import { getAllProducts } from '@/services/product-service'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditComboPage({ params }: PageProps) {
  const { id } = await params
  const [combo, products] = await Promise.all([
    getComboById(id),
    getAllProducts(),
  ])

  if (!combo) notFound()

  const action = updateComboAction.bind(null, id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">
          Editar combo
        </h1>
        <p className="text-sm text-muted-foreground">{combo.name}</p>
      </div>

      <ComboForm combo={combo} products={products} action={action} />
    </div>
  )
}

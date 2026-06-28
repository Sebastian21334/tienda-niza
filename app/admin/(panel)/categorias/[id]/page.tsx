import { notFound } from 'next/navigation'
import { getCategoryById } from '@/services/category-service'
import { CategoryForm } from '@/components/admin/category-form'
import { updateCategoryAction } from '@/app/admin/(panel)/categorias/category-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params
  const category = await getCategoryById(id)
  if (!category) notFound()

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl text-foreground">Editar categoría</h1>
      <div className="max-w-2xl">
        <CategoryForm action={updateCategoryAction} category={category} />
      </div>
    </div>
  )
}

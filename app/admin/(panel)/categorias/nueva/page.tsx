import { CategoryForm } from '@/components/admin/category-form'
import { createCategoryAction } from '@/app/admin/(panel)/categorias/category-actions'

export default function NuevaCategoriaPage() {
  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl text-foreground">Nueva categoría</h1>
      <div className="max-w-2xl">
        <CategoryForm action={createCategoryAction} />
      </div>
    </div>
  )
}

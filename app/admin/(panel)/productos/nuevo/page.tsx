import { getCategories } from '@/services/category-service'
import { ProductForm } from '@/components/admin/product-form'
import { createProductAction } from '@/app/admin/(panel)/productos/product-actions'

export default async function NuevoProductoPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl text-foreground">
        Nuevo producto
      </h1>
      <div className="max-w-2xl">
        <ProductForm action={createProductAction} categories={categories} />
      </div>
    </div>
  )
}

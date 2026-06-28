import { notFound } from 'next/navigation'
import { getProductById } from '@/services/product-service'
import { getCategories } from '@/services/category-service'
import { ProductForm } from '@/components/admin/product-form'
import { updateProductAction } from '@/app/admin/(panel)/productos/product-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl text-foreground">
        Editar producto
      </h1>
      <div className="max-w-2xl">
        <ProductForm
          action={updateProductAction}
          categories={categories}
          product={product}
        />
      </div>
    </div>
  )
}

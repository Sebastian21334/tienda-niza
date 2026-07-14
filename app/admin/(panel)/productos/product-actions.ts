'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/product-service'
import type { ProductInput } from '@/services/product-service'

function parseProductForm(formData: FormData): ProductInput {
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    compareAtPrice: formData.get('compareAtPrice')
      ? parseFloat(formData.get('compareAtPrice') as string)
      : undefined,
    stock: parseInt(formData.get('stock') as string, 10),
    material: formData.get('material') as string,
    categoryId: formData.get('categoryId') as string,
    featured: formData.get('featured') === 'on',
    bestSeller: formData.get('bestSeller') === 'on',
    newArrival: formData.get('newArrival') === 'on',
    available: formData.get('available') === 'on',
    images,
  }
}

export async function createProductAction(_prev: unknown, formData: FormData) {
  const input = parseProductForm(formData)

  if (!input.name || !input.categoryId || isNaN(input.price)) {
    return { error: 'Completá los campos obligatorios.' }
  }

  await createProduct(input)
  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/tienda')
  redirect('/admin/productos')
}

export async function updateProductAction(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const input = parseProductForm(formData)

  const updated = await updateProduct(id, input)
  if (!updated) return { error: 'Producto no encontrado.' }

  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/tienda')
  redirect('/admin/productos')
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id)
  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/tienda')
}
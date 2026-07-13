'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category-service'
import type { CategoryInput } from '@/services/category-service'

function parseCategoryForm(formData: FormData): CategoryInput {
  return {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    image: formData.get('image') as string,
    order: parseInt(formData.get('order') as string, 10) || 0,
  }
}

export async function createCategoryAction(_prev: unknown, formData: FormData) {
  const input = parseCategoryForm(formData)
  if (!input.name) return { error: 'El nombre es obligatorio.' }
  await createCategory(input)
  revalidatePath('/admin/categorias')
  revalidatePath('/') // 👈 agregado
  redirect('/admin/categorias')
}

export async function updateCategoryAction(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const input = parseCategoryForm(formData)
  const updated = await updateCategory(id, input)
  if (!updated) return { error: 'Categoría no encontrada.' }
  revalidatePath('/admin/categorias')
  revalidatePath('/') // 👈 agregado
  redirect('/admin/categorias')
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id)
  revalidatePath('/admin/categorias')
  revalidatePath('/') // 👈 agregado
}
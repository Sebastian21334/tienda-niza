'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createCombo,
  updateCombo,
  deleteCombo,
  type ComboInput,
} from '@/services/combo-service'

function parseComboForm(formData: FormData): ComboInput | { error: string } {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const priceRaw = formData.get('price') as string
  const compareAtPriceRaw = formData.get('compareAtPrice') as string
  const imagesRaw = (formData.get('images') as string) ?? ''
  const available = formData.get('available') === 'on'
  const productIds = formData.getAll('productIds') as string[]

  if (!name || !description || !priceRaw) {
    return { error: 'Completá nombre, descripción y precio.' }
  }

  if (productIds.length === 0) {
    return { error: 'Seleccioná al menos un producto para el combo.' }
  }

  const price = Number(priceRaw)
  if (Number.isNaN(price) || price <= 0) {
    return { error: 'El precio no es válido.' }
  }

  let compareAtPrice: number | undefined = undefined
  if (compareAtPriceRaw) {
    compareAtPrice = Number(compareAtPriceRaw)
    if (Number.isNaN(compareAtPrice)) {
      return { error: 'El precio de comparación no es válido.' }
    }
  }

  const images = imagesRaw
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean)

  return {
    name,
    description,
    price,
    compareAtPrice,
    productIds,
    images,
    available,
  }
}

export async function createComboAction(_prev: unknown, formData: FormData) {
  const result = parseComboForm(formData)
  if ('error' in result) return result

  await createCombo(result)
  revalidatePath('/admin/combos')
  revalidatePath('/')
  revalidatePath('/tienda')
  redirect('/admin/combos')
}

export async function updateComboAction(
  id: string,
  _prev: unknown,
  formData: FormData,
) {
  const result = parseComboForm(formData)
  if ('error' in result) return result

  await updateCombo(id, result)
  revalidatePath('/admin/combos')
  revalidatePath('/')
  revalidatePath('/tienda')
  redirect('/admin/combos')
}

export async function deleteComboAction(id: string) {
  await deleteCombo(id)
  revalidatePath('/admin/combos')
  revalidatePath('/')
  revalidatePath('/tienda')
}
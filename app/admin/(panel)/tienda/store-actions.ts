'use server'

import { revalidatePath } from 'next/cache'
import { updateStoreConfig } from '@/services/store-service'

export async function updateStoreAction(_prev: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const slogan = (formData.get('slogan') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const whatsapp = (formData.get('whatsapp') as string)?.trim()
  const instagram = (formData.get('instagram') as string)?.trim()
  const facebook = (formData.get('facebook') as string)?.trim()
  const address = (formData.get('address') as string)?.trim()
  const hours = (formData.get('hours') as string)?.trim()
  const footerInfo = (formData.get('footerInfo') as string)?.trim()
  const logo = (formData.get('logo') as string)?.trim()

  if (!name || !whatsapp) {
    return { error: 'El nombre y el WhatsApp son obligatorios.' }
  }

  await updateStoreConfig({
    name,
    slogan,
    description,
    whatsapp,
    instagram,
    facebook,
    address,
    hours,
    footerInfo,
    logo,
  })

  revalidatePath('/admin/tienda')
  revalidatePath('/')

  return { success: true }
}

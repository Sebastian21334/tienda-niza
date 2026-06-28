import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(10, 'Agregá una descripción más detallada'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  compareAtPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  material: z.string().min(2, 'El material es obligatorio'),
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  available: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'Agregá al menos una imagen'),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(2, 'Agregá una descripción'),
  image: z.string().min(1, 'Agregá una imagen'),
  order: z.coerce.number().int().min(0),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const comboSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(10, 'Agregá una descripción más detallada'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  compareAtPrice: z.coerce.number().min(0).optional(),
  productIds: z.array(z.string()).min(1, 'Seleccioná al menos un producto'),
  images: z.array(z.string()).min(1, 'Agregá al menos una imagen'),
  available: z.boolean().default(true),
})

export type ComboFormValues = z.infer<typeof comboSchema>

export const storeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  logo: z.string().optional().default(''),
  slogan: z.string().min(1, 'El eslogan es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  whatsapp: z.string().min(6, 'Ingresá un número válido'),
  instagram: z.string().optional().default(''),
  facebook: z.string().optional().default(''),
  address: z.string().optional().default(''),
  hours: z.string().optional().default(''),
  footerInfo: z.string().optional().default(''),
})

export type StoreFormValues = z.infer<typeof storeSchema>

export const loginSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

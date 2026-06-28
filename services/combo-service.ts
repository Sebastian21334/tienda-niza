import { prisma } from '@/lib/prisma'
import type { Combo } from '@/types'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type PrismaCombo = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice: number | null
  productIds: string[]
  images: string[]
  available: boolean
  createdAt: Date
}

function mapCombo(c: PrismaCombo): Combo {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    price: c.price,
    compareAtPrice: c.compareAtPrice ?? undefined,
    productIds: c.productIds,
    images: c.images,
    available: c.available,
    createdAt: c.createdAt.toISOString().slice(0, 10),
  }
}

export async function getCombos(): Promise<Combo[]> {
  const rows = await prisma.combo.findMany({ where: { available: true } })
  return rows.map(mapCombo)
}

export async function getAllCombos(): Promise<Combo[]> {
  const rows = await prisma.combo.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapCombo)
}

export async function getComboBySlug(
  slug: string,
): Promise<Combo | undefined> {
  const c = await prisma.combo.findUnique({ where: { slug } })
  return c ? mapCombo(c) : undefined
}

export async function getComboById(id: string): Promise<Combo | undefined> {
  const c = await prisma.combo.findUnique({ where: { id } })
  return c ? mapCombo(c) : undefined
}

export type ComboInput = Omit<Combo, 'id' | 'slug' | 'createdAt'>

export async function createCombo(input: ComboInput): Promise<Combo> {
  const created = await prisma.combo.create({
    data: {
      id: `combo-${slugify(input.name)}-${Date.now()}`,
      slug: `${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name,
      description: input.description,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      productIds: input.productIds,
      images: input.images,
      available: input.available,
    },
  })
  return mapCombo(created)
}

export async function updateCombo(
  id: string,
  input: Partial<ComboInput>,
): Promise<Combo | undefined> {
  try {
    const updated = await prisma.combo.update({
      where: { id },
      data: {
        ...input,
        compareAtPrice:
          input.compareAtPrice === undefined ? undefined : input.compareAtPrice ?? null,
      },
    })
    return mapCombo(updated)
  } catch {
    return undefined
  }
}

export async function deleteCombo(id: string): Promise<boolean> {
  try {
    await prisma.combo.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

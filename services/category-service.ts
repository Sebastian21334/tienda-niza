import { prisma } from '@/lib/prisma'
import type { Category } from '@/types'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function mapCategory(c: {
  id: string
  slug: string
  name: string
  description: string
  image: string
  order: number
}): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    order: c.order,
  }
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  })
  return categories.map(mapCategory)
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const category = await prisma.category.findUnique({ where: { slug } })
  return category ? mapCategory(category) : undefined
}

export async function getCategoryById(
  id: string,
): Promise<Category | undefined> {
  const category = await prisma.category.findUnique({ where: { id } })
  return category ? mapCategory(category) : undefined
}

export async function countProductsByCategory(
  categoryId: string,
): Promise<number> {
  return prisma.product.count({ where: { categoryId } })
}

export type CategoryInput = Omit<Category, 'id' | 'slug'>

export async function createCategory(
  input: CategoryInput,
): Promise<Category> {
  const slug = slugify(input.name)
  const created = await prisma.category.create({
    data: {
      id: `cat-${slug}-${Date.now()}`,
      slug,
      name: input.name,
      description: input.description,
      image: input.image,
      order: input.order,
    },
  })
  return mapCategory(created)
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
): Promise<Category | undefined> {
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: input,
    })
    return mapCategory(updated)
  } catch {
    return undefined
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await prisma.category.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

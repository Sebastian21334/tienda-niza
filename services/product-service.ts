import { prisma } from '@/lib/prisma'
import type {
  PaginatedResult,
  Product,
  ProductQuery,
  SortOption,
} from '@/types'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type PrismaProduct = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice: number | null
  stock: number
  material: string
  categoryId: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  available: boolean
  images: string[]
  rating: number
  reviews: number
  createdAt: Date
}

function mapProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    stock: p.stock,
    material: p.material,
    categoryId: p.categoryId,
    featured: p.featured,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
    available: p.available,
    images: p.images,
    rating: p.rating,
    reviews: p.reviews,
    createdAt: p.createdAt.toISOString().slice(0, 10),
  }
}

function sortProducts(items: Product[], sort: SortOption): Product[] {
  const copy = [...items]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'newest':
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'best-selling':
      return copy.sort((a, b) => b.reviews - a.reviews)
    default:
      return copy.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      )
  }
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<PaginatedResult<Product>> {
  const { search, category, sort = 'featured', page = 1, perPage = 8 } = query

  const where: Record<string, unknown> = { available: true }

  if (category && category !== 'all') {
    const cat = await prisma.category.findUnique({ where: { slug: category } })
    if (cat) where.categoryId = cat.id
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { material: { contains: search, mode: 'insensitive' } },
    ]
  }

  const rows = await prisma.product.findMany({ where })
  let items = sortProducts(rows.map(mapProduct), sort)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  const paged = items.slice(start, start + perPage)

  return { items: paged, total, page: safePage, perPage, totalPages }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({ where: { slug } })
  return p ? mapProduct(p) : undefined
}

export async function getProductById(
  id: string,
): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({ where: { id } })
  return p ? mapProduct(p) : undefined
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const rows = await prisma.product.findMany({ where: { id: { in: ids } } })
  const byId = new Map(rows.map((p) => [p.id, mapProduct(p)]))
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p))
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { available: true, featured: true },
    take: limit,
  })
  return rows.map(mapProduct)
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { available: true, newArrival: true },
    take: limit,
  })
  return rows.map(mapProduct)
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { available: true, bestSeller: true },
    orderBy: { reviews: 'desc' },
    take: limit,
  })
  return rows.map(mapProduct)
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      available: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: limit,
  })
  return rows.map(mapProduct)
}

/* ---------- Admin (CRUD) ---------- */

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapProduct)
}

export type ProductInput = Omit<
  Product,
  'id' | 'slug' | 'createdAt' | 'rating' | 'reviews'
> & { rating?: number; reviews?: number }

export async function createProduct(input: ProductInput): Promise<Product> {
  const created = await prisma.product.create({
    data: {
      id: `p-${slugify(input.name)}-${Date.now()}`,
      slug: `${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name,
      description: input.description,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      stock: input.stock,
      material: input.material,
      categoryId: input.categoryId,
      featured: input.featured,
      bestSeller: input.bestSeller,
      newArrival: input.newArrival,
      available: input.available,
      images: input.images,
      rating: input.rating ?? 5,
      reviews: input.reviews ?? 0,
    },
  })
  return mapProduct(created)
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product | undefined> {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...input,
        compareAtPrice:
          input.compareAtPrice === undefined ? undefined : input.compareAtPrice ?? null,
      },
    })
    return mapProduct(updated)
  } catch {
    return undefined
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

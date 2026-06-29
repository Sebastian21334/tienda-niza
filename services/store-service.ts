import { prisma } from '@/lib/prisma'
import { countProductsByCategory, getCategories } from '@/services/category-service'
import type { StoreConfig } from '@/types'

const STORE_ID = 'store'

export async function getStoreConfig(): Promise<StoreConfig> {
  const store = await prisma.storeConfig.findUnique({
    where: { id: STORE_ID },
  })

  if (!store) {
    throw new Error(
      'No se encontró la configuración de la tienda. Corré el script de seed.',
    )
  }

  const { id, ...rest } = store
  return rest
}

export async function updateStoreConfig(
  input: Partial<StoreConfig>,
): Promise<StoreConfig> {
  const updated = await prisma.storeConfig.update({
    where: { id: STORE_ID },
    data: input,
  })
  const { id, ...rest } = updated
  return rest
}

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  outOfStock: number
  featured: number
  totalCombos: number
  categoryBreakdown: { name: string; count: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalProducts, totalCategories, outOfStock, featured, totalCombos, categories] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.combo.count(),
      getCategories(),
    ])

  const categoryBreakdown = await Promise.all(
    categories.map(async (c: { name: any; id: string }) => ({
      name: c.name,
      count: await countProductsByCategory(c.id),
    })),
  )

  return {
    totalProducts,
    totalCategories,
    outOfStock,
    featured,
    totalCombos,
    categoryBreakdown,
  }
}

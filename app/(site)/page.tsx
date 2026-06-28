import { AboutStrip } from '@/components/home/about-strip'
import { CategoryGrid } from '@/components/home/category-grid'
import { Hero } from '@/components/home/hero'
import { ProductSection } from '@/components/home/product-section'
import { getCategories } from '@/services/category-service'
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
} from '@/services/product-service'
import { getStoreConfig } from '@/services/store-service'

export default async function HomePage() {
  const [store, categories, featured, newArrivals, bestSellers] =
    await Promise.all([
      getStoreConfig(),
      getCategories(),
      getFeaturedProducts(4),
      getNewArrivals(4),
      getBestSellers(4),
    ])

  return (
    <>
      <Hero store={store} />
      <CategoryGrid categories={categories} />
      <ProductSection
        eyebrow="Selección"
        title="Productos destacados"
        products={featured}
        categories={categories}
        viewAllHref="/tienda"
      />
      <ProductSection
        eyebrow="Recién llegados"
        title="Nuevos ingresos"
        products={newArrivals}
        categories={categories}
        viewAllHref="/tienda?sort=newest"
        muted
      />
      <AboutStrip store={store} />
      <ProductSection
        eyebrow="Favoritos"
        title="Más vendidos"
        products={bestSellers}
        categories={categories}
        viewAllHref="/tienda?sort=best-selling"
      />
    </>
  )
}

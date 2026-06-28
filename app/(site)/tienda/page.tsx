import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogToolbar } from '@/components/catalog/catalog-toolbar'
import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { ProductCard } from '@/components/products/product-card'
import { getCategories } from '@/services/category-service'
import { getProducts } from '@/services/product-service'
import { getStoreConfig } from '@/services/store-service'
import type { SortOption } from '@/types'

export const metadata: Metadata = {
  title: 'Tienda',
  description:
    'Explora nuestra colección de joyas: anillos, pulseras, collares, aros y combos diseñados para acompañarte cada día.',
}

const PER_PAGE = 8

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    page?: string
  }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const [{ items, total, totalPages, page: safePage }, categories, store] =
    await Promise.all([
      getProducts({
        search: params.search,
        category: params.category,
        sort: (params.sort as SortOption) || 'featured',
        page,
        perPage: PER_PAGE,
      }),
      getCategories(),
      getStoreConfig(),
    ])

  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const showingFrom = total === 0 ? 0 : (safePage - 1) * PER_PAGE + 1
  const showingTo = Math.min(safePage * PER_PAGE, total)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent">
          {store.name}
        </p>
        <h1 className="text-balance text-4xl text-foreground sm:text-5xl">
          Toda la colección
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Piezas pensadas para durar, en metales nobles y acabados cuidados.
          Encuentra la joya que cuenta tu historia.
        </p>
      </header>

      <Suspense fallback={null}>
        <CatalogToolbar
          categories={categories}
          total={total}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      </Suspense>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <h2 className="text-2xl text-foreground">Nada por aquí... aún</h2>
          <p className="max-w-md text-muted-foreground">
            No encontramos joyas que coincidan con tu búsqueda. Prueba con otra
            categoría o término.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categoryById.get(product.categoryId)}
            />
          ))}
        </div>
      )}

      <Suspense fallback={null}>
        <CatalogPagination page={safePage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import type { Category, Product } from '@/types'

interface ProductSectionProps {
  eyebrow: string
  title: string
  products: Product[]
  categories: Category[]
  viewAllHref?: string
  muted?: boolean
}

export function ProductSection({
  eyebrow,
  title,
  products,
  categories,
  viewAllHref,
  muted = false,
}: ProductSectionProps) {
  if (products.length === 0) return null

  const findCategory = (id: string) => categories.find((c) => c.id === id)

  return (
    <section className={muted ? 'bg-secondary/50' : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </span>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent sm:flex"
            >
              Ver todo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={findCategory(product.categoryId)}
            />
          ))}
        </div>

        {viewAllHref && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm text-accent"
            >
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

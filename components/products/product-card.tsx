import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/products/star-rating'
import { discountPercent, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/types'

interface ProductCardProps {
  product: Product
  category?: Category
}

export function ProductCard({ product, category }: ProductCardProps) {
  const discount = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.stock === 0

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col"
      aria-label={product.name}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount && (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-[11px] font-medium text-white">
              -{discount}%
            </span>
          )}
          {product.newArrival && !discount && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
              Nuevo
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {category && (
          <span className="text-[11px] uppercase tracking-wide text-accent">
            {category.name}
          </span>
        )}
        <h3
          className={cn(
            'font-heading text-base leading-snug text-foreground',
            'transition-colors group-hover:text-accent',
          )}
        >
          {product.name}
        </h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="mt-0.5 flex items-baseline gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-sm font-medium text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

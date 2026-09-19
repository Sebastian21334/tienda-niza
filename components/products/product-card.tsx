import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { discountPercent, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/types'
import { AddToCartButton } from './add-to-cart-button'

interface ProductCardProps {
  product: Product
  category?: Category
  priority?: boolean
}

export function ProductCard({ product, category, priority = false }: ProductCardProps) {
  const discount = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.stock === 0

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex h-full flex-col transition-transform duration-500 hover:-translate-y-1"
      aria-label={product.name}
    >
      <div className="image-shine relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/10 group-hover:ring-gold/20">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            'object-cover transition-transform duration-700 ease-out group-hover:scale-105',
            soldOut && 'opacity-60 grayscale-[0.3]',
          )}
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

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
            <span className="rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium text-background">
              Agotado
            </span>
          )}
        </div>

        {!soldOut && (
          <div className="absolute bottom-3 right-3 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <AddToCartButton product={product} variant="icon" />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-accent">
              {category.name}
            </span>
          )}
          {product.rating > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="size-3 fill-gold text-gold" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h3
          className={cn(
            'font-heading text-base leading-snug text-foreground',
            'transition-colors group-hover:text-accent',
          )}
        >
          {product.name}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{product.material}</p>
        <div className="mt-1 flex items-baseline gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span
            className={cn(
              'text-sm font-medium text-foreground',
              discount && 'text-destructive',
            )}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

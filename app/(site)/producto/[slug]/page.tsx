import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { ProductGallery } from '@/components/products/product-gallery'
import { WhatsappCta } from '@/components/products/whatsapp-cta'
import { StarRating } from '@/components/products/star-rating'
import { ProductCard } from '@/components/products/product-card'
import { getCategoryById } from '@/services/category-service'
import {
  getProductBySlug,
  getRelatedProducts,
} from '@/services/product-service'
import { getStoreConfig } from '@/services/store-service'
import { discountPercent, formatPrice, productInquiryMessage } from '@/lib/format'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [category, related, store] = await Promise.all([
    getCategoryById(product.categoryId),
    getRelatedProducts(product, 4),
    getStoreConfig(),
  ])

  const discount = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.stock === 0

  const perks = [
    { icon: Truck, label: 'Envíos a todo el país' },
    { icon: ShieldCheck, label: 'Garantía de 6 meses' },
    { icon: Sparkles, label: 'Empaque de regalo incluido' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        aria-label="Migas de pan"
      >
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/tienda" className="hover:text-foreground">
          Tienda
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          {category && (
            <Link
              href={`/tienda?category=${category.slug}`}
              className="text-sm uppercase tracking-[0.2em] text-accent"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-balance text-4xl text-foreground sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-white">
                -{discount}%
              </span>
            )}
          </div>

          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Material</dt>
              <dd className="mt-1 text-foreground">{product.material}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Disponibilidad</dt>
              <dd className="mt-1 text-foreground">
                {soldOut ? 'Agotado' : `${product.stock} en stock`}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            {soldOut ? (
              <p className="rounded-full border border-border px-8 py-4 text-center text-sm text-muted-foreground">
                Producto agotado por el momento
              </p>
            ) : (
              <WhatsappCta
                phone={store.whatsapp}
                message={productInquiryMessage(product.name)}
              />
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground sm:text-left">
              Te responderemos para coordinar pago y envío.
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {perks.map((perk) => (
              <li
                key={perk.label}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <perk.icon className="size-4 text-accent" />
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl text-foreground sm:text-3xl">
            También te puede gustar
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                category={category}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

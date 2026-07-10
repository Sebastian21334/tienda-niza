import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { ProductGallery } from '@/components/products/product-gallery'
import { WhatsappCta } from '@/components/products/whatsapp-cta'
import { ProductCard } from '@/components/products/product-card'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
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
    { icon: ShieldCheck, label: 'Coordinamos pago y entrega por WhatsApp' },
    { icon: Sparkles, label: 'Packaging cuidado, listo para regalar' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        aria-label="Migas de pan"
      >
        <Link href="/" className="transition-colors hover:text-accent">
          Inicio
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/50" />
        <Link href="/tienda" className="transition-colors hover:text-accent">
          Tienda
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/50" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="relative flex flex-col">
          <CornerFlourish
            corner="top-right"
            size={140}
            opacity={0.25}
            className="hidden lg:block"
          />

          {category && (
            <Link
              href={`/tienda?category=${category.slug}`}
              className="text-sm uppercase tracking-[0.2em] text-accent transition-colors hover:text-accent/80"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-balance font-heading text-4xl text-foreground sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={
                discount
                  ? 'text-3xl font-medium text-destructive'
                  : 'text-3xl font-medium text-foreground'
              }
            >
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

          <dl className="mt-6 border-y border-border py-6 text-sm">
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
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <perk.icon className="size-4 text-accent" />
                </span>
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
            Seguí mirando
          </span>
          <h2 className="mt-2 font-heading text-2xl text-foreground sm:text-3xl">
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

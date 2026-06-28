import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/types'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          Explorá
        </span>
        <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
          Nuestras categorías
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/tienda?categoria=${category.slug}`}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[3/4] bg-muted">
              <Image
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-heading text-xl text-background">
                {category.name}
              </h3>
              <span className="mt-0.5 inline-block text-xs text-background/80">
                Ver productos
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

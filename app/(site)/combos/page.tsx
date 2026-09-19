import type { Metadata } from 'next'
import Image from 'next/image'
import { getCombos } from '@/services/combo-service'
import { getProductsByIds } from '@/services/product-service'
import { getStoreConfig } from '@/services/store-service'
import { WhatsappCta } from '@/components/products/whatsapp-cta'
import { CornerFlourish } from '@/components/brand/CornerFlourish'
import {
  comboInquiryMessage,
  discountPercent,
  formatPrice,
} from '@/lib/format'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = {
  title: 'Combos',
  description:
    'Sets de joyas seleccionados para combinar a la perfección, a un precio especial.',
}

export default async function CombosPage() {
  const [combos, store] = await Promise.all([getCombos(), getStoreConfig()])

  const combosWithItems = await Promise.all(
    combos.map(async (combo) => ({
      combo,
      items: await getProductsByIds(combo.productIds),
    })),
  )

  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <CornerFlourish corner="top-right" size={170} opacity={0.22} className="hidden lg:block" />

      <Reveal as="section" className="relative mb-12 max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          Sets seleccionados
        </p>
        <h1 className="text-balance font-heading text-4xl text-foreground sm:text-5xl">
          Combos para regalar (o regalarte)
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Combinaciones pensadas por nuestro equipo para que luzcas un look
          completo, con un precio más conveniente que comprar por separado.
        </p>
      </Reveal>

      {combosWithItems.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">
          Pronto tendremos nuevos combos disponibles.
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {combosWithItems.map(({ combo, items }, index) => {
            const discount = discountPercent(combo.price, combo.compareAtPrice)
            return (
              <Reveal
                key={combo.id}
                as="article"
                delay={index * 100}
                className="group grid gap-8 overflow-hidden rounded-3xl bg-card shadow-[0_24px_70px_rgb(52_43_32/0.06)] ring-1 ring-black/5 lg:grid-cols-2"
              >
                <div className="image-shine relative aspect-[4/3] overflow-hidden bg-muted lg:aspect-auto">
                  <Image
                    src={combo.images[0] || '/placeholder.svg'}
                    alt={combo.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.025]"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                  {discount && (
                    <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white">
                      Ahorra {discount}%
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <h2 className="text-balance font-heading text-3xl text-foreground">
                    {combo.name}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {combo.description}
                  </p>

                  {items.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Incluye
                      </p>
                      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-foreground">
                        {items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" />
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className={
                        discount
                          ? 'text-2xl font-medium text-destructive'
                          : 'text-2xl font-medium text-foreground'
                      }
                    >
                      {formatPrice(combo.price)}
                    </span>
                    {combo.compareAtPrice && (
                      <span className="text-base text-muted-foreground line-through">
                        {formatPrice(combo.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-8">
                    <WhatsappCta
                      phone={store.whatsapp}
                      message={comboInquiryMessage(combo.name)}
                      label="Pedir este combo"
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : ['/placeholder.svg']
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="image-shine group relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-[0_25px_70px_rgb(52_43_32/0.08)] ring-1 ring-black/5">
        <Image
          key={active}
          src={gallery[active] || '/placeholder.svg'}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="animate-in fade-in object-cover duration-500 transition-transform group-hover:scale-[1.015]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </div>

      {gallery.length > 1 && (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                'relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 transition-all duration-200 active:scale-95',
                active === i
                  ? 'ring-2 ring-accent'
                  : 'ring-border hover:ring-accent/40',
              )}
            >
              <Image
                src={img || '/placeholder.svg'}
                alt=""
                fill
                sizes="80px"
                className={cn(
                  'object-cover transition-opacity duration-200',
                  active === i ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

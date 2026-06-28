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
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={gallery[active] || '/placeholder.svg'}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                'relative size-20 overflow-hidden rounded-lg border bg-muted transition-colors',
                active === i ? 'border-accent' : 'border-border',
              )}
            >
              <Image
                src={img || '/placeholder.svg'}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

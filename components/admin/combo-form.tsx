'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Combo, Product } from '@/types'
import { ImageUploader, type UploadedImage } from './ImageUploader'

interface ComboFormProps {
  combo?: Combo
  products: Product[]
  action: (prev: unknown, formData: FormData) => Promise<{ error: string } | undefined>
}

export function ComboForm({ combo, products, action }: ComboFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [images, setImages] = useState<UploadedImage[]>(
    (combo?.images ?? []).map((url) => ({ url, name: url.split('/').pop() ?? url })),
  )

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre del combo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={combo?.name}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={combo?.description}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-foreground">
            Precio
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={combo?.price}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="compareAtPrice" className="text-sm font-medium text-foreground">
            Precio anterior (opcional)
          </label>
          <input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={combo?.compareAtPrice}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUploader
            images={images}
            onChange={setImages}
            name="images"
            folder="combos"
            separator=", "
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Productos incluidos
        </p>
        <p className="text-xs text-muted-foreground">
          Seleccioná los productos que forman parte de este combo.
        </p>
        <div className="mt-1 grid max-h-72 gap-2 overflow-y-auto rounded-lg border border-border bg-card p-3 sm:grid-cols-2">
          {products.map((product) => (
            <label
              key={product.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-secondary"
            >
              <input
                type="checkbox"
                name="productIds"
                value={product.id}
                defaultChecked={combo?.productIds.includes(product.id)}
                className="size-4 rounded border-border"
              />
              {product.name}
              <span className="ml-auto text-xs text-muted-foreground">
                ${product.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="available"
          defaultChecked={combo?.available ?? true}
          className="size-4 rounded border-border"
        />
        Disponible en la tienda
      </label>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-2 self-start">
        {pending ? 'Guardando...' : combo ? 'Guardar cambios' : 'Crear combo'}
      </Button>
    </form>
  )
}

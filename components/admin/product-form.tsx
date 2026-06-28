'use client'

import { useActionState } from 'react'
import type { Category, Product } from '@/types'

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<{ error: string } | undefined>
  categories: Category[]
  product?: Product
}

export function ProductForm({ action, categories, product }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Nombre <span className="text-destructive">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Categoría <span className="text-destructive">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          >
            <option value="">Seleccioná una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Precio <span className="text-destructive">*</span>
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product?.price}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Precio anterior
          </label>
          <input
            name="compareAtPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.compareAtPrice}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Material</label>
        <input
          name="material"
          defaultValue={product?.material}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Imágenes
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (una por línea, ej: /images/products/anillo.jpg)
          </span>
        </label>
        <textarea
          name="images"
          rows={3}
          defaultValue={product?.images.join('\n')}
          placeholder="/images/products/nombre.jpg"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        {(
          [
            { name: 'available', label: 'Disponible' },
            { name: 'featured', label: 'Destacado' },
            { name: 'bestSeller', label: 'Más vendido' },
            { name: 'newArrival', label: 'Nuevo ingreso' },
          ] as const
        ).map((field) => (
          <label
            key={field.name}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              type="checkbox"
              name={field.name}
              defaultChecked={product?.[field.name] ?? field.name === 'available'}
              className="h-4 w-4 rounded border-border accent-foreground"
            />
            {field.label}
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-60"
        >
          {pending ? 'Guardando...' : 'Guardar producto'}
        </button>
        <a
          href="/admin/productos"
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

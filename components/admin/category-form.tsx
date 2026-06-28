'use client'

import { useActionState } from 'react'
import type { Category } from '@/types'

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<{ error: string } | undefined>
  category?: Category
}

export function CategoryForm({ action, category }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Nombre <span className="text-destructive">*</span>
        </label>
        <input
          name="name"
          required
          defaultValue={category?.name}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Descripción</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={category?.description}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Imagen
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (ruta, ej: /images/categories/anillos.jpg)
          </span>
        </label>
        <input
          name="image"
          defaultValue={category?.image}
          placeholder="/images/categories/nombre.jpg"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Orden</label>
        <input
          name="order"
          type="number"
          min="0"
          defaultValue={category?.order ?? 0}
          className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
        />
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
          {pending ? 'Guardando...' : 'Guardar categoría'}
        </button>
        <a
          href="/admin/categorias"
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

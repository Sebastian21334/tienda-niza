'use client'

import { useTransition } from 'react'
import { deleteCategoryAction } from '@/app/admin/(panel)/categorias/category-actions'

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`¿Seguro que querés eliminar "${name}"?`)) return
    startTransition(() => deleteCategoryAction(id))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}

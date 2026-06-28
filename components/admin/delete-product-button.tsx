'use client'

import { useTransition } from 'react'
import { deleteProductAction } from '@/app/admin/(panel)/productos/product-actions'

interface Props {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: Props) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`¿Seguro que querés eliminar "${name}"?`)) return
    startTransition(() => deleteProductAction(id))
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

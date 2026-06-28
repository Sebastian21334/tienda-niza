'use client'

import { deleteComboAction } from '@/app/admin/(panel)/combos/combo-actions'

export function DeleteComboButton({ id }: { id: string }) {
  return (
    <form
      action={deleteComboAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm('¿Seguro que querés eliminar este combo?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-destructive transition-colors hover:underline"
      >
        Eliminar
      </button>
    </form>
  )
}

'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '@/app/admin/(panel)/actions'

export default function RecuperarPage() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, null)

  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="mb-2 font-heading text-3xl text-foreground">
            Revisá tu email
          </h1>
          <p className="text-sm text-muted-foreground">
            Si el email ingresado tiene una cuenta, recibirás un link para
            restablecer tu contraseña. El link expira en 30 minutos.
          </p>
          <a
            href="/admin/login"
            className="mt-8 block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Volver al inicio de sesión
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 font-heading text-3xl text-foreground">
          Recuperar contraseña
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Ingresá tu email y te enviaremos un link para restablecer tu
          contraseña.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-60"
          >
            {pending ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <a
          href="/admin/login"
          className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Volver al inicio de sesión
        </a>
      </div>
    </div>
  )
}

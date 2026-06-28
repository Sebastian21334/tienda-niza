'use client'

import { useActionState } from 'react'
import { verifyTwoFactorAction } from '@/app/admin/(panel)/actions'

export default function VerificarPage() {
  const [state, action, pending] = useActionState(verifyTwoFactorAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 font-heading text-3xl text-foreground">
          Verificación
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Te enviamos un código de 4 dígitos a tu email. Ingresalo para
          continuar.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="text-sm font-medium text-foreground">
              Código
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              maxLength={4}
              autoComplete="one-time-code"
              autoFocus
              required
              placeholder="1234"
              className="rounded-lg border border-border bg-background px-3 py-2 text-center text-2xl font-bold tracking-[0.5em] text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-60"
          >
            {pending ? 'Verificando...' : 'Confirmar'}
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

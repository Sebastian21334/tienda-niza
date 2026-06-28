'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/admin/(panel)/actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 font-heading text-3xl text-foreground">
          Panel admin
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Ingresá tus credenciales para continuar.
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground"
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
            {pending ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <a
          href="/admin/recuperar"
          className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  )
}

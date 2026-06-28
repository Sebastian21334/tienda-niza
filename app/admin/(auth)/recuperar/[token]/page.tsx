'use client'

import { useActionState } from 'react'
import { resetPasswordAction } from '@/app/admin/(panel)/actions'

interface Props {
  params: Promise<{ token: string }>
}

export default function ResetPasswordPage({ params }: Props) {
  const [state, action, pending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const { token } = await params
      formData.append('token', token)
      return resetPasswordAction(formData)
    },
    null,
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 font-heading text-3xl text-foreground">
          Nueva contraseña
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Elegí una contraseña segura de al menos 8 caracteres.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-foreground">
              Confirmá la contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
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
            {pending ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

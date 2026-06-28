'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword } from '@/lib/auth/password'
import { signJWT } from '@/lib/auth/jwt'
import { setSessionCookie, clearSessionCookie } from '@/lib/auth/session'
import {
  sendTwoFactorEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
} from '@/lib/email/resend'
import crypto from 'crypto'

function generate4DigitCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Completá todos los campos.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Credenciales incorrectas.' }
  }

  const valid = await comparePassword(password, user.passwordHash)
  if (!valid) {
    return { error: 'Credenciales incorrectas.' }
  }

  const code = generate4DigitCode()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorCode: code, twoFactorExpiresAt: expires },
  })

  await sendTwoFactorEmail(code)

  const cookieStore = await cookies()
  cookieStore.set('2fa_pending', user.id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })

  redirect('/admin/verificar')
}

export async function verifyTwoFactorAction(_prev: unknown, formData: FormData) {
  const code = formData.get('code') as string

  const cookieStore = await cookies()
  const userId = cookieStore.get('2fa_pending')?.value

  if (!userId) {
    return { error: 'Sesión expirada. Volvé a iniciar sesión.' }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.twoFactorCode || !user.twoFactorExpiresAt) {
    return { error: 'Código inválido.' }
  }

  if (new Date() > user.twoFactorExpiresAt) {
    return { error: 'El código expiró. Volvé a iniciar sesión.' }
  }

  if (user.twoFactorCode !== code) {
    return { error: 'Código incorrecto.' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorCode: null, twoFactorExpiresAt: null },
  })

  const token = await signJWT({ userId: user.id, email: user.email })
  const sessionCookie = setSessionCookie(token)

  cookieStore.set(sessionCookie)
  cookieStore.delete('2fa_pending')

  await sendLoginNotificationEmail()

  redirect('/admin')
}

export async function requestPasswordResetAction(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { success: true }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expires = new Date(Date.now() + 30 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetTokenHash: tokenHash, resetTokenExpiresAt: expires },
  })

  const resetLink = `${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/admin/recuperar/${token}`
  await sendPasswordResetEmail(resetLink)

  return { success: true }
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  if (password !== confirm) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const user = await prisma.user.findFirst({
    where: { resetTokenHash: tokenHash },
  })

  if (!user || !user.resetTokenExpiresAt || new Date() > user.resetTokenExpiresAt) {
    return { error: 'El link expiró o es inválido. Solicitá uno nuevo.' }
  }

  const passwordHash = await hashPassword(password)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  })

  redirect('/admin/login')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.set(clearSessionCookie())
  redirect('/admin/login')
}
import { NextResponse, type NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/verificar',
  '/admin/recuperar',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const isPublic = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('admin_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const payload = await verifyJWT(token)
  if (!payload) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_session')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

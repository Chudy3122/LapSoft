import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'lapsoft-session'

interface SessionData {
  userId?: string
  role?: 'USER' | 'ADMIN'
}

async function readSession(req: NextRequest): Promise<SessionData | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const key = new TextEncoder().encode(process.env.SESSION_SECRET)
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as SessionData
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await readSession(req)

  // Panel klienta — wymaga zalogowania
  if (pathname.startsWith('/panel-klienta') && !session?.userId) {
    return NextResponse.redirect(new URL('/logowanie', req.url))
  }

  // Panel admina — wymaga roli ADMIN
  if (pathname.startsWith('/admin/dashboard') && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Zalogowanego użytkownika przekieruj ze stron logowania/rejestracji do panelu
  if ((pathname === '/logowanie' || pathname === '/rejestracja') && session?.userId) {
    const dest = session.role === 'ADMIN' ? '/admin/dashboard' : '/panel-klienta'
    return NextResponse.redirect(new URL(dest, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel-klienta/:path*', '/admin/dashboard/:path*', '/logowanie', '/rejestracja'],
}

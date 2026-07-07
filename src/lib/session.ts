import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'lapsoft-session'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 dni

export type UserRole = 'USER' | 'ADMIN'

export interface SessionPayload {
  userId: string
  role: UserRole
  name: string
  [key: string]: unknown
}

function getKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('Brak zmiennej SESSION_SECRET')
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey())
}

export async function decrypt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] })
    return payload as SessionPayload
  } catch {
    return null
  }
}

// Tworzy sesję i zapisuje ją w cookie httpOnly
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encrypt(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + MAX_AGE_MS),
    path: '/',
  })
}

// Odczytuje i weryfikuje sesję z cookie
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return decrypt(token)
}

// Usuwa sesję (wylogowanie)
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

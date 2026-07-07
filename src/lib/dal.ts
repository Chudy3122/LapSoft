import { cache } from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession, type SessionPayload } from '@/lib/session'

// Zwraca sesję albo przekierowuje na logowanie. Memoizowane w obrębie renderu.
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/logowanie')
  }
  return session
})

// Wymaga roli administratora
export const verifyAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession()
  if (session?.role !== 'ADMIN') {
    redirect('/admin')
  }
  return session
})

// Pobiera dane zalogowanego użytkownika z bazy (tylko bezpieczne pola).
// Dla konta administratora zwraca dane syntetyczne (admin nie ma wpisu w tabeli User).
export const getCurrentUser = cache(async () => {
  const session = await verifySession()

  if (session.role === 'ADMIN') {
    return { id: 'admin', name: session.name || 'Administrator', email: '', role: 'ADMIN' as const }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  if (!user) {
    // Sesja wskazuje na nieistniejące konto — wyloguj
    redirect('/logowanie')
  }

  return user
})

import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'Brak konfiguracji ADMIN_PASSWORD' }, { status: 500 })
  }

  if (password !== correct) {
    return NextResponse.json({ error: 'Nieprawidłowe hasło' }, { status: 401 })
  }

  // Utwórz sesję administratora (rola ADMIN, brak wpisu w tabeli User)
  await createSession({ userId: 'admin', role: 'ADMIN', name: 'Administrator' })

  return NextResponse.json({ success: true })
}

// Wylogowanie administratora — usuwa cookie sesji
export async function DELETE() {
  await deleteSession()
  return NextResponse.json({ success: true })
}

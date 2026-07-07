import { NextResponse } from 'next/server'
import { getInquiries } from '@/lib/storage'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (session?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  try {
    const inquiries = await getInquiries()
    return NextResponse.json(inquiries)
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}

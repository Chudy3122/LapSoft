import { NextRequest, NextResponse } from 'next/server'
import { updateInquiryStatus } from '@/lib/storage'
import type { Inquiry } from '@/lib/storage'

const validStatuses: Inquiry['status'][] = ['nowe', 'w toku', 'zakończone']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await req.json()

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Nieprawidłowy status' }, { status: 400 })
    }

    const ok = updateInquiryStatus(id, status)
    if (!ok) return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}

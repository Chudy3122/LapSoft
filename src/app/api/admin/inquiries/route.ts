import { NextResponse } from 'next/server'
import { getInquiries } from '@/lib/storage'

export async function GET() {
  try {
    const inquiries = getInquiries()
    return NextResponse.json(inquiries)
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}

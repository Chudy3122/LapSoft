import { NextRequest, NextResponse } from 'next/server'
import { addInquiry } from '@/lib/storage'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data.name || !data.phone || !data.packageId || !data.period) {
      return NextResponse.json({ error: 'Brakujące pola' }, { status: 400 })
    }

    // Jeśli klient jest zalogowany, powiąż zapytanie z jego kontem
    const session = await getSession()

    const inquiry = await addInquiry({
      name: String(data.name).slice(0, 100),
      phone: String(data.phone).slice(0, 20),
      email: String(data.email || '').slice(0, 100),
      age: String(data.age || '').slice(0, 5),
      packageId: String(data.packageId).slice(0, 50),
      period: String(data.period).slice(0, 5),
      equipmentIds: Array.isArray(data.equipmentIds) ? data.equipmentIds.map(String).slice(0, 4) : [],
      addons: Array.isArray(data.addons) ? data.addons.map(String) : [],
      buyout: Boolean(data.buyout),
      message: String(data.message || '').slice(0, 1000),
      monthlyTotal: Number(data.monthlyTotal) || 0,
      userId: session?.role === 'USER' ? session.userId : null,
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}

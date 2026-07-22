import { NextResponse } from 'next/server'
import { getEquipmentCatalog } from '@/lib/equipment-db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (session?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  try {
    const equipment = await getEquipmentCatalog({ includeInactive: true })
    return NextResponse.json(equipment)
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}

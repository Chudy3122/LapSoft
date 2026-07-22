import { NextRequest, NextResponse } from 'next/server'
import { updateEquipmentCatalogItem } from '@/lib/equipment-db'
import { getSession } from '@/lib/session'

type EquipmentPatchPayload = {
  units?: unknown
  active?: unknown
  monthlyPrice?: unknown
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (session?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  try {
    const { id } = await params
    const payload = await req.json() as EquipmentPatchPayload
    const data: { units?: number; active?: boolean; monthlyPrice?: number | null } = {}

    if ('units' in payload) {
      const units = Number(payload.units)
      if (!Number.isInteger(units) || units < 0) {
        return NextResponse.json({ error: 'Nieprawidłowa liczba sztuk' }, { status: 400 })
      }
      data.units = units
    }

    if ('active' in payload) {
      if (typeof payload.active !== 'boolean') {
        return NextResponse.json({ error: 'Nieprawidłowy status widoczności' }, { status: 400 })
      }
      data.active = payload.active
    }

    if ('monthlyPrice' in payload) {
      if (payload.monthlyPrice === null || payload.monthlyPrice === '') {
        data.monthlyPrice = null
      } else {
        const monthlyPrice = Number(payload.monthlyPrice)
        if (!Number.isInteger(monthlyPrice) || monthlyPrice < 0) {
          return NextResponse.json({ error: 'Nieprawidłowa cena miesięczna' }, { status: 400 })
        }
        data.monthlyPrice = monthlyPrice
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Brak danych do aktualizacji' }, { status: 400 })
    }

    const equipment = await updateEquipmentCatalogItem(id, data)
    return NextResponse.json(equipment)
  } catch {
    return NextResponse.json({ error: 'Nie udało się zaktualizować sprzętu' }, { status: 500 })
  }
}

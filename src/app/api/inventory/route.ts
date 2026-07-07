import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'

// Zawsze świeże — pobiera aktualny stan z arkusza przy każdym żądaniu (bez cache po naszej stronie).
export const dynamic = 'force-dynamic'

export async function GET() {
  const inventory = await getInventory()
  return NextResponse.json(inventory, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

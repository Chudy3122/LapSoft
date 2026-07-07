import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'

// Cache na 5 minut — dane z arkusza nie muszą być odświeżane przy każdym wejściu.
export const revalidate = 300

export async function GET() {
  const inventory = await getInventory()
  return NextResponse.json(inventory)
}

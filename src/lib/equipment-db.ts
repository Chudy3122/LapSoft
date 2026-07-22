import { equipment as staticEquipment, type Equipment } from '@/data/equipment'
import { getEquipment as getStaticEquipmentWithInventory } from '@/lib/inventory'
import { prisma } from '@/lib/prisma'

type DbEquipment = {
  id: string
  category: string
  brand: string
  model: string
  image: string
  cardImage: string
  specs: unknown
  cardSpecs: unknown
  monthlyPrice: number | null
  units: number
  stockSource: string
  stockSyncedAt: Date | null
  active: boolean
  description: string
}

const categories = ['laptop', 'pc', 'monitor', 'biurko', 'fotel'] as const

function isEquipmentCategory(value: string): value is Equipment['category'] {
  return categories.includes(value as Equipment['category'])
}

function parseSpecs(value: unknown): Equipment['specs'] {
  if (!Array.isArray(value)) return []

  return value
    .map(item => {
      if (
        item &&
        typeof item === 'object' &&
        'label' in item &&
        'value' in item &&
        typeof item.label === 'string' &&
        typeof item.value === 'string'
      ) {
        return { label: item.label, value: item.value }
      }

      return null
    })
    .filter(Boolean) as Equipment['specs']
}

function parseOptionalSpecs(value: unknown): Equipment['cardSpecs'] {
  const specs = parseSpecs(value)
  return specs.length > 0 ? specs : undefined
}

function mapDbEquipment(row: DbEquipment): Equipment {
  const fallback = staticEquipment.find(item => item.id === row.id)

  return {
    id: row.id,
    category: isEquipmentCategory(row.category) ? row.category : fallback?.category ?? 'laptop',
    brand: row.brand,
    model: row.model,
    image: row.image,
    cardImage: row.cardImage,
    specs: parseSpecs(row.specs),
    cardSpecs: parseOptionalSpecs(row.cardSpecs),
    monthlyPrice: row.monthlyPrice ?? undefined,
    units: row.units,
    stockSource: row.stockSource === 'sheet' || row.stockSource === 'manual' ? row.stockSource : 'seed',
    stockSyncedAt: row.stockSyncedAt?.toISOString(),
    active: row.active,
    description: row.description,
  }
}

export async function getEquipmentCatalog({ includeInactive = false } = {}): Promise<Equipment[]> {
  try {
    const rows = await prisma.equipment.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: [
        { category: 'asc' },
        { brand: 'asc' },
        { model: 'asc' },
      ],
    })

    if (rows.length === 0) {
      return getStaticEquipmentWithInventory()
    }

    return rows.map(row => mapDbEquipment(row as DbEquipment))
  } catch {
    return getStaticEquipmentWithInventory()
  }
}

export async function getEquipmentCatalogItem(id: string): Promise<Equipment | null> {
  const items = await getEquipmentCatalog()
  return items.find(item => item.id === id) ?? null
}

export async function updateEquipmentCatalogItem(
  id: string,
  data: { units?: number; active?: boolean; monthlyPrice?: number | null }
): Promise<Equipment | null> {
  const updateData = {
    ...data,
    ...('units' in data ? { stockSource: 'manual' as const, stockSyncedAt: new Date() } : {}),
  }
  const row = await prisma.equipment.update({
    where: { id },
    data: updateData,
  })

  return mapDbEquipment(row as DbEquipment)
}

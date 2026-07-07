import { prisma } from '@/lib/prisma'
import type { InquiryModel as DbInquiry } from '@/generated/prisma/models'

// Publiczny kształt zapytania używany w UI (createdAt jako ISO string).
export interface Inquiry {
  id: string
  createdAt: string
  status: 'nowe' | 'w toku' | 'zakończone'
  name: string
  phone: string
  email: string
  age?: string
  packageId: string
  period: string
  equipmentIds?: string[]
  addons: string[]
  buyout: boolean
  message: string
  monthlyTotal: number
  userId?: string | null
}

function toInquiry(row: DbInquiry): Inquiry {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    status: row.status as Inquiry['status'],
    name: row.name,
    phone: row.phone,
    email: row.email,
    age: row.age ?? undefined,
    packageId: row.packageId,
    period: row.period,
    equipmentIds: row.equipmentIds,
    addons: row.addons,
    buyout: row.buyout,
    message: row.message,
    monthlyTotal: row.monthlyTotal,
    userId: row.userId,
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toInquiry)
}

export async function getInquiriesByUser(userId: string): Promise<Inquiry[]> {
  const rows = await prisma.inquiry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(toInquiry)
}

export async function addInquiry(
  data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
): Promise<Inquiry> {
  const row = await prisma.inquiry.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      age: data.age || null,
      packageId: data.packageId,
      period: data.period,
      equipmentIds: data.equipmentIds ?? [],
      addons: data.addons ?? [],
      buyout: data.buyout,
      message: data.message,
      monthlyTotal: data.monthlyTotal,
      userId: data.userId ?? null,
    },
  })
  return toInquiry(row)
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Promise<boolean> {
  try {
    await prisma.inquiry.update({ where: { id }, data: { status } })
    return true
  } catch {
    return false
  }
}

import fs from 'fs'
import path from 'path'

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
  addons: string[]
  buyout: boolean
  message: string
  monthlyTotal: number
}

const filePath = path.join(process.cwd(), 'data-storage', 'inquiries.json')

function ensureFile() {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8')
}

export function getInquiries(): Inquiry[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
  const inquiries = getInquiries()
  const inquiry: Inquiry = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'nowe',
  }
  inquiries.unshift(inquiry)
  fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2), 'utf-8')
  return inquiry
}

export function updateInquiryStatus(id: string, status: Inquiry['status']): boolean {
  const inquiries = getInquiries()
  const idx = inquiries.findIndex(i => i.id === id)
  if (idx === -1) return false
  inquiries[idx].status = status
  fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2), 'utf-8')
  return true
}

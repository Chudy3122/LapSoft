import { equipment as staticEquipment, type Equipment } from '@/data/equipment'

// Mapa dostępności pobrana z Google Sheets: klucz = id sprzętu.
export type InventoryMap = Record<string, { units: number; available: boolean }>

const REVALIDATE_SECONDS = 300 // odświeżaj dane z arkusza co 5 minut

// --- Normalizacja tekstu do dopasowań (bez ogonków, małe litery, tylko alfanumeryczne) ---
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '') // usuwa też znaki łączące (ogonki) po NFD
}

// --- Prosty, odporny parser CSV (obsługuje pola w cudzysłowach z przecinkami) ---
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let inQuotes = false
  const t = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (inQuotes) {
      if (c === '"') {
        if (t[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else field += c
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      cur.push(field); field = ''
    } else if (c === '\n') {
      cur.push(field); rows.push(cur); cur = []; field = ''
    } else field += c
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur) }
  return rows.filter(r => r.some(f => f.trim() !== ''))
}

// Rozpoznaje, w której kolumnie jest ilość / nazwa / id / dostępność — po słowach kluczowych w nagłówku.
function findColumns(header: string[]) {
  const h = header.map(normalize)
  const find = (keys: string[]) => h.findIndex(col => keys.some(k => col === k || col.includes(k)))
  return {
    id: find(['id']),
    model: find(['model', 'nazwa', 'produkt', 'sprzet', 'urzadzenie']),
    units: find(['ilosc', 'units', 'sztuk', 'stan', 'liczba', 'dostepne', 'magazyn', 'qty']),
    available: find(['dostepny', 'aktywny', 'available', 'widoczny', 'pokazuj', 'status']),
  }
}

// Dopasowuje wiersz arkusza do sprzętu: najpierw po id, potem po nazwie modelu (elastycznie).
function resolveEquipmentId(row: string[], cols: ReturnType<typeof findColumns>): string | undefined {
  if (cols.id >= 0) {
    const raw = (row[cols.id] ?? '').trim()
    if (raw && staticEquipment.some(e => e.id === raw)) return raw
  }
  if (cols.model >= 0) {
    const key = normalize(row[cols.model] ?? '')
    if (!key) return undefined
    // dokładne dopasowanie marka+model lub sam model
    const exact = staticEquipment.find(
      e => normalize(e.brand + e.model) === key || normalize(e.model) === key
    )
    if (exact) return exact.id
    // dopasowanie częściowe (nazwa w arkuszu zawiera model lub odwrotnie)
    const partial = staticEquipment.find(
      e => key.includes(normalize(e.model)) || normalize(e.model).includes(key)
    )
    if (partial) return partial.id
  }
  return undefined
}

function parseUnits(raw: string | undefined): number {
  const n = parseInt(String(raw ?? '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}

function parseAvailable(raw: string | undefined, hasColumn: boolean): boolean {
  if (!hasColumn) return true
  const v = normalize(raw ?? '')
  if (!v) return true
  return !['nie', 'no', 'false', '0', 'ukryty', 'niedostepny', 'wycofany', 'n'].includes(v)
}

// Pobiera i parsuje opublikowany arkusz (CSV). Zwraca pustą mapę, gdy brak URL lub błąd —
// wtedy strona używa wartości zapasowych z equipment.ts (nigdy się nie wywala).
export async function getInventory(): Promise<InventoryMap> {
  const url = process.env.GOOGLE_SHEET_CSV_URL
  if (!url) return {}
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
    if (!res.ok) return {}
    const rows = parseCsv(await res.text())
    if (rows.length < 2) return {}
    const cols = findColumns(rows[0])
    if (cols.units < 0) return {} // bez kolumny z ilością nie ma czego synchronizować
    const out: InventoryMap = {}
    for (const row of rows.slice(1)) {
      const id = resolveEquipmentId(row, cols)
      if (!id) continue
      out[id] = {
        units: parseUnits(row[cols.units]),
        available: parseAvailable(row[cols.available], cols.available >= 0),
      }
    }
    return out
  } catch {
    return {}
  }
}

// Pure — nakłada dane z arkusza na statyczny katalog. Bezpieczne do użycia po stronie klienta.
export function applyInventory(list: Equipment[], inv: InventoryMap | null): Equipment[] {
  if (!inv || Object.keys(inv).length === 0) return list
  return list
    .filter(e => (inv[e.id] ? inv[e.id].available : true))
    .map(e => (inv[e.id] ? { ...e, units: inv[e.id].units } : e))
}

// Server-side: katalog z naniesionymi danymi z arkusza.
export async function getEquipment(): Promise<Equipment[]> {
  return applyInventory(staticEquipment, await getInventory())
}

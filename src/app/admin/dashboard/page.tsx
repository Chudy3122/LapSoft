'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { equipment, type Equipment } from '@/data/equipment'
import { packages, periods } from '@/data/packages'
import { softwareAddons } from '@/data/software'
import { logout } from '@/app/actions/auth'
import type { Inquiry } from '@/lib/storage'

type Status = Inquiry['status']
type Section = 'overview' | 'inquiries' | 'equipment' | 'packages' | 'addons' | 'customers'

const statusStyles: Record<Status, string> = {
  nowe: 'border-blue-300 bg-blue-50 text-blue-700',
  'w toku': 'border-amber-300 bg-amber-50 text-amber-700',
  zakończone: 'border-[#7DB122]/40 bg-[#eef8dd] text-[#5f8818]',
}

const statusLabels: Record<Status, string> = {
  nowe: 'Nowe',
  'w toku': 'W toku',
  zakończone: 'Zakończone',
}

const filters: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'nowe', label: 'Nowe' },
  { key: 'w toku', label: 'W toku' },
  { key: 'zakończone', label: 'Zakończone' },
]

const sections: { key: Section; label: string; description: string }[] = [
  { key: 'overview', label: 'Pulpit', description: 'Najważniejsze liczby i szybki przegląd' },
  { key: 'inquiries', label: 'Zapytania', description: 'Obsługa zapytań z formularza' },
  { key: 'equipment', label: 'Oferta sprzętu', description: 'Sprzęt i dostępność' },
  { key: 'packages', label: 'Pakiety', description: 'Ceny i zawartość pakietów' },
  { key: 'addons', label: 'Dodatki', description: 'Usługi i oprogramowanie' },
  { key: 'customers', label: 'Klienci', description: 'Kontakty z zapytań' },
]

const adminSectionStorageKey = 'lapsoft-admin-section'

function isSection(value: string | null): value is Section {
  return sections.some(section => section.key === value)
}

const categoryLabels: Record<Equipment['category'], string> = {
  laptop: 'Laptopy',
  pc: 'Komputery PC',
  monitor: 'Monitory',
  biurko: 'Biurka',
  fotel: 'Fotele',
}

const stockSourceLabels: Record<NonNullable<Equipment['stockSource']>, string> = {
  seed: 'Dane startowe',
  sheet: 'Arkusz',
  manual: 'Ręczna korekta',
}

function formatStockDate(iso?: string) {
  if (!iso) return null
  return new Date(iso).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPackageName(id: string) {
  return packages.find(pkg => pkg.id === id)?.name ?? id
}

export default function AdminDashboard() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [catalogEquipment, setCatalogEquipment] = useState<Equipment[]>(equipment)
  const [equipmentLoading, setEquipmentLoading] = useState(true)
  const [equipmentError, setEquipmentError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [section, setSection] = useState<Section>('overview')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sectionFromUrl = params.get('section')
    const sectionFromStorage = window.localStorage.getItem(adminSectionStorageKey)
    const initialSection = isSection(sectionFromUrl)
      ? sectionFromUrl
      : isSection(sectionFromStorage)
        ? sectionFromStorage
        : 'overview'

    const restoreSection = window.setTimeout(() => {
      setSection(initialSection)
    }, 0)

    if (!isSection(sectionFromUrl) && initialSection !== 'overview') {
      params.set('section', initialSection)
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    }

    return () => {
      window.clearTimeout(restoreSection)
    }
  }, [])

  function changeSection(nextSection: Section) {
    const params = new URLSearchParams(window.location.search)

    if (nextSection === 'overview') {
      params.delete('section')
    } else {
      params.set('section', nextSection)
    }

    const query = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    window.localStorage.setItem(adminSectionStorageKey, nextSection)
    setSection(nextSection)
  }

  useEffect(() => {
    let ignore = false

    async function loadInquiries() {
      const res = await fetch('/api/admin/inquiries')
      if (ignore) return

      if (res.status === 403) {
        router.replace('/logowanie')
        return
      }

      if (res.ok) setInquiries(await res.json())
      if (!ignore) setLoading(false)
    }

    void loadInquiries()

    return () => {
      ignore = true
    }
  }, [router])

  useEffect(() => {
    let ignore = false

    async function loadEquipment() {
      const res = await fetch('/api/admin/equipment', { cache: 'no-store' })
      if (ignore) return

      if (res.status === 403) {
        router.replace('/logowanie')
        return
      }

      if (res.ok) {
        setCatalogEquipment(await res.json())
        setEquipmentError('')
      } else {
        setEquipmentError('Nie udało się pobrać sprzętu z API. Pokazuję dane zapasowe.')
      }

      if (!ignore) setEquipmentLoading(false)
    }

    void loadEquipment()

    return () => {
      ignore = true
    }
  }, [router])

  async function updateStatus(id: string, status: Status) {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.status === 403) {
      router.replace('/logowanie')
      return
    }
    if (!res.ok) return

    setInquiries(prev => prev.map(inquiry => inquiry.id === id ? { ...inquiry, status } : inquiry))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const counts: Record<Status | 'all', number> = {
    all: inquiries.length,
    nowe: inquiries.filter(inquiry => inquiry.status === 'nowe').length,
    'w toku': inquiries.filter(inquiry => inquiry.status === 'w toku').length,
    zakończone: inquiries.filter(inquiry => inquiry.status === 'zakończone').length,
  }
  const filtered = filter === 'all' ? inquiries : inquiries.filter(inquiry => inquiry.status === filter)
  const latestInquiries = inquiries.slice(0, 5)
  const monthlyPotential = inquiries
    .filter(inquiry => inquiry.status !== 'zakończone')
    .reduce((sum, inquiry) => sum + inquiry.monthlyTotal, 0)
  const equipmentUnits = catalogEquipment.reduce((sum, item) => sum + item.units, 0)
  const lowStock = catalogEquipment.filter(item => item.units <= 5)

  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string
      email: string
      phone: string
      inquiries: number
      latest: string
      totalMonthly: number
    }>()

    for (const inquiry of inquiries) {
      const key = inquiry.email || inquiry.phone
      const existing = map.get(key)

      if (existing) {
        existing.inquiries += 1
        existing.totalMonthly += inquiry.monthlyTotal
        if (new Date(inquiry.createdAt) > new Date(existing.latest)) {
          existing.latest = inquiry.createdAt
          existing.name = inquiry.name
          existing.phone = inquiry.phone
          existing.email = inquiry.email
        }
      } else {
        map.set(key, {
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          inquiries: 1,
          latest: inquiry.createdAt,
          totalMonthly: inquiry.monthlyTotal,
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime())
  }, [inquiries])

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <header className="sticky top-0 z-20 border-b border-[#102018]/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">LS</span>
            <span>
              <span className="block text-lg font-black tracking-tight text-gray-950">LapSoft</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Panel admina</span>
            </span>
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-md border border-[#102018]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-600 transition-colors hover:border-red-300 hover:text-red-500">
              Wyloguj
            </button>
          </form>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-10 text-white sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Centrum zarządzania</p>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-6xl">Panel administracyjny LapSoft</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f4f9ed]/70">
              Jedno miejsce do obsługi zapytań, przeglądu oferty, pakietów, dodatków i kontaktów klientów.
            </p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/12 bg-white/8 backdrop-blur">
            {[
              ['Zapytania', inquiries.length],
              ['Aktywne', counts.nowe + counts['w toku']],
              ['Sprzęt', equipmentUnits],
            ].map(([label, value]) => (
              <div key={label} className="border-white/10 p-5 text-center first:border-r last:border-l">
                <p className="text-4xl font-black text-[#dff2b8]">{value}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#f4f9ed]/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-[#102018]/10 bg-white p-2 shadow-sm lg:sticky lg:top-24">
          {sections.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => changeSection(item.key)}
              className={`mb-1 w-full rounded-md px-4 py-3 text-left transition-colors last:mb-0 ${
                section === item.key
                  ? 'bg-[#eef8dd] text-[#4f7414]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <span className="block text-sm font-black">{item.label}</span>
              <span className="mt-0.5 block text-xs font-semibold opacity-70">{item.description}</span>
            </button>
          ))}
        </aside>

        <div className="min-w-0">
          {section === 'overview' && (
            <OverviewSection
              counts={counts}
              latestInquiries={latestInquiries}
              monthlyPotential={monthlyPotential}
              lowStock={lowStock}
              setSection={changeSection}
            />
          )}

          {section === 'inquiries' && (
            <InquiriesSection
              loading={loading}
              filtered={filtered}
              selected={selected}
              equipment={catalogEquipment}
              filter={filter}
              counts={counts}
              setFilter={setFilter}
              setSelected={setSelected}
              updateStatus={updateStatus}
            />
          )}

          {section === 'equipment' && (
            <EquipmentSection
              equipment={catalogEquipment}
              loading={equipmentLoading}
              error={equipmentError}
              setEquipment={setCatalogEquipment}
            />
          )}
          {section === 'packages' && <PackagesSection />}
          {section === 'addons' && <AddonsSection />}
          {section === 'customers' && <CustomersSection customers={customers} />}
        </div>
      </main>
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">{description}</p>
    </div>
  )
}

function OverviewSection({
  counts,
  latestInquiries,
  monthlyPotential,
  lowStock,
  setSection,
}: {
  counts: Record<Status | 'all', number>
  latestInquiries: Inquiry[]
  monthlyPotential: number
  lowStock: Equipment[]
  setSection: (section: Section) => void
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Pulpit"
        title="Najważniejsze informacje"
        description="Szybki przegląd zapytań, potencjalnej miesięcznej wartości i sprzętu z niską dostępnością."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Wszystkie zapytania', counts.all, 'Z formularza i konfiguratora'],
          ['Nowe', counts.nowe, 'Do pierwszego kontaktu'],
          ['W toku', counts['w toku'], 'W trakcie obsługi'],
          ['Potencjał miesięczny', `${monthlyPotential} zł`, 'Aktywne zapytania'],
        ].map(([label, value, desc]) => (
          <div key={label} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-500">{label}</p>
            <p className="mt-2 text-4xl font-black text-gray-950">{value}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black tracking-tight text-gray-950">Ostatnie zapytania</h3>
            <button type="button" onClick={() => setSection('inquiries')} className="text-sm font-black text-[#5f8818] hover:text-[#4f7414]">
              Przejdź do zapytań
            </button>
          </div>
          {latestInquiries.length === 0 ? (
            <p className="rounded-md bg-[#f6f8f5] p-4 text-sm font-semibold text-gray-500">Brak zapytań do wyświetlenia.</p>
          ) : (
            <div className="space-y-2">
              {latestInquiries.map(inquiry => (
                <div key={inquiry.id} className="grid gap-3 rounded-md border border-[#102018]/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-black text-gray-950">{inquiry.name}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-500">
                      {getPackageName(inquiry.packageId)} · {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <span className={`w-fit rounded-md border px-3 py-1 text-xs font-black ${statusStyles[inquiry.status]}`}>
                    {statusLabels[inquiry.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black tracking-tight text-gray-950">Niska dostępność</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">Sprzęty z liczbą sztuk równą 5 lub mniej.</p>
          <div className="mt-4 space-y-2">
            {lowStock.length === 0 ? (
              <p className="rounded-md bg-[#eef8dd] p-4 text-sm font-black text-[#4f7414]">Brak alertów dostępności.</p>
            ) : (
              lowStock.map(item => (
                <div key={item.id} className="flex justify-between gap-4 rounded-md bg-[#fff7ed] px-4 py-3 text-sm">
                  <span className="font-black text-gray-950">{item.brand} {item.model}</span>
                  <span className="font-black text-amber-700">{item.units} szt.</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function InquiriesSection({
  loading,
  filtered,
  selected,
  equipment,
  filter,
  counts,
  setFilter,
  setSelected,
  updateStatus,
}: {
  loading: boolean
  filtered: Inquiry[]
  selected: Inquiry | null
  equipment: Equipment[]
  filter: Status | 'all'
  counts: Record<Status | 'all', number>
  setFilter: (filter: Status | 'all') => void
  setSelected: (inquiry: Inquiry) => void
  updateStatus: (id: string, status: Status) => Promise<void>
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Zapytania"
        title="Obsługa zapytań klientów"
        description="Lista zapytań z formularza i konfiguratora. Z tego miejsca można zmienić status obsługi."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-lg border p-4 text-left transition-all ${
              filter === key
                ? 'border-[#7DB122] bg-[#eef8dd]'
                : 'border-[#102018]/10 bg-white hover:border-[#7DB122]/60'
            }`}
          >
            <p className="text-3xl font-black text-gray-950">{counts[key]}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-wider text-gray-500">{label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-[#102018]/10 bg-white py-20 text-center text-gray-500 shadow-sm">Ładowanie...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-[#102018]/10 bg-white py-20 text-center shadow-sm">
          <p className="text-lg font-black text-gray-950">Brak zapytań</p>
          <p className="mt-2 text-sm text-gray-500">Po zmianie filtra albo pojawieniu się zapytania lista się uzupełni.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[420px_1fr]">
          <div className="space-y-2">
            {filtered.map(inquiry => (
              <button
                key={inquiry.id}
                type="button"
                onClick={() => setSelected(inquiry)}
                className={`w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:border-[#7DB122]/60 ${
                  selected?.id === inquiry.id ? 'border-[#7DB122]' : 'border-[#102018]/10'
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-black text-gray-950">{inquiry.name}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">{formatDate(inquiry.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-black ${statusStyles[inquiry.status]}`}>
                    {statusLabels[inquiry.status]}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-500">{inquiry.phone}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500">{getPackageName(inquiry.packageId)} · {inquiry.period} mies.</p>
                <p className="mt-3 text-xl font-black text-[#5f8818]">{inquiry.monthlyTotal} zł/mies.</p>
              </button>
            ))}
          </div>

          {!selected ? (
            <div className="flex min-h-80 items-center justify-center rounded-lg border border-[#102018]/10 bg-white text-center shadow-sm">
              <div>
                <p className="text-lg font-black text-gray-950">Wybierz zapytanie</p>
                <p className="mt-2 text-sm text-gray-500">Szczegóły klienta pojawią się w tym panelu.</p>
              </div>
            </div>
          ) : (
            <InquiryDetails selected={selected} equipment={equipment} updateStatus={updateStatus} />
          )}
        </div>
      )}
    </div>
  )
}

function InquiryDetails({
  selected,
  equipment,
  updateStatus,
}: {
  selected: Inquiry
  equipment: Equipment[]
  updateStatus: (id: string, status: Status) => Promise<void>
}) {
  const selectedEquipment = selected.equipmentIds ?? []

  return (
    <section className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 border-b border-[#102018]/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Szczegóły zapytania</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-950">{selected.name}</h2>
        </div>
        <span className={`w-fit rounded-md border px-3 py-1 text-xs font-black ${statusStyles[selected.status]}`}>
          {statusLabels[selected.status]}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Telefon', selected.phone],
          ['E-mail', selected.email || '-'],
          ['Wiek', selected.age || '-'],
          ['Data', formatDate(selected.createdAt)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-[#f6f8f5] p-3">
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</p>
            <p className="mt-1 text-sm font-black text-gray-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-[#7DB122]/25 bg-[#eef8dd] p-5">
        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Wybrany pakiet</p>
        <p className="mt-2 text-2xl font-black text-gray-950">{getPackageName(selected.packageId)}</p>
        <p className="mt-1 text-sm font-semibold text-gray-600">Okres: {selected.period} miesięcy</p>
        {selectedEquipment.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedEquipment.map(id => {
              const item = equipment.find(equipmentItem => equipmentItem.id === id)
              return item ? (
                <span key={id} className="rounded-md bg-white px-3 py-1 text-xs font-black text-gray-600">
                  {item.brand} {item.model}
                </span>
              ) : null
            })}
          </div>
        )}
        {selected.addons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.addons.map(id => {
              const addon = softwareAddons.find(item => item.id === id)
              return addon ? (
                <span key={id} className="rounded-md bg-white px-3 py-1 text-xs font-black text-gray-600">
                  {addon.name}
                </span>
              ) : null
            })}
          </div>
        )}
        {selected.buyout && (
          <p className="mt-3 text-sm font-black text-[#5f8818]">Zainteresowany wykupem sprzętu</p>
        )}
        <p className="mt-4 border-t border-[#7DB122]/25 pt-4 text-4xl font-black text-[#5f8818]">
          {selected.monthlyTotal}<span className="text-base text-gray-500"> zł/mies.</span>
        </p>
      </div>

      {selected.message && (
        <div className="mb-6 rounded-lg border border-[#102018]/10 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Wiadomość klienta</p>
          <p className="mt-2 text-sm leading-7 text-gray-600">{selected.message}</p>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Zmień status</p>
        <div className="flex flex-wrap gap-2">
          {(['nowe', 'w toku', 'zakończone'] as Status[]).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => updateStatus(selected.id, status)}
              className={`rounded-md border px-4 py-2 text-sm font-black transition-all ${
                selected.status === status
                  ? statusStyles[status]
                  : 'border-[#102018]/10 text-gray-500 hover:border-[#7DB122]/60 hover:text-gray-950'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function EquipmentSection({
  equipment,
  loading,
  error,
  setEquipment,
}: {
  equipment: Equipment[]
  loading: boolean
  error: string
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>
}) {
  const [savingId, setSavingId] = useState<string | null>(null)
  const [stockEditId, setStockEditId] = useState<string | null>(null)
  const [priceEditId, setPriceEditId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const grouped = equipment.reduce((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {} as Record<Equipment['category'], Equipment[]>)

  async function updateEquipmentItem(
    id: string,
    data: { units?: number; active?: boolean; monthlyPrice?: number | null }
  ) {
    setSavingId(id)
    setMessage('')

    try {
      const res = await fetch(`/api/admin/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const responseData = await res.json()

      if (!res.ok) {
        setMessage(responseData.error ?? 'Nie udało się zapisać zmian.')
        return
      }

      setEquipment(prev => prev.map(item => item.id === id ? responseData : item))
      if ('units' in data) setStockEditId(null)
      if ('monthlyPrice' in data) setPriceEditId(null)
      setMessage('Zapisano zmiany w sprzęcie.')
    } catch {
      setMessage('Nie udało się połączyć z API sprzętu.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Oferta"
        title="Sprzęt w ofercie"
        description="Widok czyta sprzęt z API administracyjnego. Stan sztuk traktujemy jako dane synchronizowane z arkusza, więc ręczna korekta jest schowana."
      />

      {loading && (
        <div className="mb-6 rounded-lg border border-[#102018]/10 bg-white p-4 text-sm font-semibold text-gray-500">
          Ładowanie sprzętu z API...
        </div>
      )}

      {(error || message) && (
        <div className={`mb-6 rounded-lg border p-4 text-sm font-semibold leading-6 ${
          error || message.startsWith('Nie')
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-[#7DB122]/30 bg-[#eef8dd] text-[#4f7414]'
        }`}>
          {error || message}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{categoryLabels[category as Equipment['category']]}</p>
                <h3 className="mt-1 text-2xl font-black tracking-tight text-gray-950">{items.length} pozycji</h3>
              </div>
              <p className="text-sm font-black text-gray-500">{items.reduce((sum, item) => sum + item.units, 0)} szt.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map(item => (
                <article key={item.id} className="rounded-lg border border-[#102018]/10 bg-[#f6f8f5] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{item.brand}</p>
                      <h4 className="mt-1 text-lg font-black leading-tight text-gray-950">{item.model}</h4>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-black ${item.active === false ? 'bg-gray-200 text-gray-600' : item.units <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-[#eef8dd] text-[#4f7414]'}`}>
                        {item.units} szt.
                      </span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-black ${item.active === false ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700'}`}>
                        {item.active === false ? 'Ukryty' : 'Widoczny'}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{item.description}</p>
                  {item.monthlyPrice && (
                    <p className="mt-3 text-sm font-black text-[#5f8818]">+{item.monthlyPrice} zł/mies. jako dodatek</p>
                  )}
                  <div className="mt-4 grid gap-2">
                    <div className="rounded-md border border-[#102018]/8 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">Stan magazynowy</p>
                          <p className="mt-1 text-sm font-black text-gray-950">{item.units} szt.</p>
                        </div>
                        <button
                          type="button"
                          disabled={savingId === item.id}
                          onClick={() => setStockEditId(prev => prev === item.id ? null : item.id)}
                          className="rounded-md border border-[#102018]/12 px-3 py-2 text-xs font-black uppercase text-gray-500 transition-colors hover:border-[#7DB122]/60 hover:text-[#4f7414] disabled:opacity-50"
                        >
                          Korekta
                        </button>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-5 text-gray-400">
                        Źródło: <span className="font-black text-gray-500">{stockSourceLabels[item.stockSource ?? 'seed']}</span>
                        {formatStockDate(item.stockSyncedAt) && (
                          <span> · aktualizacja: {formatStockDate(item.stockSyncedAt)}</span>
                        )}
                      </p>
                      {stockEditId === item.id && (
                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                          <input
                            type="number"
                            min={0}
                            defaultValue={item.units}
                            disabled={savingId === item.id}
                            aria-label={`Ręczna korekta stanu: ${item.brand} ${item.model}`}
                            className="w-full rounded-md border border-[#102018]/12 bg-white px-3 py-2 text-sm font-bold text-gray-950 focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
                            onKeyDown={event => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                updateEquipmentItem(item.id, {
                                  units: Math.max(0, Number(event.currentTarget.value || 0)),
                                })
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={event => {
                              const input = event.currentTarget.previousElementSibling as HTMLInputElement | null
                              updateEquipmentItem(item.id, {
                                units: Math.max(0, Number(input?.value || 0)),
                              })
                            }}
                            className="rounded-md bg-[#6f9f1f] px-3 py-2 text-xs font-black uppercase text-white transition-colors hover:bg-[#5f8818] disabled:opacity-50"
                          >
                            Zapisz
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rounded-md border border-[#102018]/8 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">Cena miesięczna</p>
                          <p className="mt-1 text-sm font-black text-gray-950">
                            {item.monthlyPrice ? `+${item.monthlyPrice} zł/mies.` : 'Brak ceny dodatku'}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={savingId === item.id}
                          onClick={() => setPriceEditId(prev => prev === item.id ? null : item.id)}
                          className="rounded-md border border-[#102018]/12 px-3 py-2 text-xs font-black uppercase text-gray-500 transition-colors hover:border-[#7DB122]/60 hover:text-[#4f7414] disabled:opacity-50"
                        >
                          Edytuj cenę
                        </button>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-5 text-gray-400">
                        Zapis następuje dopiero po kliknięciu przycisku.
                      </p>
                      {priceEditId === item.id && (
                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                          <input
                            type="number"
                            min={0}
                            defaultValue={item.monthlyPrice ?? ''}
                            disabled={savingId === item.id}
                            placeholder="Brak"
                            aria-label={`Cena miesięczna: ${item.brand} ${item.model}`}
                            className="w-full rounded-md border border-[#102018]/12 bg-white px-3 py-2 text-sm font-bold text-gray-950 focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
                            onKeyDown={event => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                updateEquipmentItem(item.id, {
                                  monthlyPrice: event.currentTarget.value === ''
                                    ? null
                                    : Math.max(0, Number(event.currentTarget.value || 0)),
                                })
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={event => {
                              const input = event.currentTarget.previousElementSibling as HTMLInputElement | null
                              updateEquipmentItem(item.id, {
                                monthlyPrice: input?.value === '' ? null : Math.max(0, Number(input?.value || 0)),
                              })
                            }}
                            className="rounded-md bg-[#6f9f1f] px-3 py-2 text-xs font-black uppercase text-white transition-colors hover:bg-[#5f8818] disabled:opacity-50"
                          >
                            Zapisz cenę
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={savingId === item.id}
                      onClick={() => updateEquipmentItem(item.id, { active: item.active === false })}
                      className="rounded-md border border-[#102018]/12 bg-white px-3 py-2 text-xs font-black uppercase text-gray-600 transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-50"
                    >
                      {item.active === false ? 'Pokaż w ofercie' : 'Ukryj w ofercie'}
                    </button>
                    <Link href={`/sprzet/${item.id}`} className="text-sm font-black text-[#5f8818] hover:text-[#4f7414]">
                      Podgląd
                    </Link>
                  </div>
                  {savingId === item.id && (
                    <p className="mt-3 text-xs font-bold text-gray-400">Zapisywanie...</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function PackagesSection() {
  return (
    <div>
      <SectionHeader
        eyebrow="Pakiety"
        title="Pakiety abonamentowe"
        description="Przegląd cen, okresów i elementów pakietów. Docelowo ceny powinny być edytowalne z panelu."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {packages.map(pkg => (
          <article key={pkg.id} className={`rounded-lg border p-5 shadow-sm ${pkg.popular ? 'border-[#7DB122] bg-[#102018] text-white' : 'border-[#102018]/10 bg-white text-gray-950'}`}>
            {pkg.popular && <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#dff2b8]">Najczęstszy wybór</p>}
            <h3 className="text-2xl font-black tracking-tight">{pkg.name}</h3>
            <p className={`mt-2 text-sm leading-6 ${pkg.popular ? 'text-[#f4f9ed]/70' : 'text-gray-600'}`}>{pkg.description}</p>
            <div className="mt-5 grid gap-2">
              {periods.map(period => (
                <div key={period.key} className={`flex justify-between rounded-md px-3 py-2 text-sm ${pkg.popular ? 'bg-white/8 text-[#f4f9ed]/75' : 'bg-[#f6f8f5] text-gray-600'}`}>
                  <span className="font-bold">{period.label}</span>
                  <span className="font-black">{pkg.prices[period.key]} zł/mies.</span>
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              {pkg.includes.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#7DB122]">✓</span>
                  <span className={pkg.popular ? 'text-[#f4f9ed]/80' : 'text-gray-700'}>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

function AddonsSection() {
  return (
    <div>
      <SectionHeader
        eyebrow="Dodatki"
        title="Oprogramowanie i usługi"
        description="Lista usług doliczanych do miesięcznej raty w konfiguratorze i formularzu kontaktowym."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {softwareAddons.map(addon => (
          <article key={addon.id} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{addon.recommendedFor ?? 'Dodatek'}</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-gray-950">{addon.name}</h3>
              </div>
              <p className="shrink-0 text-2xl font-black text-[#5f8818]">+{addon.price} zł</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">{addon.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function CustomersSection({
  customers,
}: {
  customers: {
    name: string
    email: string
    phone: string
    inquiries: number
    latest: string
    totalMonthly: number
  }[]
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Klienci"
        title="Kontakty z zapytań"
        description="Prosty widok klientów wyliczany z zapytań. Docelowo może zostać zastąpiony tabelą użytkowników z bazy."
      />

      {customers.length === 0 ? (
        <div className="rounded-lg border border-[#102018]/10 bg-white py-20 text-center shadow-sm">
          <p className="text-lg font-black text-gray-950">Brak kontaktów</p>
          <p className="mt-2 text-sm text-gray-500">Kontakty pojawią się po pierwszych zapytaniach.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_180px_140px_160px] gap-4 border-b border-[#102018]/8 bg-[#f6f8f5] px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-400 md:grid">
            <span>Klient</span>
            <span>Telefon</span>
            <span>Zapytania</span>
            <span>Ostatni kontakt</span>
          </div>
          {customers.map(customer => (
            <div key={`${customer.email}-${customer.phone}`} className="grid gap-3 border-b border-[#102018]/8 px-5 py-4 last:border-b-0 md:grid-cols-[1fr_180px_140px_160px] md:items-center">
              <div>
                <p className="font-black text-gray-950">{customer.name}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500">{customer.email || 'Brak e-maila'}</p>
              </div>
              <p className="text-sm font-bold text-gray-700">{customer.phone}</p>
              <p className="text-sm font-bold text-gray-700">{customer.inquiries} · {customer.totalMonthly} zł/mies.</p>
              <p className="text-sm font-bold text-gray-500">{formatDate(customer.latest)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { equipment } from '@/data/equipment'
import { packages } from '@/data/packages'
import { softwareAddons } from '@/data/software'
import type { Inquiry } from '@/lib/storage'

type Status = Inquiry['status']

const statusStyles: Record<Status, string> = {
  'nowe': 'border-blue-300 bg-blue-50 text-blue-700',
  'w toku': 'border-amber-300 bg-amber-50 text-amber-700',
  'zakończone': 'border-[#7DB122]/40 bg-[#eef8dd] text-[#5f8818]',
}

const filters: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'nowe', label: 'Nowe' },
  { key: 'w toku', label: 'W toku' },
  { key: 'zakończone', label: 'Zakończone' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminDashboard() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')

  useEffect(() => {
    if (!sessionStorage.getItem('lapsoft-admin')) router.replace('/admin')
  }, [router])

  useEffect(() => {
    let ignore = false

    async function loadInquiries() {
      const res = await fetch('/api/admin/inquiries')
      if (!ignore && res.ok) setInquiries(await res.json())
      if (!ignore) setLoading(false)
    }

    void loadInquiries()

    return () => {
      ignore = true
    }
  }, [])

  async function updateStatus(id: string, status: Status) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  function logout() {
    sessionStorage.removeItem('lapsoft-admin')
    router.push('/admin')
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)
  const counts: Record<Status | 'all', number> = {
    all: inquiries.length,
    'nowe': inquiries.filter(i => i.status === 'nowe').length,
    'w toku': inquiries.filter(i => i.status === 'w toku').length,
    'zakończone': inquiries.filter(i => i.status === 'zakończone').length,
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <header className="sticky top-0 z-20 border-b border-[#102018]/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">LS</span>
            <div>
              <p className="text-lg font-black tracking-tight text-gray-950">LapSoft</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Panel admina</p>
            </div>
          </div>
          <button onClick={logout} className="rounded-md border border-[#102018]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-600 transition-colors hover:border-red-300 hover:text-red-500">
            Wyloguj
          </button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-10 text-white sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Zapytania klientów</p>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="text-5xl font-black tracking-tight md:text-6xl">Dashboard</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f4f9ed]/70">
                Warstwa UI panelu administracyjnego. Logika pobierania zapytań i zmiany statusu bez zmian.
              </p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-bold text-[#f4f9ed]/55">Wszystkie zapytania</p>
              <p className="mt-1 text-5xl font-black text-[#dff2b8]">{inquiries.length}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {filters.map(({ key, label }) => (
            <button
              key={key}
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
              {filtered.map(inq => {
                const pkg = packages.find(p => p.id === inq.packageId)
                return (
                  <button
                    key={inq.id}
                    onClick={() => setSelected(inq)}
                    className={`w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:border-[#7DB122]/60 ${
                      selected?.id === inq.id ? 'border-[#7DB122]' : 'border-[#102018]/10'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-gray-950">{inq.name}</p>
                        <p className="mt-1 text-xs font-semibold text-gray-500">{formatDate(inq.createdAt)}</p>
                      </div>
                      <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-black ${statusStyles[inq.status]}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{inq.phone}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-500">{pkg?.name ?? inq.packageId} · {inq.period} mies.</p>
                    <p className="mt-3 text-xl font-black text-[#5f8818]">{inq.monthlyTotal} zł/mies.</p>
                  </button>
                )
              })}
            </div>

            {!selected ? (
              <div className="flex min-h-80 items-center justify-center rounded-lg border border-[#102018]/10 bg-white text-center shadow-sm">
                <div>
                  <p className="text-lg font-black text-gray-950">Wybierz zapytanie</p>
                  <p className="mt-2 text-sm text-gray-500">Szczegóły klienta pojawią się w tym panelu.</p>
                </div>
              </div>
            ) : (
              <section className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 border-b border-[#102018]/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Szczegóły zapytania</p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-950">{selected.name}</h2>
                  </div>
                  <span className={`w-fit rounded-md border px-3 py-1 text-xs font-black ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Telefon', selected.phone],
                    ['E-mail', selected.email || '—'],
                    ['Wiek', selected.age || '—'],
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
                  <p className="mt-2 text-2xl font-black text-gray-950">{packages.find(p => p.id === selected.packageId)?.name ?? selected.packageId}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">Okres: {selected.period} miesięcy</p>
                  {selected.equipmentIds && selected.equipmentIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.equipmentIds.map(id => {
                        const item = equipment.find(e => e.id === id)
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
                        const addon = softwareAddons.find(a => a.id === id)
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
                        onClick={() => updateStatus(selected.id, status)}
                        className={`rounded-md border px-4 py-2 text-sm font-black transition-all ${
                          selected.status === status
                            ? statusStyles[status]
                            : 'border-[#102018]/10 text-gray-500 hover:border-[#7DB122]/60 hover:text-gray-950'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

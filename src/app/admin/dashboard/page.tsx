'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { packages } from '@/data/packages'
import { softwareAddons } from '@/data/software'
import type { Inquiry } from '@/lib/storage'

type Status = Inquiry['status']

const statusStyles: Record<Status, string> = {
  'nowe': 'bg-blue-900/50 text-blue-400 border border-blue-700/50',
  'w toku': 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
  'zakończone': 'bg-green-900/50 text-green-400 border border-green-700/50',
}

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

  const fetchInquiries = useCallback(async () => {
    const res = await fetch('/api/admin/inquiries')
    if (res.ok) setInquiries(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

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
  const counts = {
    all: inquiries.length,
    'nowe': inquiries.filter(i => i.status === 'nowe').length,
    'w toku': inquiries.filter(i => i.status === 'w toku').length,
    'zakończone': inquiries.filter(i => i.status === 'zakończone').length,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="font-black text-lg"><span className="text-white">Lap</span><span className="text-green-500">Soft</span></span>
          <span className="text-gray-700 text-xs uppercase tracking-widest font-bold">Panel Admina</span>
        </div>
        <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 font-semibold transition-colors uppercase tracking-wider">
          Wyloguj
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {([
            ['all', 'Wszystkie', 'gray'],
            ['nowe', 'Nowe', 'blue'],
            ['w toku', 'W toku', 'yellow'],
            ['zakończone', 'Zakończone', 'green'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-left p-4 border transition-all ${
                filter === key
                  ? 'border-green-600 bg-gray-900'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <p className="text-2xl font-black text-white">{counts[key as keyof typeof counts]}</p>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider font-bold">{label}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Ładowanie...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-gray-800">
            <p className="text-gray-500 text-lg">Brak zapytań</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            {/* List */}
            <div className="xl:col-span-2 space-y-2">
              {filtered.map(inq => {
                const pkg = packages.find(p => p.id === inq.packageId)
                return (
                  <button
                    key={inq.id}
                    onClick={() => setSelected(inq)}
                    className={`w-full text-left bg-gray-900 border p-4 transition-all hover:border-gray-600 ${
                      selected?.id === inq.id ? 'border-green-600' : 'border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-sm text-white">{inq.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 shrink-0 ${statusStyles[inq.status]}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{inq.phone}</p>
                    <p className="text-xs text-gray-500">{pkg?.name ?? inq.packageId} · {inq.period} mies.</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-black text-green-500">{inq.monthlyTotal} zł/mies.</p>
                      <p className="text-xs text-gray-700">{formatDate(inq.createdAt)}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Detail */}
            <div className="xl:col-span-3">
              {!selected ? (
                <div className="border border-gray-800 bg-gray-900 h-48 flex items-center justify-center text-gray-700 text-sm">
                  Kliknij zapytanie, aby zobaczyć szczegóły
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 p-6">
                  <div className="flex items-start justify-between mb-5">
                    <h2 className="text-xl font-black text-white">{selected.name}</h2>
                    <span className={`text-xs font-bold px-3 py-1 ${statusStyles[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                      ['Telefon', selected.phone],
                      ['E-mail', selected.email || '—'],
                      ['Wiek', selected.age || '—'],
                      ['Data', formatDate(selected.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-gray-800 border border-gray-700 p-3">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                        <p className="font-semibold text-sm text-white mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-green-800/50 bg-green-900/20 p-4 mb-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2">Wybrany pakiet</p>
                    <p className="font-black text-white">{packages.find(p => p.id === selected.packageId)?.name ?? selected.packageId}</p>
                    <p className="text-sm text-gray-500">Okres: {selected.period} miesięcy</p>
                    {selected.addons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selected.addons.map(id => {
                          const a = softwareAddons.find(a => a.id === id)
                          return a ? (
                            <span key={id} className="text-xs border border-gray-700 text-gray-400 px-2 py-0.5">
                              {a.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    )}
                    {selected.buyout && (
                      <p className="text-xs text-green-400 mt-2 font-semibold">Zainteresowany wykupem sprzętu</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-green-800/30">
                      <p className="text-3xl font-black text-green-500">{selected.monthlyTotal}<span className="text-base text-gray-500 font-normal"> zł/mies.</span></p>
                    </div>
                  </div>

                  {selected.message && (
                    <div className="bg-gray-800 border border-gray-700 p-4 mb-5">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Wiadomość klienta</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{selected.message}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Zmień status</p>
                    <div className="flex gap-2">
                      {(['nowe', 'w toku', 'zakończone'] as Status[]).map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selected.id, s)}
                          className={`px-4 py-2 text-sm font-bold transition-all border ${
                            selected.status === s
                              ? statusStyles[s]
                              : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getCurrentUser } from '@/lib/dal'
import { getInquiriesByUser } from '@/lib/storage'
import { logout } from '@/app/actions/auth'
import { packages } from '@/data/packages'

const statusStyles: Record<string, string> = {
  'nowe': 'border-blue-300 bg-blue-50 text-blue-700',
  'w toku': 'border-amber-300 bg-amber-50 text-amber-700',
  'zakończone': 'border-[#7DB122]/40 bg-[#eef8dd] text-[#5f8818]',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function PanelKlientaPage() {
  const user = await getCurrentUser()
  const inquiries = await getInquiriesByUser(user.id)

  const active = inquiries.filter(i => i.status !== 'zakończone').length
  const done = inquiries.filter(i => i.status === 'zakończone').length

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-10 text-white sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />

        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">LS</span>
              <span>
                <span className="block text-xl font-black tracking-tight">LapSoft</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#f4f9ed]/45">Panel klienta</span>
              </span>
            </Link>
            <form action={logout}>
              <button className="rounded-md border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#f4f9ed]/80 transition-colors hover:border-red-300 hover:text-red-300">
                Wyloguj
              </button>
            </form>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Twoje konto</p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Cześć, {user.name.split(' ')[0]}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f4f9ed]/70">
                Tu znajdziesz swoje zapytania z konfiguratora, ich statusy i szczegóły. Zalogowano jako {user.email}.
              </p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-bold text-[#f4f9ed]/60">Twoje zapytania</p>
              <p className="mt-2 text-5xl font-black text-[#dff2b8]">{inquiries.length}</p>
              <p className="mt-2 text-sm leading-6 text-[#f4f9ed]/60">{active} w toku · {done} zakończonych</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-gray-950">Historia zapytań</h2>
          <Link href="/pakiety" className="rounded-md bg-[#6f9f1f] px-5 py-2.5 text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]">
            Nowe zapytanie
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-lg border border-[#102018]/10 bg-white py-20 text-center shadow-sm">
            <p className="text-lg font-black text-gray-950">Nie masz jeszcze żadnych zapytań</p>
            <p className="mt-2 text-sm text-gray-500">Skonfiguruj swój zestaw w konfiguratorze — pojawi się tutaj.</p>
            <Link href="/pakiety" className="mt-5 inline-block rounded-md bg-[#6f9f1f] px-6 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]">
              Przejdź do konfiguratora
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {inquiries.map(inq => {
              const pkg = packages.find(p => p.id === inq.packageId)
              return (
                <div key={inq.id} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-gray-950">{pkg?.name ?? inq.packageId}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-500">{formatDate(inq.createdAt)}</p>
                    </div>
                    <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-black ${statusStyles[inq.status] ?? ''}`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Okres: {inq.period} mies.{inq.buyout ? ' · z wykupem' : ''}</p>
                  <p className="mt-3 text-2xl font-black text-[#5f8818]">{inq.monthlyTotal} zł<span className="text-sm text-gray-500">/mies.</span></p>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

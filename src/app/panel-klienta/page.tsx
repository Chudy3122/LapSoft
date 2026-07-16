import Link from 'next/link'
import { getCurrentUser } from '@/lib/dal'
import { getInquiriesByUser } from '@/lib/storage'
import { logout } from '@/app/actions/auth'
import { equipment } from '@/data/equipment'
import { packages } from '@/data/packages'
import { softwareAddons } from '@/data/software'

const statusStyles: Record<string, string> = {
  'nowe': 'border-blue-300 bg-blue-50 text-blue-700',
  'w toku': 'border-amber-300 bg-amber-50 text-amber-700',
  'zakończone': 'border-[#7DB122]/40 bg-[#eef8dd] text-[#5f8818]',
}

const statusMessages: Record<string, { title: string; description: string }> = {
  'nowe': {
    title: 'Zapytanie czeka na kontakt',
    description: 'Odezwiemy się, żeby potwierdzić potrzeby i doprecyzować zestaw przed przygotowaniem oferty.',
  },
  'w toku': {
    title: 'Pracujemy nad ofertą',
    description: 'Zapytanie jest już po naszej stronie. Sprawdzamy dostępność sprzętu, konfigurację i warunki abonamentu.',
  },
  'zakończone': {
    title: 'Sprawa zakończona',
    description: 'Ten temat został zamknięty. Jeśli potrzebujesz kolejnego zestawu, możesz wysłać nowe zapytanie.',
  },
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
  const latestActive = inquiries.find(i => i.status !== 'zakończone')

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
              <p className="mt-2 text-sm leading-6 text-[#f4f9ed]/60">{active} aktywnych · {done} zakończonych</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        {latestActive && (
          <section className="mb-6 rounded-lg border border-[#7DB122]/25 bg-[#eef8dd] p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Najbliższy krok</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950">
              {statusMessages[latestActive.status]?.title ?? 'Zapytanie jest w obsłudze'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              {statusMessages[latestActive.status]?.description ?? 'Będziemy aktualizować status zapytania w tym panelu.'}
            </p>
          </section>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-gray-950">Historia zapytań</h2>
          <Link href="/pakiety" className="rounded-md bg-[#6f9f1f] px-5 py-2.5 text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]">
            Nowe zapytanie
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-lg border border-[#102018]/10 bg-white p-8 text-center shadow-sm md:p-12">
            <p className="text-lg font-black text-gray-950">Nie masz jeszcze żadnych zapytań</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Skonfiguruj zestaw i wyślij formularz jako zalogowany użytkownik. Wtedy zapytanie pojawi się tutaj razem ze statusem i szczegółami.
            </p>
            <div className="mx-auto mt-5 max-w-xl rounded-lg border border-[#7DB122]/25 bg-[#eef8dd] p-4 text-left">
              <p className="text-sm font-black text-gray-950">Warto wiedzieć</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Zapytania wysłane wcześniej bez logowania nadal są obsługiwane, ale nie pojawią się automatycznie w tym panelu.
              </p>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/pakiety" className="rounded-md bg-[#6f9f1f] px-6 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]">
                Przejdź do konfiguratora
              </Link>
              <Link href="/kontakt" className="rounded-md border border-[#102018]/15 bg-white px-6 py-3 text-sm font-black uppercase text-gray-950 transition-colors hover:border-[#7DB122]/60 hover:text-[#5f8818]">
                Zapytaj o pomoc
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {inquiries.map(inq => {
              const pkg = packages.find(p => p.id === inq.packageId)
              const selectedEquipment = (inq.equipmentIds ?? [])
                .map(id => equipment.find(item => item.id === id))
                .filter(Boolean) as typeof equipment
              const selectedAddons = inq.addons
                .map(id => softwareAddons.find(addon => addon.id === id))
                .filter(Boolean) as typeof softwareAddons
              const statusMessage = statusMessages[inq.status]

              return (
                <article key={inq.id} className="overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-sm">
                  <div className="border-b border-[#102018]/10 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Zapytanie z {formatDate(inq.createdAt)}</p>
                        <h3 className="mt-1 text-2xl font-black tracking-tight text-gray-950">{pkg?.name ?? inq.packageId}</h3>
                      </div>
                      <span className={`w-fit shrink-0 rounded-md border px-3 py-1 text-xs font-black ${statusStyles[inq.status] ?? ''}`}>
                        {inq.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">
                    <div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          ['Okres', `${inq.period} mies.`],
                          ['Rata', `${inq.monthlyTotal} zł/mies.`],
                          ['Wykup', inq.buyout ? 'Tak' : 'Nie'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-md bg-[#f6f8f5] p-3">
                            <p className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</p>
                            <p className="mt-1 text-sm font-black text-gray-950">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Wybrany sprzęt</p>
                          {selectedEquipment.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedEquipment.map(item => (
                                <Link
                                  key={item.id}
                                  href={`/sprzet/${item.id}`}
                                  className="rounded-md border border-[#102018]/10 bg-white px-3 py-1.5 text-xs font-black text-gray-700 transition-colors hover:border-[#7DB122]/60 hover:text-[#5f8818]"
                                >
                                  {item.brand} {item.model}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm font-semibold text-gray-500">Sprzęt doprecyzujemy podczas rozmowy.</p>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Dodatki i usługi</p>
                          {selectedAddons.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedAddons.map(addon => (
                                <span key={addon.id} className="rounded-md bg-[#eef8dd] px-3 py-1.5 text-xs font-black text-[#5f8818]">
                                  {addon.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm font-semibold text-gray-500">Bez dodatkowych usług w zapytaniu.</p>
                          )}
                        </div>
                      </div>

                      {inq.message && (
                        <div className="mt-5 rounded-md border border-[#102018]/8 bg-[#f6f8f5] p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Twoja wiadomość</p>
                          <p className="mt-2 text-sm leading-6 text-gray-600">{inq.message}</p>
                        </div>
                      )}
                    </div>

                    <aside className="rounded-lg border border-[#7DB122]/25 bg-[#eef8dd] p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Co dalej?</p>
                      <h4 className="mt-2 font-black text-gray-950">{statusMessage?.title ?? 'Zapytanie jest w obsłudze'}</h4>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {statusMessage?.description ?? 'Będziemy aktualizować status zapytania w tym panelu.'}
                      </p>
                      <Link
                        href="/kontakt"
                        className="mt-4 inline-block rounded-md border border-[#6f9f1f]/30 bg-white px-4 py-2 text-xs font-black uppercase text-[#5f8818] transition-colors hover:border-[#6f9f1f] hover:bg-[#f6faef]"
                      >
                        Dopytaj o zapytanie
                      </Link>
                    </aside>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

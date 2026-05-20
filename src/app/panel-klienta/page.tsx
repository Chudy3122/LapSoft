import Link from 'next/link'

const menuItems = ['Pulpit', 'Abonament', 'Płatności', 'Sprzęt', 'Wsparcie']

const stats = [
  ['Aktywny pakiet', 'Laptop + Monitor'],
  ['Rata miesięczna', '199 zł'],
  ['Następna płatność', 'wkrótce'],
]

const supportItems = [
  ['Zgłoszenie serwisowe', 'Opisz problem ze sprzętem lub oprogramowaniem.'],
  ['Zmiana pakietu', 'Przygotowanie miejsca pod przyszłą zmianę abonamentu.'],
  ['Dokumenty', 'Umowy, faktury i potwierdzenia płatności.'],
]

export default function PanelKlientaPage() {
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
            <div className="flex flex-wrap gap-2">
              {menuItems.map(item => (
                <span key={item} className="rounded-md border border-white/12 bg-white/8 px-3 py-2 text-xs font-black uppercase text-[#f4f9ed]/70">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Makieta UI</p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Panel klienta</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f4f9ed]/70">
                Wizualna baza pod przyszłe logowanie klienta, abonamenty, płatności i obsługę zgłoszeń. Dane są przykładowe.
              </p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-bold text-[#f4f9ed]/60">Status konta</p>
              <p className="mt-2 text-3xl font-black text-white">Aktywny abonament</p>
              <p className="mt-2 text-sm leading-6 text-[#f4f9ed]/60">Tu backend podepnie realny status klienta.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-[#102018]/10 bg-white p-4 shadow-sm lg:self-start">
          <p className="px-3 py-2 text-xs font-black uppercase tracking-widest text-[#5f8818]">Nawigacja</p>
          <div className="mt-2 space-y-1">
            {menuItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-3 py-3 text-sm font-black ${
                  index === 0 ? 'bg-[#eef8dd] text-[#5f8818]' : 'text-gray-600'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-gray-950">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Abonament</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Laptop + Monitor</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Miejsce na szczegóły aktywnej umowy, okres abonamentu, sprzęt przypisany do klienta i opcje wykupu.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Dell Vostro 15 3530', 'Xiaomi A27i', 'Wsparcie IT', 'Dostawa i konfiguracja'].map(item => (
                  <div key={item} className="rounded-md bg-[#f6f8f5] px-4 py-3 text-sm font-black text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-[#102018] p-6 text-white shadow-xl shadow-[#102018]/15">
              <p className="text-xs font-black uppercase tracking-widest text-[#dff2b8]">Najbliższe płatności</p>
              <p className="mt-4 text-5xl font-black text-[#dff2b8]">199 zł</p>
              <p className="mt-2 text-sm font-semibold text-[#f4f9ed]/55">Sekcja gotowa pod integrację z płatnościami.</p>
              <button className="mt-6 w-full rounded-md bg-[#6f9f1f] px-5 py-3 text-sm font-black text-white">
                Opłać abonament
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {supportItems.map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
                <p className="font-black text-gray-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

import Link from 'next/link'
import { packages } from '@/data/packages'

const highlights = [
  'Dostawa i konfiguracja sprzętu w cenie',
  'Stała rata miesięczna przez wybrany okres',
  'Możliwość dobrania biurka, fotela i usług',
  'Zapytanie bez zobowiązań przed podpisaniem umowy',
]

export default function PakietyPage() {
  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-16 text-white sm:px-6 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(223,242,184,0.12),transparent_26%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />

        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Pakiety abonamentowe</p>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
                Wybierz bazę zestawu, a szczegóły dopracuj w konfiguratorze.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/70">
                Pakiety pokazują punkt startowy abonamentu. Konkretny sprzęt, okres, dodatkowe wyposażenie i usługi wybierzesz w kolejnym kroku.
              </p>
            </div>

            <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-black text-[#dff2b8]">Najważniejsze zasady</p>
              <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#f4f9ed]/70">
                {highlights.map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7DB122]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-20">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Oferta</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-950">Dostępne pakiety</h2>
          </div>
          <Link
            href="/konfigurator"
            className="rounded-md bg-[#6f9f1f] px-6 py-3 text-center text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]"
          >
            Otwórz konfigurator
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {packages.map(pkg => (
            <article
              key={pkg.id}
              className={`flex min-h-full flex-col rounded-lg border p-6 shadow-sm ${
                pkg.popular
                  ? 'border-[#7DB122] bg-[#102018] text-white shadow-[#102018]/10'
                  : 'border-[#102018]/10 bg-white text-gray-950'
              }`}
            >
              {pkg.popular && (
                <p className="mb-3 w-fit rounded-md bg-[#7DB122]/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#dff2b8]">
                  Najczęstszy wybór
                </p>
              )}
              <h3 className="text-2xl font-black tracking-tight">{pkg.name}</h3>
              <p className={`mt-3 text-sm leading-6 ${pkg.popular ? 'text-[#f4f9ed]/70' : 'text-gray-600'}`}>
                {pkg.description}
              </p>

              <div className="mt-6">
                <p className={`text-sm font-bold ${pkg.popular ? 'text-[#f4f9ed]/60' : 'text-gray-500'}`}>Od</p>
                <p className="text-5xl font-black tracking-tight">
                  {pkg.prices['24']}
                  <span className={`text-base font-bold ${pkg.popular ? 'text-[#f4f9ed]/60' : 'text-gray-500'}`}> zł/mies.</span>
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm font-semibold">
                {pkg.includes.slice(0, 5).map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#7DB122]">✓</span>
                    <span className={pkg.popular ? 'text-[#f4f9ed]/80' : 'text-gray-700'}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/konfigurator?package=${pkg.id}`}
                className={`mt-7 rounded-md px-5 py-3 text-center text-sm font-black uppercase transition-colors ${
                  pkg.popular
                    ? 'bg-[#6f9f1f] text-white hover:bg-[#5f8818]'
                    : 'bg-[#eef8dd] text-[#4f7414] hover:bg-[#dff2b8]'
                }`}
              >
                Skonfiguruj ten pakiet
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Co dalej?</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                Finalna cena zależy od sprzętu, okresu i dodatków.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Dlatego pakiety są opisem bazowym. W konfiguratorze wybierzesz konkretny model, dodatkowe wyposażenie oraz usługi, a formularz wyśle do nas gotowe podsumowanie.
              </p>
            </div>
            <Link
              href="/konfigurator"
              className="rounded-md border border-[#102018]/15 bg-white px-6 py-4 text-center text-sm font-black uppercase text-gray-950 transition-colors hover:border-[#7DB122]/60 hover:text-[#5f8818]"
            >
              Przejdź do konfiguratora
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

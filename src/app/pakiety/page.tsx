'use client'
import { useState } from 'react'
import Link from 'next/link'
import { packages, periods, type PeriodKey } from '@/data/packages'
import { softwareAddons } from '@/data/software'

export default function PakietyPage() {
  const [selectedPackage, setSelectedPackage] = useState(packages[1].id)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('12')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [withBuyout, setWithBuyout] = useState(false)

  const pkg = packages.find(p => p.id === selectedPackage)!
  const basePrice = pkg.prices[selectedPeriod]
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    return sum + (softwareAddons.find(a => a.id === id)?.price ?? 0)
  }, 0)
  const buyoutMonthly = withBuyout
    ? Math.ceil(pkg.buyoutPrices[selectedPeriod] / Number(selectedPeriod))
    : 0
  const totalMonthly = basePrice + addonsTotal + buyoutMonthly
  const totalContract = totalMonthly * Number(selectedPeriod)
  const periodLabel = periods.find(p => p.key === selectedPeriod)?.label ?? ''

  const selectedAddonItems = selectedAddons
    .map(id => softwareAddons.find(a => a.id === id))
    .filter(Boolean) as typeof softwareAddons

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )

  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-14 text-white sm:px-6 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Konfigurator</p>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Pakiety i cennik</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75">
                Wybierz zestaw, okres abonamentu i dodatki. Podsumowanie ceny aktualizuje się od razu, więc możesz spokojnie porównać warianty.
              </p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-bold text-[#f4f9ed]/65">Najczęstszy wybór</p>
              <p className="mt-1 text-2xl font-black">Laptop + monitor</p>
              <p className="mt-2 text-sm leading-6 text-[#f4f9ed]/70">Komfort większego ekranu i mobilność laptopa w jednej miesięcznej racie.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:py-14">
        <div className="space-y-5">
          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 1</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Wybierz pakiet sprzętu</h2>
              </div>
              <p className="hidden text-sm font-semibold text-gray-500 sm:block">Sprzęt dostarczamy za 1 zł</p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {packages.map(p => {
                const active = selectedPackage === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPackage(p.id)}
                    className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                      active
                        ? 'border-[#7DB122] bg-[#eef8dd] shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-4 rounded-md bg-[#6f9f1f] px-3 py-1 text-xs font-black uppercase text-white">
                        Popularny
                      </span>
                    )}
                    <p className="text-lg font-black tracking-tight text-gray-950">{p.name}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{p.description}</p>
                    <p className="mt-5 text-3xl font-black text-[#5f8818]">
                      {p.prices['24']}<span className="text-sm font-bold text-gray-500"> zł/mies.</span>
                    </p>
                    <div className="mt-4 space-y-2">
                      {p.includes.slice(0, 3).map(item => (
                        <p key={item} className="flex gap-2 text-xs font-semibold text-gray-600">
                          <span className="text-[#6f9f1f]">✓</span>
                          {item}
                        </p>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 2</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Okres abonamentu</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {periods.map(p => {
                const active = selectedPeriod === p.key
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setSelectedPeriod(p.key)}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      active
                        ? 'border-[#7DB122] bg-[#eef8dd]'
                        : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
                    }`}
                  >
                    <p className="font-black text-gray-950">{p.label}</p>
                    <p className="mt-2 text-3xl font-black text-[#5f8818]">
                      {pkg.prices[p.key]}<span className="text-sm font-bold text-gray-500"> zł</span>
                    </p>
                    <p className="mt-1 min-h-5 text-xs font-black text-[#6f9f1f]">{p.discount}</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 3</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Oprogramowanie i usługi</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {softwareAddons.map(addon => {
                const active = selectedAddons.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      active
                        ? 'border-[#7DB122] bg-[#eef8dd]'
                        : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                            active ? 'border-[#6f9f1f] bg-[#6f9f1f] text-white' : 'border-gray-300 text-transparent'
                          }`}>
                            ✓
                          </span>
                          <p className="font-black text-gray-950">{addon.name}</p>
                        </div>
                        <p className="mt-2 pl-7 text-sm leading-6 text-gray-500">{addon.description}</p>
                        {addon.recommendedFor && (
                          <span className="ml-7 mt-3 inline-block rounded-md bg-[#eef8dd] px-2.5 py-1 text-xs font-black text-[#5f8818]">
                            {addon.recommendedFor}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-black text-[#5f8818]">+{addon.price}</p>
                        <p className="text-xs font-semibold text-gray-400">zł/mies.</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 4</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Opcja wykupu sprzętu</h2>
            <button
              type="button"
              onClick={() => setWithBuyout(!withBuyout)}
              className={`mt-5 w-full rounded-lg border-2 p-5 text-left transition-all ${
                withBuyout
                  ? 'border-[#7DB122] bg-[#eef8dd]'
                  : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                  withBuyout ? 'border-[#6f9f1f] bg-[#6f9f1f] text-white' : 'border-gray-300 text-transparent'
                }`}>
                  ✓
                </span>
                <div>
                  <p className="font-black text-gray-950">Chcę wykupić sprzęt po zakończeniu abonamentu</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Koszt wykupu: <strong>{pkg.buyoutPrices[selectedPeriod].toLocaleString('pl-PL')} zł</strong>, rozłożony na raty: <strong>+{buyoutMonthly} zł/mies.</strong>
                  </p>
                </div>
              </div>
            </button>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-white/12 bg-[#102018] text-white shadow-2xl shadow-[#102018]/15">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#dff2b8]">Podsumowanie</p>
              <p className="mt-4 text-sm font-semibold text-[#f4f9ed]/60">Miesięczna rata</p>
              <p className="mt-1 text-6xl font-black leading-none text-[#dff2b8]">{totalMonthly}</p>
              <p className="mt-2 text-sm font-semibold text-[#f4f9ed]/60">zł / miesiąc przez {periodLabel}</p>
            </div>

            <div className="space-y-3 p-6 text-sm">
              <div className="flex justify-between gap-4 text-[#f4f9ed]/70">
                <span>{pkg.name}</span>
                <span className="font-black text-white">{basePrice} zł</span>
              </div>
              {selectedAddonItems.map(addon => (
                <div key={addon.id} className="flex justify-between gap-4 text-[#f4f9ed]/70">
                  <span>{addon.name}</span>
                  <span className="font-black text-white">+{addon.price} zł</span>
                </div>
              ))}
              {withBuyout && (
                <div className="flex justify-between gap-4 text-[#f4f9ed]/70">
                  <span>Wykup sprzętu</span>
                  <span className="font-black text-white">+{buyoutMonthly} zł</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between gap-4 font-black">
                  <span>Suma za {selectedPeriod} mies.</span>
                  <span className="text-[#dff2b8]">{totalContract.toLocaleString('pl-PL')} zł</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="mb-4 rounded-lg border border-[#7DB122]/25 bg-[#7DB122]/10 p-4 text-center">
                <p className="font-black text-[#dff2b8]">Sprzęt dostarczamy za 1 zł</p>
                <p className="mt-1 text-xs font-semibold text-[#f4f9ed]/55">Dostawa i konfiguracja w cenie</p>
              </div>
              <Link
                href={`/kontakt?package=${selectedPackage}&period=${selectedPeriod}`}
                className="block rounded-md bg-[#6f9f1f] px-6 py-4 text-center text-base font-black text-white transition-colors hover:bg-[#5f8818]"
              >
                Zamów ten pakiet
              </Link>
              <p className="mt-3 text-center text-xs font-semibold text-[#f4f9ed]/50">Odpowiadamy w ciągu 24 godzin</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

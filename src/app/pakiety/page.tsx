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

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-500 text-sm font-bold uppercase tracking-widest mb-4">Konfiguracja</p>
          <h1 className="text-5xl font-black tracking-tight mb-3">Pakiety i cennik</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Wybierz sprzęt, dodaj oprogramowanie i sprawdź swoją miesięczną ratę w czasie rzeczywistym.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: configurator */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Package */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 1</p>
            <h2 className="text-xl font-black mb-5">Wybierz pakiet sprzętu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {packages.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPackage(p.id)}
                  className={`relative text-left p-4 border-2 transition-all ${
                    selectedPackage === p.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5">
                      Popularny
                    </span>
                  )}
                  <p className="font-bold text-sm mb-3">{p.name}</p>
                  <p className="text-green-700 font-black text-xl">
                    od {p.prices['24']}<span className="text-xs font-normal text-gray-400"> zł/mies.</span>
                  </p>
                  <ul className="mt-3 space-y-1">
                    {p.includes.slice(0, 3).map(item => (
                      <li key={item} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-green-600 font-bold mt-0.5">+</span>{item}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Period */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 2</p>
            <h2 className="text-xl font-black mb-5">Okres abonamentu</h2>
            <div className="grid grid-cols-3 gap-3">
              {periods.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPeriod(p.key)}
                  className={`p-4 border-2 text-center transition-all ${
                    selectedPeriod === p.key
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <p className="font-bold text-sm">{p.label}</p>
                  <p className="text-green-700 font-black text-2xl mt-1">
                    {pkg.prices[p.key]}<span className="text-xs font-normal text-gray-400"> zł</span>
                  </p>
                  {p.discount && (
                    <p className="text-green-600 text-xs font-bold mt-1">{p.discount}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Software */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 3</p>
            <h2 className="text-xl font-black mb-5">Oprogramowanie i usługi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {softwareAddons.map(addon => {
                const active = selectedAddons.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`text-left p-4 border-2 transition-all ${
                      active ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                            active ? 'bg-green-600 border-green-600' : 'border-gray-300'
                          }`}>
                            {active && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <p className="font-bold text-sm">{addon.name}</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pl-6">{addon.description}</p>
                        {addon.recommendedFor && (
                          <span className="ml-6 mt-1.5 inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 font-semibold">
                            {addon.recommendedFor}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-green-700 font-black">+{addon.price}</p>
                        <p className="text-xs text-gray-400">zł/mies.</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Buyout */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 4</p>
            <h2 className="text-xl font-black mb-5">Opcja wykupu sprzętu</h2>
            <button
              onClick={() => setWithBuyout(!withBuyout)}
              className={`w-full text-left p-5 border-2 transition-all ${
                withBuyout ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                  withBuyout ? 'bg-green-600 border-green-600' : 'border-gray-300'
                }`}>
                  {withBuyout && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">Chcę wykupić sprzęt po zakończeniu abonamentu</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Koszt wykupu: <strong>{pkg.buyoutPrices[selectedPeriod].toLocaleString('pl-PL')} zł</strong> — rozłożony na raty: <strong>+{buyoutMonthly} zł/mies.</strong>
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Summary sticky */}
        <div className="lg:col-span-1">
          <div className="bg-gray-950 text-white sticky top-20 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-4">Podsumowanie</p>

            <div className="border-b border-gray-800 pb-5 mb-5">
              <p className="text-gray-500 text-sm mb-1">Miesięczna rata</p>
              <p className="text-6xl font-black text-green-500 leading-none">{totalMonthly}</p>
              <p className="text-gray-500 mt-1">zł / miesiąc przez {periodLabel}</p>
            </div>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-gray-400">
                <span>{pkg.name}</span>
                <span className="text-white font-semibold">{basePrice} zł</span>
              </div>
              {selectedAddons.map(id => {
                const addon = softwareAddons.find(a => a.id === id)!
                return (
                  <div key={id} className="flex justify-between text-gray-400">
                    <span>{addon.name}</span>
                    <span className="text-white font-semibold">+{addon.price} zł</span>
                  </div>
                )
              })}
              {withBuyout && (
                <div className="flex justify-between text-gray-400">
                  <span>Wykup sprzętu (raty)</span>
                  <span className="text-white font-semibold">+{buyoutMonthly} zł</span>
                </div>
              )}
              <div className="border-t border-gray-800 pt-2 flex justify-between font-bold">
                <span className="text-gray-300">Suma za {selectedPeriod} mies.</span>
                <span className="text-green-400">{totalContract.toLocaleString('pl-PL')} zł</span>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-600/30 p-3 mb-5 text-center">
              <p className="text-green-400 text-sm font-bold">Sprzęt dostarczamy za 1 zł</p>
              <p className="text-gray-500 text-xs mt-0.5">Dostawa i konfiguracja w cenie</p>
            </div>

            <Link
              href={`/kontakt?package=${selectedPackage}&period=${selectedPeriod}`}
              className="block w-full bg-green-600 text-white text-center font-bold py-4 text-base hover:bg-green-700 transition-colors"
            >
              Zamów ten pakiet
            </Link>
            <p className="text-center text-xs text-gray-400 mt-3">Odpowiadamy w ciągu 24 godzin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

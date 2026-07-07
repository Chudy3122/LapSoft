'use client'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { equipment, type Equipment } from '@/data/equipment'
import { applyInventory, type InventoryMap } from '@/lib/inventory'
import { packages, periods, type PeriodKey } from '@/data/packages'
import { softwareAddons } from '@/data/software'

type EquipmentCategory = Equipment['category']

const equipmentCategoryLabels: Record<EquipmentCategory, string> = {
  laptop: 'Laptop',
  pc: 'Komputer PC',
  monitor: 'Monitor',
  biurko: 'Biurko',
  krzeslo: 'Krzesło',
}

const packageEquipmentCategories: Record<string, EquipmentCategory[]> = {
  laptop: ['laptop'],
  'laptop-monitor': ['laptop', 'monitor'],
  'pc-monitor': ['pc', 'monitor'],
}

const defaultEquipmentByCategory: Record<EquipmentCategory, string> = {
  laptop: equipment.find(item => item.category === 'laptop')?.id ?? '',
  pc: equipment.find(item => item.category === 'pc')?.id ?? '',
  monitor: equipment.find(item => item.category === 'monitor')?.id ?? '',
  biurko: equipment.find(item => item.category === 'biurko')?.id ?? '',
  krzeslo: equipment.find(item => item.category === 'krzeslo')?.id ?? '',
}

export default function PakietyPage() {
  const [selectedPackage, setSelectedPackage] = useState(packages[1].id)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('12')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [selectedEquipmentByCategory, setSelectedEquipmentByCategory] = useState<Record<EquipmentCategory, string>>(defaultEquipmentByCategory)
  const [withBuyout, setWithBuyout] = useState(false)
  const [inventory, setInventory] = useState<InventoryMap | null>(null)

  // Aktualne dostępności z Google Sheets
  useEffect(() => {
    let ignore = false
    fetch('/api/inventory')
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (!ignore) setInventory(data) })
      .catch(() => {})
    return () => { ignore = true }
  }, [])

  const liveEquipment = useMemo(() => applyInventory(equipment, inventory), [inventory])

  const pkg = packages.find(p => p.id === selectedPackage)!
  const requiredEquipmentCategories = packageEquipmentCategories[selectedPackage] ?? []
  const selectedEquipmentItems = requiredEquipmentCategories
    .map(category => equipment.find(item => item.id === selectedEquipmentByCategory[category]))
    .filter(Boolean) as Equipment[]
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

  const contactQuery = new URLSearchParams({
    package: selectedPackage,
    period: selectedPeriod,
  })

  selectedEquipmentItems.forEach(item => {
    contactQuery.append('equipment', item.id)
  })

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
            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Wybierz konkretny sprzęt</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Na razie cena pakietu jest taka sama niezależnie od modelu. Później możemy przypisać osobne ceny do konkretnych urządzeń.
            </p>

            <div className="mt-5 space-y-5">
              {requiredEquipmentCategories.map(category => {
                const categoryEquipment = liveEquipment.filter(item => item.category === category)

                return (
                  <div key={category}>
                    <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">
                      {equipmentCategoryLabels[category]}
                    </p>
                    <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {categoryEquipment.map(item => {
                        const active = selectedEquipmentByCategory[category] === item.id

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setSelectedEquipmentByCategory(prev => ({
                                ...prev,
                                [category]: item.id,
                              }))
                            }
                            className={`flex h-full min-h-[292px] flex-col overflow-hidden rounded-lg border-2 text-left transition-colors ${
                              active
                                ? 'border-[#7DB122] bg-[#eef8dd]'
                                : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
                            }`}
                          >
                            <div className="relative flex h-40 shrink-0 items-center justify-center bg-white">
                              <Image
                                src={item.cardImage}
                                alt={`${item.brand} ${item.model}`}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1280px) 40vw, 220px"
                                unoptimized
                                className="object-contain p-5"
                              />
                            </div>
                            <div className="flex min-h-[132px] flex-1 flex-col p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{item.brand}</p>
                                  <p className="mt-1 text-lg font-black leading-tight tracking-tight text-gray-950">{item.model}</p>
                                </div>
                                <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                                  active ? 'border-[#6f9f1f] bg-[#6f9f1f] text-white' : 'border-gray-300 text-transparent'
                                }`}>
                                  ✓
                                </span>
                              </div>
                              <p className="mt-auto pt-3 text-xs font-bold text-gray-500">{item.units} szt. dostępne</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 3</p>
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
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 4</p>
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
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Krok 5</p>
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
              <p className="text-xs font-black uppercase tracking-widest text-[#dff2b8]">Wstępna kalkulacja</p>
              <p className="mt-4 text-sm font-semibold text-[#f4f9ed]/60">Miesięczna rata</p>
              <p className="mt-1 text-6xl font-black leading-none text-[#dff2b8]">{totalMonthly}</p>
              <p className="mt-2 text-sm font-semibold text-[#f4f9ed]/60">zł / miesiąc przez {periodLabel}</p>
            </div>

            <div className="space-y-3 p-6 text-sm">
              <div className="flex justify-between gap-4 text-[#f4f9ed]/70">
                <span>{pkg.name}</span>
                <span className="font-black text-white">{basePrice} zł</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#dff2b8]">Wybrany sprzęt</p>
                <div className="space-y-1.5">
                  {selectedEquipmentItems.map(item => (
                    <div key={item.id} className="flex justify-between gap-4 text-[#f4f9ed]/70">
                      <span>{equipmentCategoryLabels[item.category]}</span>
                      <span className="text-right font-black text-white">{item.brand} {item.model}</span>
                    </div>
                  ))}
                </div>
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
              <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="font-black text-white">To jeszcze nie jest zamówienie.</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#f4f9ed]/55">
                  Wyślesz zapytanie z wybraną konfiguracją. Po rozmowie możesz ją zmienić albo zrezygnować bez zobowiązań.
                </p>
              </div>
              <Link
                href={`/kontakt?${contactQuery.toString()}`}
                className="block rounded-md bg-[#6f9f1f] px-6 py-4 text-center text-base font-black text-white transition-colors hover:bg-[#5f8818]"
              >
                Poproś o ofertę bez zobowiązań
              </Link>
              <p className="mt-3 text-center text-xs font-semibold text-[#f4f9ed]/50">Odpowiadamy w ciągu 24 godzin</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

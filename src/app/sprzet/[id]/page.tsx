import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { equipment } from '@/data/equipment'
import { getInventory } from '@/lib/inventory'

type EquipmentDetailsPageProps = {
  params: Promise<{ id: string }>
}

const categoryLabels = {
  laptop: 'Laptop',
  pc: 'Komputer PC',
  monitor: 'Monitor',
  biurko: 'Biurko',
  krzeslo: 'Krzesło',
} as const

function getEquipment(id: string) {
  return equipment.find(item => item.id === id)
}

export function generateStaticParams() {
  return equipment.map(item => ({ id: item.id }))
}

export async function generateMetadata({
  params,
}: EquipmentDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const item = getEquipment(id)

  if (!item) {
    return {
      title: 'Sprzęt nie znaleziony — LapSoft',
    }
  }

  return {
    title: `${item.brand} ${item.model} — LapSoft`,
    description: item.description,
  }
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params
  const item = getEquipment(id)

  if (!item) {
    notFound()
  }

  // Aktualna dostępność z Google Sheets (z fallbackiem na wartość statyczną)
  const inventory = await getInventory()
  const units = inventory[item.id]?.units ?? item.units
  const isAvailable = units > 0

  const otherEquipment = equipment
    .filter(equipmentItem => equipmentItem.id !== item.id)
    .slice(0, 3)

  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-12 text-white sm:px-6 lg:py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />

        <div className="mx-auto max-w-6xl">
          <Link
            href="/sprzet"
            className="inline-flex rounded-md border border-white/15 px-4 py-2 text-sm font-black uppercase text-[#dff2b8] transition-colors hover:bg-white/8"
          >
            Wróć do sprzętu
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white">
              <Image
                src={item.image}
                alt={`${item.brand} ${item.model}`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                unoptimized
                className="object-contain p-8"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#dff2b8]">
                {categoryLabels[item.category]}
              </p>
              <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
                {item.brand} {item.model}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75">
                {item.description}
              </p>

              <div className="mt-7 grid max-w-xl grid-cols-2 overflow-hidden rounded-lg border border-white/12 bg-white/8">
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#f4f9ed]/55">Dostępność</p>
                  <p className="mt-1 text-3xl font-black text-[#dff2b8]">{units} szt.</p>
                </div>
                <div className="border-l border-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#f4f9ed]/55">Status</p>
                  <p className={`mt-1 text-3xl font-black ${isAvailable ? 'text-[#dff2b8]' : 'text-gray-400'}`}>
                    {isAvailable ? 'Dostępny' : 'Niedostępny'}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="rounded-md bg-[#6f9f1f] px-6 py-3 text-sm font-black uppercase text-white shadow-sm shadow-[#102018]/20 transition-colors hover:bg-[#5f8818]"
                >
                  Zapytaj o ten sprzęt
                </Link>
                <Link
                  href="/pakiety"
                  className="rounded-md border border-white/20 px-6 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-white/8"
                >
                  Zobacz pakiety
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm md:p-8">
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Specyfikacja</p>
            <h2 className="text-3xl font-black tracking-tight text-gray-950">Najważniejsze parametry</h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {item.specs.map(spec => (
                <div key={spec.label} className="rounded-md border border-[#102018]/8 bg-[#f6f8f5] px-4 py-3">
                  <p className="text-xs font-bold uppercase text-gray-400">{spec.label}</p>
                  <p className="mt-1 text-base font-black text-gray-800">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm md:p-8">
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Wynajem</p>
            <h2 className="text-3xl font-black tracking-tight text-gray-950">Co dalej?</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Możemy dobrać okres abonamentu, dodatki i konfigurację pod konkretny sposób pracy. Sam kontakt nie oznacza podpisania umowy ani zamówienia.
            </p>
            <Link
              href="/kontakt"
              className="mt-6 block rounded-md bg-[#6f9f1f] px-6 py-3 text-center text-sm font-black uppercase text-white transition-colors hover:bg-[#5f8818]"
            >
              Skontaktuj się
            </Link>
          </aside>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#5f8818]">Inne modele</p>
              <h2 className="text-3xl font-black tracking-tight text-gray-950">Zobacz też</h2>
            </div>
            <Link href="/sprzet" className="hidden text-sm font-black uppercase text-[#5f8818] hover:text-[#102018] sm:block">
              Cały katalog
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {otherEquipment.map(equipmentItem => (
              <Link
                key={equipmentItem.id}
                href={`/sprzet/${equipmentItem.id}`}
                className="overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-sm transition-colors hover:border-[#7DB122]/70"
              >
                <div className="relative flex h-40 items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#eef8dd_46%,#e6ece5_100%)]">
                  <Image
                    src={equipmentItem.cardImage}
                    alt={`${equipmentItem.brand} ${equipmentItem.model}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 260px"
                    unoptimized
                    className="object-contain p-5"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{equipmentItem.brand}</p>
                  <h3 className="mt-1 text-xl font-black tracking-tight text-gray-950">{equipmentItem.model}</h3>
                  <p className="mt-2 text-sm font-bold text-gray-500">{equipmentItem.units} szt. dostępne</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}

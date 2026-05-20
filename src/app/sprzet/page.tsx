'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { equipment, type Equipment } from '@/data/equipment'

type Category = 'all' | 'laptop' | 'pc' | 'monitor'

const categoryLabels: Record<Category, string> = {
  all: 'Wszystkie',
  laptop: 'Laptopy',
  pc: 'Komputery PC',
  monitor: 'Monitory',
}

const categoryCounts: Record<Category, number> = {
  all: equipment.length,
  laptop: equipment.filter(item => item.category === 'laptop').length,
  pc: equipment.filter(item => item.category === 'pc').length,
  monitor: equipment.filter(item => item.category === 'monitor').length,
}

function EquipmentCard({ item }: { item: Equipment }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article className="group overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#7DB122]/70 hover:shadow-xl hover:shadow-[#102018]/8">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#eef8dd_46%,#e6ece5_100%)]">
        {!imgError ? (
          <div className="relative h-48 w-72 max-w-[82%]">
            <Image
              src={item.image}
              alt={`${item.brand} ${item.model}`}
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 38vw, 290px"
              className="object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <svg className="mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-semibold">Zdjęcie wkrótce</p>
          </div>
        )}
        <span className="absolute right-4 top-4 rounded-md bg-[#6f9f1f] px-3 py-1 text-xs font-black uppercase text-white">
          Dostępny
        </span>
        <span className="absolute left-4 top-4 rounded-md bg-white/85 px-3 py-1 text-xs font-black uppercase text-[#5f8818] shadow-sm">
          {item.units} szt.
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">{item.brand}</p>
        <h3 className="mt-1 text-2xl font-black tracking-tight text-gray-950">{item.model}</h3>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">{item.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {item.specs.slice(0, 4).map(spec => (
            <div key={spec.label} className="rounded-md border border-[#102018]/8 bg-[#f6f8f5] px-3 py-2">
              <p className="text-xs font-bold text-gray-400">{spec.label}</p>
              <p className="mt-0.5 text-sm font-black text-gray-800">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function SprzętPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? equipment
    : equipment.filter(e => e.category === activeCategory)

  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-14 text-white sm:px-6 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Katalog sprzętu</p>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Dostępny sprzęt</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75">
              Zobacz modele, które możesz wynająć w abonamencie. Wszystkie urządzenia przechodzą kontrolę jakości przed wysyłką.
            </p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/12 bg-white/8 backdrop-blur">
            {[
              ['45+', 'laptopów'],
              ['10+', 'PC'],
              ['20+', 'monitorów'],
            ].map(([num, label]) => (
              <div key={label} className="border-l border-white/10 p-4 first:border-l-0">
                <p className="text-3xl font-black text-[#dff2b8]">{num}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#f4f9ed]/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex flex-wrap gap-2">
          {(Object.keys(categoryLabels) as Category[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md border px-4 py-2 text-sm font-black uppercase transition-all ${
                activeCategory === cat
                  ? 'border-[#6f9f1f] bg-[#6f9f1f] text-white'
                  : 'border-[#102018]/12 bg-white text-gray-600 hover:border-[#7DB122]/70 hover:text-gray-950'
              }`}
            >
              {categoryLabels[cat]} <span className="opacity-70">({categoryCounts[cat]})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>

        <section className="mt-14 overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-xl shadow-[#102018]/5">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.55fr]">
            <div className="p-8 md:p-10">
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Dobór sprzętu</p>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight text-gray-950">Nie wiesz, który model wybrać?</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-gray-600">
                Opisz, do czego potrzebujesz komputera. Dobierzemy zestaw, okres abonamentu i dodatki bez technicznego chaosu.
              </p>
            </div>
            <div className="flex items-center bg-[#eef8dd] p-8 md:p-10">
              <Link
                href="/kontakt"
                className="w-full rounded-md bg-[#6f9f1f] px-7 py-4 text-center text-base font-black text-white transition-colors hover:bg-[#5f8818]"
              >
                Skontaktuj się
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

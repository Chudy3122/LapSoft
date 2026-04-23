'use client'
import { useState } from 'react'
import Image from 'next/image'
import { equipment, type Equipment } from '@/data/equipment'

type Category = 'all' | 'laptop' | 'pc' | 'monitor'

const categoryLabels: Record<Category, string> = {
  all: 'Wszystkie',
  laptop: 'Laptopy',
  pc: 'Komputery PC',
  monitor: 'Monitory',
}

function EquipmentCard({ item }: { item: Equipment }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-white border border-gray-200 overflow-hidden group hover:border-green-600 transition-colors">
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <Image
            src={item.image}
            alt={`${item.brand} ${item.model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-medium">Zdjęcie wkrótce</p>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5">
          Dostępny
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">{item.brand}</p>
        <h3 className="text-lg font-black mb-2 tracking-tight">{item.model}</h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>

        <div className="grid grid-cols-2 gap-1.5">
          {item.specs.map(spec => (
            <div key={spec.label} className="bg-gray-50 border border-gray-100 px-3 py-2">
              <p className="text-xs text-gray-400 font-medium">{spec.label}</p>
              <p className="text-sm font-bold text-gray-800">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SprzętPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? equipment
    : equipment.filter(e => e.category === activeCategory)

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-500 text-sm font-bold uppercase tracking-widest mb-4">Katalog</p>
          <h1 className="text-5xl font-black tracking-tight mb-3">Dostępny sprzęt</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Wszystkie modele są nowe lub odnowione fabrycznie. Każde urządzenie przechodzi kontrolę jakości przed wysyłką.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-10">
          {[
            ['45+', 'laptopów w magazynie'],
            ['10+', 'komputerów stacjonarnych'],
            ['20+', 'monitorów dostępnych'],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-green-600">{num}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(categoryLabels) as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Photo upload hint */}
        <div className="bg-amber-50 border border-amber-200 p-4 mb-8 text-sm text-amber-700 flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="font-bold">Zdjęcia sprzętu</p>
            <p>Wgraj zdjęcia do folderu <code className="bg-amber-100 px-1">public/images/sprzet/</code> — nazwy plików znajdziesz w pliku <code className="bg-amber-100 px-1">src/data/equipment.ts</code></p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gray-950 text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-xl mb-1">Nie wiesz który model wybrać?</h3>
            <p className="text-gray-400 text-sm">Dobierzemy sprzęt idealnie dopasowany do Twoich potrzeb.</p>
          </div>
          <a
            href="/kontakt"
            className="shrink-0 bg-green-600 text-white font-bold px-6 py-3 text-sm hover:bg-green-700 transition-colors"
          >
            Skontaktuj się
          </a>
        </div>
      </div>
    </div>
  )
}

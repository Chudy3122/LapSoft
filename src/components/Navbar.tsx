'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Start' },
  { href: '/pakiety', label: 'Pakiety' },
  { href: '/sprzet', label: 'Sprzęt' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight text-gray-900">Lap</span>
          <span className="text-2xl font-black tracking-tight text-green-600">Soft</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === l.href
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="bg-green-600 text-white px-5 py-2 text-sm font-bold hover:bg-green-700 transition-colors"
          >
            Zapytaj o ofertę
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-base font-semibold border-b border-gray-100 ${
                pathname === l.href ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center bg-green-600 text-white px-5 py-3 font-bold text-base"
          >
            Zapytaj o ofertę
          </Link>
        </div>
      )}
    </nav>
  )
}

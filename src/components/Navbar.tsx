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
  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#102018]/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="LapSoft - strona główna">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white shadow-sm shadow-[#102018]/15">
            LS
          </span>
          <span className="leading-none">
            <span className="block text-xl font-black tracking-tight text-gray-950">LapSoft</span>
            <span className="mt-1 hidden text-xs font-semibold text-gray-500 sm:block">wynajem sprzętu IT</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-bold uppercase transition-colors ${
                isActive(l.href)
                  ? 'bg-[#eef8dd] text-[#4f7414]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="ml-3 rounded-md bg-[#6f9f1f] px-5 py-2.5 text-sm font-black uppercase text-white shadow-sm shadow-[#102018]/15 transition-colors hover:bg-[#5f8818]"
          >
            Zapytaj o ofertę
          </Link>
        </div>

        <button
          className="rounded-md border border-gray-200 p-2 text-gray-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <div className="mb-1.5 h-0.5 w-5 bg-gray-700" />
          <div className="mb-1.5 h-0.5 w-5 bg-gray-700" />
          <div className="h-0.5 w-5 bg-gray-700" />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-5 pb-5 pt-2 md:hidden">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-3 text-base font-bold uppercase ${
                isActive(l.href) ? 'bg-[#eef8dd] text-[#4f7414]' : 'text-gray-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-md bg-[#6f9f1f] px-5 py-3 text-center text-base font-black uppercase text-white"
          >
            Zapytaj o ofertę
          </Link>
        </div>
      )}
    </nav>
  )
}

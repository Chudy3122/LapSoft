'use client'
import Image from 'next/image'
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
        <Link href="/" className="flex items-center" aria-label="LapSoft - strona główna">
          <Image
            src="/images/logo/logo-lapsoft-header.png"
            alt="LapSoft"
            width={771}
            height={213}
            priority
            unoptimized
            className="h-10 w-auto object-contain sm:h-11"
          />
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
            href="/pakiety"
            className="ml-3 rounded-md bg-[#6f9f1f] px-5 py-2.5 text-sm font-black uppercase text-white shadow-sm shadow-[#102018]/15 transition-colors hover:bg-[#5f8818]"
          >
            Konfigurator
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
            href="/pakiety"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-md bg-[#6f9f1f] px-5 py-3 text-center text-base font-black uppercase text-white"
          >
            Konfigurator
          </Link>
        </div>
      )}
    </nav>
  )
}

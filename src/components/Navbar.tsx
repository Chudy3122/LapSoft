'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { logout } from '@/app/actions/auth'

const links = [
  { href: '/', label: 'Start' },
  { href: '/pakiety', label: 'Pakiety' },
  { href: '/sprzet', label: 'Sprzęt' },
  { href: '/kontakt', label: 'Kontakt' },
]

type NavUser = { name: string; role: 'USER' | 'ADMIN' } | null

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname.startsWith(href)
  const configuratorActive = isActive('/konfigurator')
  const loginActive = isActive('/logowanie')
  const registerActive = isActive('/rejestracja')
  const accountActive = loginActive || registerActive || isActive('/panel-klienta') || isActive('/admin')
  const panelHref = user?.role === 'ADMIN' ? '/admin/dashboard' : '/panel-klienta'
  const firstName = user?.name?.split(' ')[0] ?? ''
  const openAccountMenu = () => {
    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
    setAccountOpen(true)
  }
  const closeAccountMenu = () => {
    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
    accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 180)
  }
  const toggleAccountMenu = () => {
    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
    setAccountOpen(prev => !prev)
  }

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

        <div className="hidden items-center md:flex">
          <div className="flex items-center gap-2">
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
              href="/konfigurator"
              className={`ml-1 rounded-md px-5 py-2.5 text-sm font-black uppercase text-white shadow-sm shadow-[#102018]/15 transition-colors ${
                configuratorActive ? 'bg-[#102018]' : 'bg-[#6f9f1f] hover:bg-[#5f8818]'
              }`}
            >
              Konfigurator
            </Link>
          </div>

          <span className="mx-3 h-7 w-px bg-[#102018]/12" aria-hidden="true" />

          <div
            className="relative"
            onMouseEnter={openAccountMenu}
            onMouseLeave={closeAccountMenu}
          >
            <button
              type="button"
              onClick={toggleAccountMenu}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              aria-label={user ? `Konto: ${user.name}` : 'Menu konta'}
              className={`relative flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
                accountActive || accountOpen
                  ? 'border-[#6f9f1f] bg-[#eef8dd] text-[#4f7414]'
                  : 'border-[#102018]/15 bg-white text-[#102018] hover:border-[#6f9f1f] hover:bg-[#f6faef] hover:text-[#5f8818]'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              {user && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#6f9f1f]" aria-hidden="true" />
              )}
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-xl shadow-[#102018]/12" role="menu">
                {user && (
                  <div className="border-b border-[#102018]/8 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Konto</p>
                    <p className="mt-1 truncate text-sm font-black text-gray-950">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-500">
                      {user.role === 'ADMIN' ? 'Administrator' : 'Klient'}
                    </p>
                  </div>
                )}

                {user ? (
                  <div className="p-2">
                    <Link
                      href={panelHref}
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-[#f6faef] hover:text-[#5f8818]"
                    >
                      {user.role === 'ADMIN' ? 'Panel admina' : 'Panel klienta'}
                    </Link>
                    <Link
                      href={panelHref}
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-[#f6faef] hover:text-[#5f8818]"
                    >
                      {user.role === 'ADMIN' ? 'Zapytania klientów' : 'Moje zapytania'}
                    </Link>
                    {user.role === 'USER' && (
                      <Link
                        href="/konfigurator"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-[#f6faef] hover:text-[#5f8818]"
                      >
                        Nowe zapytanie
                      </Link>
                    )}
                    <form action={logout} className="mt-2 border-t border-[#102018]/8 pt-2">
                      <button
                        type="submit"
                        className="w-full rounded-md px-3 py-2.5 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                      >
                        Wyloguj się
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-2">
                    <Link
                      href="/logowanie"
                      onClick={() => setAccountOpen(false)}
                      className={`block rounded-md border px-3 py-2.5 text-center text-sm font-bold transition-colors ${
                        loginActive
                          ? 'border-[#6f9f1f] bg-[#eef8dd] text-[#4f7414]'
                          : 'border-[#102018]/12 bg-white text-gray-800 hover:border-[#6f9f1f]/45 hover:bg-[#f6faef] hover:text-[#4f7414]'
                      }`}
                    >
                      Zaloguj się
                    </Link>
                    <Link
                      href="/rejestracja"
                      onClick={() => setAccountOpen(false)}
                      className={`mt-1 block rounded-md border px-3 py-2.5 text-center text-sm font-black transition-colors ${
                        registerActive
                          ? 'border-[#6f9f1f] bg-[#eef8dd] text-[#4f7414]'
                          : 'border-[#6f9f1f]/25 bg-[#eef8dd] text-[#4f7414] hover:border-[#6f9f1f]/55 hover:bg-[#dff2b8]'
                      }`}
                    >
                      Załóż konto
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
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
            href="/konfigurator"
            onClick={() => setOpen(false)}
            className={`mt-3 block rounded-md px-5 py-3 text-center text-base font-black uppercase text-white ${
              configuratorActive ? 'bg-[#102018]' : 'bg-[#6f9f1f]'
            }`}
          >
            Konfigurator
          </Link>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-2 px-1 text-xs font-black uppercase tracking-widest text-gray-400">Konto</p>
            {user ? (
              <div className="space-y-2">
                <Link
                  href={panelHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#6f9f1f] bg-[#eef8dd] px-5 py-3 text-base font-black uppercase text-[#4f7414]"
                >
                  <UserIcon className="h-5 w-5" />
                  {user.role === 'ADMIN' ? 'Panel admina' : 'Mój panel'}
                </Link>
                {user.role === 'USER' && (
                  <Link
                    href="/konfigurator"
                    onClick={() => setOpen(false)}
                    className="block rounded-md border border-[#102018]/15 bg-white px-5 py-3 text-center text-sm font-bold uppercase text-[#102018]"
                  >
                    Nowe zapytanie
                  </Link>
                )}
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-md border border-[#102018]/15 bg-white px-5 py-3 text-base font-black uppercase text-gray-600 transition-colors hover:text-red-500"
                  >
                    Wyloguj ({firstName})
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/logowanie"
                  onClick={() => setOpen(false)}
                  className={`block rounded-md border px-5 py-3 text-center text-sm font-bold uppercase transition-colors ${
                    loginActive
                      ? 'border-[#6f9f1f] bg-[#eef8dd] text-[#4f7414]'
                      : 'border-[#102018]/15 bg-white text-[#102018]'
                  }`}
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/rejestracja"
                  onClick={() => setOpen(false)}
                  className={`block rounded-md border px-5 py-3 text-center text-sm font-bold uppercase ${
                    registerActive
                      ? 'border-[#6f9f1f] bg-[#eef8dd] text-[#4f7414]'
                      : 'border-[#102018]/15 bg-white text-[#102018]'
                  }`}
                >
                  Załóż konto
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

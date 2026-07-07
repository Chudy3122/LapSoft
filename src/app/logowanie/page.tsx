'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="relative isolate flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[#102018] px-5 py-12 text-white sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
      <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />

      <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/12 bg-white/10 shadow-2xl shadow-black/25 backdrop-blur">
        <div className="border-b border-white/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">LS</span>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">LapSoft</p>
              <p className="text-xs font-black uppercase tracking-widest text-[#f4f9ed]/45">Panel klienta</p>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Zaloguj się</h1>
          <p className="mt-2 text-sm text-[#f4f9ed]/60">Nie masz konta?{' '}
            <Link href="/rejestracja" className="font-black text-[#dff2b8] underline-offset-2 hover:underline">Zarejestruj się</Link>
          </p>
        </div>

        <form action={action} className="p-7">
          <label htmlFor="email" className="mb-2 block text-xs font-black uppercase tracking-widest text-[#dff2b8]">E-mail</label>
          <input
            id="email" name="email" type="email" autoComplete="email" required autoFocus
            placeholder="twoj@email.pl"
            className="mb-4 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-[#f4f9ed]/35 focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
          />

          <label htmlFor="password" className="mb-2 block text-xs font-black uppercase tracking-widest text-[#dff2b8]">Hasło</label>
          <input
            id="password" name="password" type="password" autoComplete="current-password" required
            placeholder="••••••••"
            className="mb-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-[#f4f9ed]/35 focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
          />

          {state?.message && <p className="mb-3 text-sm font-semibold text-red-300">{state.message}</p>}

          <button
            type="submit" disabled={pending}
            className="mt-3 w-full rounded-md bg-[#6f9f1f] py-3 text-base font-black text-white transition-colors hover:bg-[#5f8818] disabled:opacity-60"
          >
            {pending ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
      </div>
    </div>
  )
}

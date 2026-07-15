'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError(true)
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[#102018] px-5 py-12 text-white sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
      <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />

      <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/12 bg-white/10 shadow-2xl shadow-black/25 backdrop-blur">
        <div className="border-b border-white/10 p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">
              LS
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">LapSoft</p>
              <p className="text-xs font-black uppercase tracking-widest text-[#f4f9ed]/45">Panel admina</p>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Logowanie administratora</h1>
        </div>

        <form onSubmit={handleLogin} className="p-7">
          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#dff2b8]">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Wpisz hasło..."
            autoFocus
            className={`mb-3 w-full rounded-md border bg-white/10 px-4 py-3 text-base text-white placeholder:text-[#f4f9ed]/35 focus:outline-none focus:ring-2 focus:ring-[#7DB122] ${
              error ? 'border-red-400' : 'border-white/15'
            }`}
          />
          {error && <p className="mb-3 text-sm font-semibold text-red-300">Nieprawidłowe hasło</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#6f9f1f] py-3 text-base font-black text-white transition-colors hover:bg-[#5f8818] disabled:opacity-60"
          >
            {loading ? 'Sprawdzam...' : 'Zaloguj się'}
          </button>
        </form>
      </div>
    </div>
  )
}

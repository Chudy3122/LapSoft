'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_PASSWORD = 'lapsoft2024'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('lapsoft-admin', '1')
      router.push('/admin/dashboard')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-sm p-8">
        <div className="mb-8">
          <div className="text-2xl font-black tracking-tight mb-1">
            <span className="text-white">Lap</span><span className="text-green-500">Soft</span>
          </div>
          <p className="text-gray-500 text-sm">Panel Admina — zaloguj się</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Wpisz hasło..."
            autoFocus
            className={`w-full bg-gray-800 border px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-3 ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {error && <p className="text-red-400 text-sm mb-3">Nieprawidłowe hasło</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 hover:bg-green-700 transition-colors"
          >
            Zaloguj się
          </button>
        </form>

        <p className="text-center text-xs text-gray-700 mt-5">
          Hasło: <code className="text-gray-500">lapsoft2024</code>
        </p>
      </div>
    </div>
  )
}

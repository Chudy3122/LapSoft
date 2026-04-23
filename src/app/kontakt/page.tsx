'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { packages } from '@/data/packages'
import { softwareAddons } from '@/data/software'

function KontaktForm() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    packageId: searchParams.get('package') || 'laptop-monitor',
    period: searchParams.get('period') || '12',
    addons: [] as string[],
    buyout: false,
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const pkg = packages.find(p => p.id === form.packageId)
  const basePrice = pkg ? pkg.prices[form.period as '6' | '12' | '24'] : 0
  const addonsTotal = form.addons.reduce((sum, id) => sum + (softwareAddons.find(a => a.id === id)?.price ?? 0), 0)
  const total = basePrice + addonsTotal

  const set = (field: string, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleAddon = (id: string) =>
    set('addons', form.addons.includes(id) ? form.addons.filter(a => a !== id) : [...form.addons, id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, monthlyTotal: total }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto text-center py-24 px-6">
        <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black mb-3 tracking-tight">Dziękujemy!</h2>
        <p className="text-gray-500 text-lg mb-2">
          Skontaktujemy się z Tobą w ciągu <strong>24 godzin</strong>.
        </p>
        <p className="text-gray-400 mb-8">Sprawdź skrzynkę e-mail lub poczekaj na telefon.</p>
        <a href="/" className="bg-green-600 text-white font-bold px-8 py-4 text-base hover:bg-green-700 transition-colors inline-block">
          Wróć na stronę główną
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-12 space-y-6">

      {/* Personal data */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 1</p>
        <h2 className="text-xl font-black mb-5">Twoje dane kontaktowe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Imię i nazwisko', field: 'name', type: 'text', placeholder: 'np. Jan Kowalski', required: true },
            { label: 'Telefon', field: 'phone', type: 'tel', placeholder: 'np. 600 000 000', required: true },
            { label: 'Adres e-mail', field: 'email', type: 'email', placeholder: 'np. jan@example.com', required: false },
            { label: 'Wiek (opcjonalnie)', field: 'age', type: 'number', placeholder: 'np. 65', required: false },
          ].map(({ label, field, type, placeholder, required }) => (
            <div key={field}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                required={required}
                type={type}
                value={form[field as keyof typeof form] as string}
                onChange={e => set(field, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Package */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 2</p>
        <h2 className="text-xl font-black mb-5">Wybrany pakiet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {packages.map(p => (
            <label key={p.id} className="cursor-pointer">
              <input type="radio" name="package" value={p.id} checked={form.packageId === p.id}
                onChange={e => set('packageId', e.target.value)} className="sr-only" />
              <div className={`p-4 border-2 text-center transition-all ${
                form.packageId === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-400'
              }`}>
                <p className="font-bold text-sm">{p.name}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-sm font-bold text-gray-700 mb-2">Okres abonamentu</p>
        <div className="flex gap-3 flex-wrap">
          {[{ v: '6', l: '6 miesięcy' }, { v: '12', l: '12 miesięcy' }, { v: '24', l: '24 miesiące' }].map(p => (
            <label key={p.v} className="cursor-pointer">
              <input type="radio" name="period" value={p.v} checked={form.period === p.v}
                onChange={e => set('period', e.target.value)} className="sr-only" />
              <div className={`px-5 py-2.5 border-2 text-sm font-bold transition-all ${
                form.period === p.v ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>{p.l}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Addons */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Krok 3</p>
        <h2 className="text-xl font-black mb-5">Oprogramowanie (opcjonalnie)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {softwareAddons.map(addon => {
            const active = form.addons.includes(addon.id)
            return (
              <label key={addon.id} className={`cursor-pointer flex items-center gap-3 p-3 border-2 transition-all ${
                active ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-400'
              }`}>
                <input type="checkbox" className="sr-only" checked={active} onChange={() => toggleAddon(addon.id)} />
                <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                  active ? 'bg-green-600 border-green-600' : 'border-gray-300'
                }`}>
                  {active && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{addon.name}</p>
                </div>
                <span className="text-green-700 font-black text-sm shrink-0">+{addon.price} zł</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Buyout */}
      <div className="bg-white border border-gray-200 p-6">
        <label className="cursor-pointer flex items-center gap-4">
          <input type="checkbox" checked={form.buyout} onChange={e => set('buyout', e.target.checked)}
            className="w-4 h-4 accent-green-600" />
          <div>
            <p className="font-bold text-sm">Interesuje mnie wykup sprzętu po zakończeniu abonamentu</p>
            <p className="text-sm text-gray-500 mt-0.5">Omówimy szczegóły i cenę wykupu podczas rozmowy.</p>
          </div>
        </label>
      </div>

      {/* Message */}
      <div className="bg-white border border-gray-200 p-6">
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Dodatkowe informacje</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Napisz nam coś więcej o swoich potrzebach..."
          rows={4}
          className="w-full border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Summary + submit */}
      <div className="bg-gray-950 p-6 text-white">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-gray-500 text-sm">Szacowana miesięczna rata</p>
            <p className="text-5xl font-black text-green-500 leading-none mt-1">{total}<span className="text-xl text-gray-500 font-normal"> zł/mies.</span></p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Sprzęt za</p>
            <p className="text-3xl font-black text-white">1 zł</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-green-600 text-white font-bold py-4 text-base hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? 'Wysyłam...' : 'Wyślij zapytanie'}
        </button>
        {status === 'error' && (
          <p className="text-red-400 text-center mt-2 text-sm">Wystąpił błąd. Spróbuj ponownie lub zadzwoń do nas.</p>
        )}
        <p className="text-center text-gray-400 text-xs mt-3">Odpowiemy w ciągu 24 godzin</p>
      </div>
    </form>
  )
}

export default function KontaktPage() {
  return (
    <div>
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-500 text-sm font-bold uppercase tracking-widest mb-4">Kontakt</p>
          <h1 className="text-5xl font-black tracking-tight mb-3">Zapytaj o ofertę</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Wypełnij formularz, a skontaktujemy się z Tobą najszybciej jak to możliwe.
          </p>
          <p className="mt-4 text-gray-500 text-sm">
            Wolisz telefonicznie?&nbsp;
            <a href="tel:+48000000000" className="text-green-500 font-bold hover:text-green-400">+48 000 000 000</a>
            &nbsp;— Pon–Pt 8:00–17:00
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="py-20 text-center text-gray-400">Ładowanie...</div>}>
        <KontaktForm />
      </Suspense>
    </div>
  )
}

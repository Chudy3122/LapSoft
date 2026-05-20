'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { packages } from '@/data/packages'
import { softwareAddons } from '@/data/software'

const contactFlow = [
  ['01', 'Zostaw kontakt', 'Podaj telefon i podstawowe potrzeby. Resztę możemy doprecyzować podczas rozmowy.'],
  ['02', 'Dobieramy zestaw', 'Sprawdzimy, czy lepszy będzie laptop, monitor czy komputer stacjonarny.'],
  ['03', 'Potwierdzasz ofertę', 'Dostajesz propozycję miesięcznej raty i decydujesz, czy idziemy dalej.'],
]

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
      <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#6f9f1f] text-3xl font-black text-white">
          ✓
        </div>
        <h2 className="text-4xl font-black tracking-tight text-gray-950">Dziękujemy!</h2>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Skontaktujemy się z Tobą w ciągu <strong>24 godzin</strong>. Sprawdź skrzynkę e-mail albo poczekaj na telefon.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-md bg-[#6f9f1f] px-8 py-4 text-base font-black text-white transition-colors hover:bg-[#5f8818]">
          Wróć na stronę główną
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Dane do kontaktu</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Jak mamy się odezwać?</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">Telefon wystarczy, żeby zacząć. E-mail możesz dodać, jeśli wolisz dostać podsumowanie na skrzynkę.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Imię i nazwisko', field: 'name', type: 'text', placeholder: 'np. Jan Kowalski', required: true },
            { label: 'Telefon', field: 'phone', type: 'tel', placeholder: 'np. 600 000 000', required: true },
            { label: 'Adres e-mail', field: 'email', type: 'email', placeholder: 'np. jan@example.com', required: false },
            { label: 'Wiek (opcjonalnie)', field: 'age', type: 'number', placeholder: 'np. 65', required: false },
          ].map(({ label, field, type, placeholder, required }) => (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-black text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                required={required}
                type={type}
                value={form[field as keyof typeof form] as string}
                onChange={e => set(field, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-[#102018]/12 bg-white px-4 py-3 text-base text-gray-950 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Wstępny wybór</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Jaki zestaw rozważasz?</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">To tylko punkt startowy. Jeśli wybór nie będzie trafiony, zaproponujemy lepszy wariant.</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {packages.map(p => (
            <label key={p.id} className="cursor-pointer">
              <input
                type="radio"
                name="package"
                value={p.id}
                checked={form.packageId === p.id}
                onChange={e => set('packageId', e.target.value)}
                className="sr-only"
              />
              <div className={`rounded-lg border-2 p-4 text-center transition-all ${
                form.packageId === p.id ? 'border-[#7DB122] bg-[#eef8dd]' : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
              }`}>
                <p className="font-black text-gray-950">{p.name}</p>
                <p className="mt-1 text-sm font-bold text-[#5f8818]">od {p.prices['24']} zł/mies.</p>
              </div>
            </label>
          ))}
        </div>

        <p className="mt-6 text-sm font-black text-gray-700">Preferowany okres abonamentu</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {[{ v: '6', l: '6 miesięcy' }, { v: '12', l: '12 miesięcy' }, { v: '24', l: '24 miesiące' }].map(p => (
            <label key={p.v} className="cursor-pointer">
              <input
                type="radio"
                name="period"
                value={p.v}
                checked={form.period === p.v}
                onChange={e => set('period', e.target.value)}
                className="sr-only"
              />
              <div className={`rounded-md border-2 px-5 py-2.5 text-sm font-black transition-all ${
                form.period === p.v ? 'border-[#7DB122] bg-[#eef8dd] text-[#5f8818]' : 'border-gray-200 text-gray-600 hover:border-[#7DB122]/60'
              }`}>
                {p.l}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Opcjonalnie</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">Usługi, które mogą się przydać</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {softwareAddons.map(addon => {
            const active = form.addons.includes(addon.id)
            return (
              <label key={addon.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                active ? 'border-[#7DB122] bg-[#eef8dd]' : 'border-gray-200 bg-white hover:border-[#7DB122]/60'
              }`}>
                <input type="checkbox" className="sr-only" checked={active} onChange={() => toggleAddon(addon.id)} />
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                  active ? 'border-[#6f9f1f] bg-[#6f9f1f] text-white' : 'border-gray-300 text-transparent'
                }`}>
                  ✓
                </span>
                <span className="flex-1 text-sm font-black text-gray-950">{addon.name}</span>
                <span className="shrink-0 text-sm font-black text-[#5f8818]">+{addon.price} zł</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={form.buyout}
            onChange={e => set('buyout', e.target.checked)}
            className="mt-1 h-5 w-5 accent-[#6f9f1f]"
          />
          <span>
            <span className="block font-black text-gray-950">Chcę porozmawiać o wykupie sprzętu po abonamencie</span>
            <span className="mt-1 block text-sm leading-6 text-gray-500">Omówimy szczegóły i cenę wykupu podczas rozmowy.</span>
          </span>
        </label>
      </section>

      <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
        <label className="mb-1.5 block text-sm font-black text-gray-700">Co jest dla Ciebie ważne?</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Np. komputer do pracy z domu, wideorozmów, nauki, obsługi poczty albo dla osoby starszej..."
          rows={4}
          className="w-full resize-none rounded-md border border-[#102018]/12 bg-white px-4 py-3 text-base text-gray-950 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7DB122]"
        />
      </section>

      <section className="overflow-hidden rounded-lg bg-[#102018] text-white shadow-xl shadow-[#102018]/15">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#f4f9ed]/55">Szacowana miesięczna rata</p>
            <p className="mt-1 text-5xl font-black leading-none text-[#dff2b8]">
              {total}<span className="text-xl font-bold text-[#f4f9ed]/55"> zł/mies.</span>
            </p>
          </div>
          <div className="rounded-lg border border-[#7DB122]/25 bg-[#7DB122]/10 px-5 py-3 text-left sm:text-right">
            <p className="text-xs font-bold text-[#f4f9ed]/55">Sprzęt za</p>
            <p className="text-3xl font-black text-white">1 zł</p>
          </div>
        </div>
        <div className="border-t border-white/10 p-6">
          <div className="mb-4 rounded-lg border border-[#7DB122]/25 bg-[#7DB122]/10 p-4">
            <p className="font-black text-[#dff2b8]">Wysłanie formularza niczego nie zobowiązuje.</p>
            <p className="mt-1 text-sm leading-6 text-[#f4f9ed]/65">
              To nie jest podpisanie umowy ani złożenie zamówienia. Skontaktujemy się, odpowiemy na pytania i dopiero później możesz zdecydować, czy oferta Ci odpowiada.
            </p>
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-md bg-[#6f9f1f] py-4 text-base font-black text-white transition-colors hover:bg-[#5f8818] disabled:opacity-60"
          >
            {status === 'sending' ? 'Wysyłam...' : 'Poproś o kontakt'}
          </button>
          {status === 'error' && (
            <p className="mt-3 text-center text-sm font-semibold text-red-300">Wystąpił błąd. Spróbuj ponownie lub zadzwoń do nas.</p>
          )}
          <p className="mt-3 text-center text-xs font-semibold text-[#f4f9ed]/50">Odpowiemy w ciągu 24 godzin</p>
        </div>
      </section>
    </form>
  )
}

export default function KontaktPage() {
  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-14 text-white sm:px-6 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Kontakt</p>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Zapytaj o ofertę</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75">
              Wypełnij formularz, a dobierzemy sprzęt i pakiet do Twoich potrzeb. Bez zobowiązań i bez technicznego żargonu.
            </p>
          </div>
          <div className="rounded-lg border border-white/12 bg-white/8 p-5 backdrop-blur">
            <p className="text-sm font-bold text-[#f4f9ed]/60">Wolisz telefonicznie?</p>
            <a href="tel:+48000000000" className="mt-2 block text-3xl font-black text-white hover:text-[#dff2b8]">+48 000 000 000</a>
            <p className="mt-2 text-sm font-semibold text-[#f4f9ed]/55">Pon-Pt, 8:00-17:00</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:py-14">
        <div className="space-y-5">
          <section className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#5f8818]">Jak wygląda kontakt</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {contactFlow.map(([num, title, desc]) => (
                <div key={title} className="rounded-lg bg-[#f6f8f5] p-4">
                  <p className="text-sm font-black text-[#5f8818]">{num}</p>
                  <h2 className="mt-2 font-black text-gray-950">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Suspense fallback={<div className="py-20 text-center text-gray-400">Ładowanie...</div>}>
            <KontaktForm />
          </Suspense>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {[
            ['24h', 'średni czas odpowiedzi'],
            ['1 zł', 'dostawa sprzętu na start'],
            ['6-24 mies.', 'elastyczny abonament'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-[#5f8818]">{value}</p>
              <p className="mt-1 text-sm font-semibold text-gray-500">{label}</p>
            </div>
          ))}
          <div className="rounded-lg border border-[#102018]/10 bg-white p-5 shadow-sm">
            <p className="font-black text-gray-950">Pomagamy dobrać zestaw</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Jeśli nie wiesz, czy wybrać laptopa, monitor czy PC, opisz swoje potrzeby w wiadomości. Dobierzemy rozsądny wariant.
            </p>
          </div>
          <div className="rounded-lg border border-[#7DB122]/25 bg-[#eef8dd] p-5 shadow-sm">
            <p className="font-black text-gray-950">Bez zobowiązań</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sam kontakt nie oznacza podpisania umowy. To tylko rozmowa i wstępna propozycja.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

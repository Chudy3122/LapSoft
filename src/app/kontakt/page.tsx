import { Suspense } from 'react'
import { KontaktForm } from '@/components/KontaktForm'
import { getSession } from '@/lib/session'

const contactFlow = [
  ['01', 'Wysyłasz zapytanie', 'Podajesz podstawowe dane i wstępny wybór. To nie jest zamówienie ani podpisanie umowy.'],
  ['02', 'Doprecyzowujemy potrzeby', 'Oddzwonimy, dopytamy o zastosowanie sprzętu i sprawdzimy, czy konfiguracja ma sens.'],
  ['03', 'Dostajesz propozycję', 'Przygotujemy ofertę z miesięczną ratą. Dopiero wtedy decydujesz, czy chcesz iść dalej.'],
]

export default async function KontaktPage() {
  const session = await getSession()
  const isLoggedIn = session?.role === 'USER'

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
            <KontaktForm isLoggedIn={isLoggedIn} />
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

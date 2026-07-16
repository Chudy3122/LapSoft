import Image from 'next/image'
import Link from 'next/link'
import { packages } from '@/data/packages'

const trustItems = [
  'Sprzęt za 1 zł na start',
  'Dostawa i konfiguracja w cenie',
  'Stała miesięczna rata',
  'Pomoc techniczna przez cały abonament',
]

const steps = [
  {
    num: '01',
    title: 'Wybierasz zestaw',
    desc: 'Laptop, laptop z monitorem albo komputer stacjonarny. Dobierasz sprzęt do codziennych potrzeb.',
  },
  {
    num: '02',
    title: 'Ustawiasz dodatki',
    desc: 'Możesz dodać Office, antywirusa, wsparcie IT, backup lub szkolenie z obsługi komputera.',
  },
  {
    num: '03',
    title: 'Dostajesz gotowy sprzęt',
    desc: 'Przywozimy urządzenia, podłączamy je i pomagamy przejść przez pierwsze uruchomienie.',
  },
  {
    num: '04',
    title: 'Płacisz miesięcznie',
    desc: 'Wiesz, ile kosztuje abonament. Bez dużego wydatku na start i bez zgadywania.',
  },
]

const benefits = [
  {
    title: 'Bez dużego zakupu',
    desc: 'Nie musisz od razu kupować laptopa, monitora i oprogramowania. Startujesz od niskiej opłaty.',
  },
  {
    title: 'Wsparcie zamiast stresu',
    desc: 'Gdy coś nie działa, nie zostajesz sam. Pomagamy telefonicznie, zdalnie albo przy wymianie sprzętu.',
  },
  {
    title: 'Zestaw gotowy do pracy',
    desc: 'Dostarczamy urządzenia z podstawową konfiguracją, żeby od początku było prosto i przewidywalnie.',
  },
  {
    title: 'Elastyczny abonament',
    desc: 'Możesz wybrać okres 6, 12 lub 24 miesięcy i zdecydować, czy chcesz wykupić sprzęt na koniec.',
  },
]

const audience = [
  'dla osób uczących się obsługi komputera',
  'dla pracy z domu i wideorozmów',
  'dla małych firm bez własnego IT',
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[#102018] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.24),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(223,242,184,0.14),transparent_26%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-linear-to-t from-[#102018]/85 to-transparent" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#7DB122]/30 bg-white/10 px-3 py-2 text-sm font-bold text-[#f4f9ed] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#7DB122]" />
              Wynajem sprzętu komputerowego i biurowego
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-6xl">
              Komputer do domu lub pracy bez dużego wydatku na start.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75 md:text-xl">
              Wynajmij laptopa, monitor albo gotowy zestaw PC w abonamencie miesięcznym.
              Sprzęt dostarczamy za <strong className="font-black text-white">1 zł</strong>, konfigurujemy i pomagamy przez cały okres umowy.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pakiety"
                className="rounded-md bg-[#6f9f1f] px-7 py-4 text-center text-base font-black text-white shadow-sm shadow-black/30 transition-colors hover:bg-[#5f8818]"
              >
                Sprawdź pakiety
              </Link>
              <Link
                href="/kontakt"
                className="rounded-md border border-white/20 bg-white/10 px-7 py-4 text-center text-base font-black text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Porozmawiajmy o sprzęcie
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-2 rounded-lg border border-white/12 bg-[#0d1712]/55 p-3 text-sm text-[#f4f9ed]/80 shadow-xl shadow-black/10 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
              {trustItems.map(item => (
                <div key={item} className="rounded-md border border-white/8 bg-white/4 px-3 py-2 font-semibold leading-snug">
                  <span className="mb-2 block h-1 w-8 rounded-full bg-[#7DB122]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-[#7DB122]/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative rounded-lg border border-white/15 bg-white p-5 shadow-2xl shadow-black/30">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#5f8818]">Zestaw polecany</p>
                  <p className="mt-1 text-lg font-black text-gray-950">Laptop + monitor</p>
                </div>
                <p className="rounded-md bg-[#eef8dd] px-3 py-1 text-sm font-black text-[#5f8818]">od 179 zł/mies.</p>
              </div>

              <div className="relative min-h-62.5 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#eef8dd_48%,#dfe9dc_100%)] p-5">
                <div className="absolute left-4 top-3 h-40 w-[72%] sm:left-8 sm:h-44 sm:w-[68%]">
                  <Image
                    src="/images/sprzet/xiaomi-a27i.webp"
                    alt="Monitor Xiaomi A27i"
                    fill
                    priority
                    sizes="(max-width: 1024px) 60vw, 360px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="absolute bottom-8 right-2 h-34 w-[68%] sm:right-4 sm:h-38 sm:w-[62%]">
                  <Image
                    src="/images/sprzet/dell-vostro-3530.webp"
                    alt="Laptop Dell Vostro 15 3530"
                    fill
                    priority
                    sizes="(max-width: 1024px) 58vw, 320px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="absolute bottom-6 left-5 rounded-md bg-white px-4 py-3 shadow-lg shadow-gray-900/10">
                  <p className="text-xs font-bold text-gray-500">Start</p>
                  <p className="text-2xl font-black text-[#5f8818]">1 zł</p>
                </div>
                <div className="absolute right-5 top-5 rounded-md bg-[#102018] px-4 py-3 text-white shadow-lg shadow-gray-900/10">
                  <p className="text-xs font-bold text-[#dff2b8]/70">W cenie</p>
                  <p className="text-sm font-black">dostawa + konfiguracja</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ['6/12/24', 'miesiące'],
                  ['24h', 'odpowiedź'],
                  ['IT', 'wsparcie'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                    <p className="text-lg font-black text-gray-950">{value}</p>
                    <p className="text-xs font-semibold text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#102018]/10 bg-[#f6f8f5]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 px-5 sm:px-6 md:grid-cols-3">
          {audience.map(item => (
            <div key={item} className="flex items-center gap-3 border-[#102018]/10 py-7 text-base font-black text-[#102018]/80 md:border-l md:px-7 lg:text-lg first:md:border-l-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef8dd] text-lg text-[#6f9f1f]">✓</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Jak to działa</p>
          <h2 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Cztery kroki od wyboru do gotowego sprzętu.</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Chcemy, żeby decyzja była prosta: wybierasz pakiet, a my zajmujemy się dostarczeniem i uruchomieniem zestawu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(step => (
            <div key={step.num} className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm">
              <p className="mb-6 text-sm font-black text-[#5f8818]">{step.num}</p>
              <h3 className="text-xl font-black tracking-tight text-gray-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#102018] px-5 py-20 text-white sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Pakiety</p>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">Wybierz zestaw, który pasuje do Twojego dnia.</h2>
            </div>
            <Link
              href="/konfigurator"
              className="rounded-md bg-[#6f9f1f] px-6 py-3 text-center text-sm font-black text-white transition-colors hover:bg-[#5f8818]"
            >
              Otwórz konfigurator
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`rounded-lg border p-6 ${
                  pkg.popular
                    ? 'border-[#7DB122] bg-[#6f9f1f] text-white'
                    : 'border-white/10 bg-white/5 text-white'
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    {pkg.popular && (
                      <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#eef8dd]">Najczęstszy wybór</p>
                    )}
                    <h3 className="text-2xl font-black tracking-tight">{pkg.name}</h3>
                    <p className={`mt-2 text-sm leading-6 ${pkg.popular ? 'text-white/80' : 'text-[#f4f9ed]/65'}`}>
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <p className="mb-6 text-5xl font-black tracking-tight">
                  {pkg.prices['24']}
                  <span className={`text-base font-bold ${pkg.popular ? 'text-white/70' : 'text-[#f4f9ed]/55'}`}> zł/mies.</span>
                </p>

                <ul className="space-y-3 text-sm font-semibold">
                  {pkg.includes.slice(0, 4).map(item => (
                    <li key={item} className="flex gap-2">
                      <span className={pkg.popular ? 'text-[#eef8dd]' : 'text-[#7DB122]'}>✓</span>
                      <span className={pkg.popular ? 'text-white/85' : 'text-[#f4f9ed]/75'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Dlaczego LapSoft</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Mniej formalności, więcej pewności.</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Strona ma prowadzić użytkownika do jasnej decyzji: jaki sprzęt, na jaki okres i z jakim wsparciem. Dlatego oferta jest czytelna, a najważniejsze koszty widoczne są od razu.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map(benefit => (
              <div key={benefit.title} className="rounded-lg border border-[#102018]/10 bg-white p-6 shadow-sm">
                <div className="mb-4 h-1 w-10 rounded-full bg-[#7DB122]" />
                <h3 className="text-lg font-black text-gray-950">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-lg border border-[#102018]/10 bg-white shadow-xl shadow-[#102018]/5 lg:grid-cols-[1fr_0.7fr]">
          <div className="p-8 md:p-10">
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#5f8818]">Następny krok</p>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Dobierzmy pierwszy zestaw i policzmy miesięczną ratę.</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-gray-600">
              Możesz samodzielnie sprawdzić ceny w konfiguratorze albo wysłać krótkie zapytanie. Odpowiemy w ciągu 24 godzin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/konfigurator"
                className="rounded-md bg-[#6f9f1f] px-7 py-4 text-center text-base font-black text-white transition-colors hover:bg-[#5f8818]"
              >
                Przejdź do konfiguratora
              </Link>
              <Link
                href="/kontakt"
                className="rounded-md border border-gray-300 px-7 py-4 text-center text-base font-black text-gray-900 transition-colors hover:bg-gray-50"
              >
                Wyślij zapytanie
              </Link>
            </div>
          </div>

          <div className="bg-[#eef8dd] p-8 md:p-10">
            <div className="space-y-4">
              {[
                ['od 149 zł', 'miesięcznie za laptopa'],
                ['1 zł', 'dostawa sprzętu na start'],
                ['6-24 mies.', 'elastyczny okres abonamentu'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-white p-5 shadow-sm">
                  <p className="text-3xl font-black text-[#5f8818]">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'

const steps = [
  { num: '01', title: 'Wybierz pakiet', desc: 'Laptop, laptop z monitorem lub komputer stacjonarny. Dobieramy sprzęt do Twoich potrzeb.' },
  { num: '02', title: 'Skonfiguruj', desc: 'Dodaj oprogramowanie, wsparcie IT lub szkolenie. Płacisz tylko za to, czego potrzebujesz.' },
  { num: '03', title: 'Płać miesięcznie', desc: 'Sprzęt dostarczamy za 1 zł. Stała miesięczna rata — bez niespodzianek.' },
  { num: '04', title: 'Korzystaj', desc: 'Dostarczamy, konfigurujemy, pomagamy. Jesteśmy do dyspozycji przez cały czas trwania umowy.' },
]

const features = [
  { title: 'Dostawa i konfiguracja', desc: 'Przywozimy sprzęt do domu i wszystko uruchamiamy — bez dodatkowych opłat.' },
  { title: 'Wsparcie techniczne', desc: 'Pomoc przez telefon lub zdalnie. Reagujemy szybko, gdy coś nie działa.' },
  { title: 'Wymiana sprzętu', desc: 'Awaria? Wymieniamy sprawny sprzęt bez zbędnych formalności.' },
  { title: 'Stała cena', desc: 'Jedna miesięczna opłata. Wiesz dokładnie ile płacisz przez cały okres.' },
  { title: 'Elastyczny abonament', desc: 'Wybierasz na 6, 12 lub 24 miesiące. Możliwy wykup sprzętu na koniec.' },
  { title: 'Dla każdego', desc: 'Szczególnie polecamy seniorom — prosto, bezpiecznie, z pełnym wsparciem.' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-green-500 text-sm font-bold uppercase tracking-widest mb-6">
            Wynajem sprzętu komputerowego
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-8 max-w-3xl">
            Komputer<br />
            <span className="text-green-500">bez dużych</span><br />
            wydatków.
          </h1>
          <p className="text-gray-400 text-xl max-w-xl mb-10 leading-relaxed">
            Wynajmij laptopa lub komputer stacjonarny za <span className="text-white font-bold">1 zł</span> i płać
            wygodny miesięczny abonament. Dostawa, konfiguracja i pomoc techniczna w cenie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pakiety"
              className="bg-green-600 text-white font-bold px-8 py-4 text-base hover:bg-green-700 transition-colors inline-block text-center"
            >
              Zobacz pakiety i cennik
            </Link>
            <Link
              href="/kontakt"
              className="border border-gray-700 text-gray-300 font-bold px-8 py-4 text-base hover:border-gray-500 hover:text-white transition-colors inline-block text-center"
            >
              Skontaktuj się
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-gray-400">
          <span>Sprzęt za 1 zł na start</span>
          <span className="text-gray-700">|</span>
          <span>Dostawa i konfiguracja gratis</span>
          <span className="text-gray-700">|</span>
          <span>Wsparcie techniczne w cenie</span>
          <span className="text-gray-700">|</span>
          <span>Opcja wykupu sprzętu</span>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Jak to działa</p>
          <h2 className="text-4xl font-black tracking-tight">Cztery proste kroki</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => (
            <div key={s.num} className="border border-gray-200 bg-white p-6">
              <p className="text-5xl font-black text-gray-100 mb-4 leading-none">{s.num}</p>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-gray-950 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-green-500 text-sm font-bold uppercase tracking-widest mb-3">Oferta</p>
            <h2 className="text-4xl font-black tracking-tight text-white">Trzy pakiety do wyboru</h2>
            <p className="text-gray-500 mt-2 text-lg">Już od 149 zł miesięcznie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Sam Laptop', price: '149', desc: 'Laptop Dell + torba + zasilacz', tag: null },
              { name: 'Laptop + Monitor', price: '179', desc: 'Laptop + monitor Xiaomi 27"', tag: 'Najpopularniejszy' },
              { name: 'PC + Monitor', price: '209', desc: 'Komputer stacjonarny + monitor 27"', tag: null },
            ].map(p => (
              <div key={p.name} className={`p-6 border ${p.tag ? 'border-green-600 bg-gray-900' : 'border-gray-800 bg-gray-900'} relative`}>
                {p.tag && (
                  <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1">
                    {p.tag}
                  </span>
                )}
                <h3 className="text-white font-bold text-xl mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{p.desc}</p>
                <p className="text-green-500 text-4xl font-black">
                  od {p.price}<span className="text-lg text-gray-500 font-normal"> zł/mies.</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/pakiety"
              className="inline-block bg-green-600 text-white font-bold px-8 py-4 text-base hover:bg-green-700 transition-colors"
            >
              Oblicz swoją cenę
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Dlaczego LapSoft</p>
          <h2 className="text-4xl font-black tracking-tight">Prostota i bezpieczeństwo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white border border-gray-200 p-6">
              <div className="w-8 h-0.5 bg-green-600 mb-4" />
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Gotowy na własny komputer?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl">
            Zadzwoń lub wypełnij formularz. Odpowiemy w ciągu 24 godzin i dobierzemy najlepszy pakiet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/kontakt"
              className="bg-white text-green-700 font-bold px-8 py-4 text-base hover:bg-green-50 transition-colors inline-block text-center"
            >
              Wypełnij formularz
            </Link>
            <a
              href="tel:+48000000000"
              className="border-2 border-white/60 text-white font-bold px-8 py-4 text-base hover:border-white transition-colors text-center"
            >
              +48 000 000 000
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

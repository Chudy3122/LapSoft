import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="text-2xl font-black tracking-tight mb-3">
            <span className="text-white">Lap</span><span className="text-green-500">Soft</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Wynajem sprzętu komputerowego w abonamencie miesięcznym. Laptopy, komputery i monitory dla każdego.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Nawigacja</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Start</Link></li>
            <li><Link href="/pakiety" className="hover:text-white transition-colors">Pakiety i cennik</Link></li>
            <li><Link href="/sprzet" className="hover:text-white transition-colors">Sprzęt</Link></li>
            <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Kontakt</h3>
          <ul className="space-y-2 text-sm">
            <li>+48 000 000 000</li>
            <li>kontakt@lapsoft.pl</li>
            <li className="text-gray-500">Pon–Pt, 8:00–17:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-700">
        © {new Date().getFullYear()} LapSoft. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  )
}

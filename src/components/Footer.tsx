import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#102018]/10 bg-[#102018] text-[#f4f9ed]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6f9f1f] text-lg font-black text-white">
              LS
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">LapSoft</p>
              <p className="text-xs font-semibold text-[#dff2b8]/70">sprzęt, konfiguracja, wsparcie</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#f4f9ed]/70">
            Wynajem sprzętu komputerowego w abonamencie miesięcznym. Dostarczamy gotowy zestaw, pomagamy w konfiguracji i zostajemy dostępni, gdy pojawi się pytanie.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#102018]">
            <span className="rounded-md bg-[#dff2b8] px-3 py-1.5">Dostawa za 1 zł</span>
            <span className="rounded-md bg-[#eef8dd] px-3 py-1.5">Wsparcie w cenie</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Nawigacja</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Start</Link></li>
            <li><Link href="/pakiety" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Pakiety i cennik</Link></li>
            <li><Link href="/sprzet" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Sprzęt</Link></li>
            <li><Link href="/kontakt" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Kontakt</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+48000000000" className="text-[#f4f9ed]/70 transition-colors hover:text-white">+48 000 000 000</a></li>
            <li><a href="mailto:kontakt@lapsoft.pl" className="text-[#f4f9ed]/70 transition-colors hover:text-white">kontakt@lapsoft.pl</a></li>
            <li className="text-[#f4f9ed]/50">Pon–Pt, 7:00–16:00</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Dokumenty</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/polityka-prywatnosci" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Polityka prywatności</Link></li>
            <li><Link href="/regulamin" className="text-[#f4f9ed]/70 transition-colors hover:text-white">Regulamin</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-[#f4f9ed]/45">
        © {new Date().getFullYear()} LapSoft. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  )
}

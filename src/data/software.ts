export interface SoftwareAddon {
  id: string
  name: string
  description: string
  price: number
  icon: string
  recommendedFor?: string
}

export const softwareAddons: SoftwareAddon[] = [
  {
    id: 'office',
    name: 'Microsoft Office 365',
    description: 'Word, Excel, PowerPoint, Outlook — pisanie listów, obsługa poczty e-mail, arkusze kalkulacyjne.',
    price: 25,
    icon: '📝',
    recommendedFor: 'Dla każdego',
  },
  {
    id: 'antivirus',
    name: 'Antywirus Norton 360',
    description: 'Pełna ochrona przed wirusami, hakerami i złośliwym oprogramowaniem. Bezpieczne przeglądanie internetu.',
    price: 15,
    icon: '🛡️',
    recommendedFor: 'Zalecane',
  },
  {
    id: 'it-support',
    name: 'Wsparcie IT',
    description: 'Zdalna pomoc techniczna przez telefon lub wideo. Rozwiążemy każdy problem w kilka minut.',
    price: 20,
    icon: '🔧',
    recommendedFor: 'Dla seniorów',
  },
  {
    id: 'training',
    name: 'Szkolenie z obsługi komputera',
    description: 'Indywidualne lekcje online: obsługa komputera, internet, e-mail, wideorozmowy. W Twoim tempie.',
    price: 30,
    icon: '🎓',
    recommendedFor: 'Dla seniorów',
  },
  {
    id: 'video-calls',
    name: 'Konfiguracja wideorozmów',
    description: 'Instalacja i konfiguracja Skype, WhatsApp, Teams lub Zoom — kontakt z rodziną jednym kliknięciem.',
    price: 10,
    icon: '📹',
    recommendedFor: 'Popularny',
  },
  {
    id: 'cloud-backup',
    name: 'Backup w chmurze',
    description: 'Automatyczne kopie zapasowe zdjęć i dokumentów w chmurze. Twoje wspomnienia zawsze bezpieczne.',
    price: 10,
    icon: '☁️',
    recommendedFor: 'Dla seniorów',
  },
]

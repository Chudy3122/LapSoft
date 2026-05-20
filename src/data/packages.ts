export type PeriodKey = '6' | '12' | '24'

export interface Package {
  id: string
  name: string
  description: string
  includes: string[]
  prices: Record<PeriodKey, number>
  buyoutPrices: Record<PeriodKey, number>
  icon: string
  popular?: boolean
}

export const packages: Package[] = [
  {
    id: 'laptop',
    name: 'Sam Laptop',
    description: 'Idealny pakiet dla osoby, która potrzebuje przenośnego komputera do codziennego użytku.',
    includes: ['Laptop Dell Vostro 15 lub Inspiron 15', 'Torba na laptopa', 'Zasilacz', 'Konfiguracja i uruchomienie'],
    prices: { '6': 179, '12': 159, '24': 149 },
    buyoutPrices: { '6': 900, '12': 600, '24': 300 },
    icon: '💻',
  },
  {
    id: 'laptop-monitor',
    name: 'Laptop + Monitor',
    description: 'Komfort pracy w domu — duży ekran monitora i mobilność laptopa w jednym pakiecie.',
    includes: ['Laptop Dell Vostro 15 lub Inspiron 15', 'Monitor Xiaomi A27i 27"', 'Kabel HDMI', 'Torba na laptopa', 'Zasilacz', 'Konfiguracja i uruchomienie'],
    prices: { '6': 219, '12': 199, '24': 179 },
    buyoutPrices: { '6': 1200, '12': 800, '24': 400 },
    icon: '💻🖥️',
    popular: true,
  },
  {
    id: 'pc-monitor',
    name: 'PC + Monitor',
    description: 'Stacjonarny zestaw komputerowy — najwydajniejsza opcja do pracy i rozrywki w domu.',
    includes: ['Komputer HP Pro SFF 290 G9 lub Dell Optiplex 7010', 'Monitor Xiaomi A27i 27"', 'Klawiatura i mysz', 'Kable połączeniowe', 'Konfiguracja i uruchomienie'],
    prices: { '6': 249, '12': 229, '24': 209 },
    buyoutPrices: { '6': 1500, '12': 1000, '24': 500 },
    icon: '🖥️',
  },
]

export const periods: { key: PeriodKey; label: string; discount: string }[] = [
  { key: '6', label: '6 miesięcy', discount: '' },
  { key: '12', label: '12 miesięcy', discount: 'Oszczędzasz 240 zł' },
  { key: '24', label: '24 miesiące', discount: 'Najlepsza cena!' },
]

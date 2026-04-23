export interface Equipment {
  id: string
  category: 'laptop' | 'pc' | 'monitor'
  brand: string
  model: string
  image: string
  specs: { label: string; value: string }[]
  units: number
  description: string
}

export const equipment: Equipment[] = [
  {
    id: 'dell-vostro-3530',
    category: 'laptop',
    brand: 'Dell',
    model: 'Vostro 15 3530',
    image: '/images/sprzet/dell-vostro-3530.jpg',
    units: 22,
    description: 'Niezawodny laptop biznesowy idealny do codziennej pracy, nauki i rozrywki. Duży ekran i wygodna klawiatura.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i3/i5 13. generacji' },
      { label: 'RAM', value: '8 GB DDR4' },
      { label: 'Dysk', value: '256 GB SSD' },
      { label: 'Ekran', value: '15,6" Full HD' },
      { label: 'System', value: 'Windows 11 Home' },
      { label: 'Waga', value: '1,78 kg' },
    ],
  },
  {
    id: 'dell-dc15250',
    category: 'laptop',
    brand: 'Dell',
    model: 'DC15250',
    image: '/images/sprzet/dell-dc15250.jpg',
    units: 6,
    description: 'Kompaktowy i lekki laptop do codziennego użytku. Doskonały do przeglądania internetu, poczty i wideorozmów.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i3 13. generacji' },
      { label: 'RAM', value: '8 GB DDR4' },
      { label: 'Dysk', value: '256 GB SSD' },
      { label: 'Ekran', value: '15,6" Full HD' },
      { label: 'System', value: 'Windows 11 Home' },
      { label: 'Łączność', value: 'Wi-Fi 6, Bluetooth 5' },
    ],
  },
  {
    id: 'dell-inspiron-3530',
    category: 'laptop',
    brand: 'Dell',
    model: 'Inspiron 15 3530',
    image: '/images/sprzet/dell-inspiron-3530.jpg',
    units: 12,
    description: 'Wydajny laptop z większą pamięcią RAM — płynna praca z wieloma aplikacjami naraz. Świetny wybór dla wymagających użytkowników.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i5 13. generacji' },
      { label: 'RAM', value: '16 GB DDR4' },
      { label: 'Dysk', value: '512 GB SSD' },
      { label: 'Ekran', value: '15,6" Full HD' },
      { label: 'System', value: 'Windows 11 Home' },
      { label: 'Grafika', value: 'Intel Iris Xe' },
    ],
  },
  {
    id: 'dell-latitude-3550',
    category: 'laptop',
    brand: 'Dell',
    model: 'Latitude 3550',
    image: '/images/sprzet/dell-latitude-3550.jpg',
    units: 5,
    description: 'Profesjonalny laptop klasy biznesowej z rozszerzonymi funkcjami bezpieczeństwa. Trwała budowa, długa żywotność baterii.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i5 13. generacji' },
      { label: 'RAM', value: '16 GB DDR4' },
      { label: 'Dysk', value: '512 GB SSD' },
      { label: 'Ekran', value: '15,6" Full HD' },
      { label: 'System', value: 'Windows 11 Pro' },
      { label: 'Bateria', value: 'do 10 godzin' },
    ],
  },
  {
    id: 'hp-pro-290-g9',
    category: 'pc',
    brand: 'HP',
    model: 'Pro SFF 290 G9',
    image: '/images/sprzet/hp-pro-290-g9.jpg',
    units: 5,
    description: 'Kompaktowy komputer stacjonarny do biurka — zajmuje mało miejsca, a pracuje wydajnie. Idealny do domu.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i3/i5 12. generacji' },
      { label: 'RAM', value: '8 GB DDR4' },
      { label: 'Dysk', value: '256 GB SSD' },
      { label: 'Obudowa', value: 'Mini (SFF)' },
      { label: 'System', value: 'Windows 11 Pro' },
      { label: 'Porty', value: 'USB-A, USB-C, HDMI, DisplayPort' },
    ],
  },
  {
    id: 'dell-optiplex-7010',
    category: 'pc',
    brand: 'Dell',
    model: 'OptiPlex 7010',
    image: '/images/sprzet/dell-optiplex-7010.jpg',
    units: 5,
    description: 'Niezawodny komputer stacjonarny klasy biznesowej. Cichy, energooszczędny, gotowy do pracy od pierwszego uruchomienia.',
    specs: [
      { label: 'Procesor', value: 'Intel Core i5 13. generacji' },
      { label: 'RAM', value: '16 GB DDR4' },
      { label: 'Dysk', value: '512 GB SSD' },
      { label: 'Obudowa', value: 'Mini (SFF)' },
      { label: 'System', value: 'Windows 11 Pro' },
      { label: 'Porty', value: 'USB-A x4, USB-C, HDMI, DP' },
    ],
  },
  {
    id: 'xiaomi-a27i',
    category: 'monitor',
    brand: 'Xiaomi',
    model: 'A27i',
    image: '/images/sprzet/xiaomi-a27i.jpg',
    units: 20,
    description: 'Duży, czytelny monitor 27 cali — idealna wielkość do wygodnej pracy i oglądania filmów bez zmęczenia oczu.',
    specs: [
      { label: 'Przekątna', value: '27 cali' },
      { label: 'Rozdzielczość', value: 'Full HD (1920×1080)' },
      { label: 'Panel', value: 'IPS' },
      { label: 'Odświeżanie', value: '100 Hz' },
      { label: 'Złącza', value: 'HDMI, VGA' },
      { label: 'Regulacja', value: 'Pochylenie ekranu' },
    ],
  },
]

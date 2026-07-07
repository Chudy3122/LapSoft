import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSession } from '@/lib/session'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'LapSoft — Wynajem sprzętu komputerowego',
  description: 'Wynajmij laptop, komputer lub monitor w prostym abonamencie miesięcznym. Dostawa, konfiguracja i wsparcie techniczne w cenie.',
  icons: {
    icon: [{ url: '/favicon_lapsoft.png', type: 'image/png', sizes: '200x200' }],
    shortcut: '/favicon_lapsoft.png',
    apple: [{ url: '/favicon_lapsoft.png', type: 'image/png', sizes: '200x200' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const user = session ? { name: session.name, role: session.role } : null

  return (
    <html lang="pl">
      <body className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

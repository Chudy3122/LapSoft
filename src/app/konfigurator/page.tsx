import { Suspense } from 'react'
import Konfigurator from '@/components/Konfigurator'

export default function KonfiguratorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f8f5] px-5 py-20 text-center text-sm font-bold text-gray-500">
          Ładowanie konfiguratora...
        </div>
      }
    >
      <Konfigurator />
    </Suspense>
  )
}

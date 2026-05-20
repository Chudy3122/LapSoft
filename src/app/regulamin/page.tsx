export default function RegulaminPage() {
  return (
    <div className="bg-[#f6f8f5]">
      <section className="relative isolate overflow-hidden bg-[#102018] px-5 py-14 text-white sm:px-6 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,177,34,0.22),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(223,242,184,0.12),transparent_24%),linear-gradient(135deg,#15281f_0%,#1c3122_48%,#0e1913_100%)]" />
        <div className="hero-electric-lines pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#dff2b8]">Dokumenty</p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">Regulamin</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4f9ed]/75">
            W tym miejscu pojawią się zasady korzystania z serwisu i usług LapSoft.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">
        <section className="rounded-lg border border-[#102018]/10 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-widest text-[#5f8818]">Treść w przygotowaniu</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950">Regulamin zostanie uzupełniony.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            To tymczasowa podstrona przygotowana pod docelową treść dokumentu.
          </p>
        </section>
      </main>
    </div>
  )
}

import Logo from "./Logo";

export default function Hero() {
  return (
    <section
      id="top"
      className="max-w-content mx-auto px-6 py-20 md:py-28 text-center"
    >
      <div className="flex justify-center mb-10 md:mb-14">
        <Logo size="lg" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-tight">
        AI der flytter forretningstal.
      </h1>
      <p className="text-lg md:text-2xl text-neutral-700 max-w-3xl mx-auto leading-relaxed mb-6">
        De fleste virksomheder har afprøvet AI — få har set det reelt flytte
        tallene. SpAIke hjælper danske mid-market virksomheder fra
        AI-eksperimenter til målbare business-resultater. Sparet tid, frigjorte
        ressourcer, højere kvalitet i output.
      </p>
      <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12">
        Start med vores gratis SpAIke Discovery: 3-5 medarbejdere bliver
        AI-interviewet, og I får en konkret handlingsplan på 48 timer.
      </p>
      <div className="flex items-center justify-center gap-6 flex-wrap mb-12 md:mb-16">
        <a
          href="#discovery"
          className="bg-spaike-blue hover:bg-spaike-blue-dark text-black font-semibold px-8 py-4 rounded-lg transition-colors text-base md:text-lg"
        >
          Kør gratis Discovery →
        </a>
        <a
          href="#cases"
          className="text-neutral-700 hover:text-neutral-900 font-medium underline-offset-4 hover:underline"
        >
          Se hvem vi har leveret for
        </a>
      </div>
      <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
        Bygget af Michael Mortensen — 15+ års kommerciel erfaring fra McKinsey,
        Nilfisk, GetWhy og UserTribe. Vi binder forretning og AI sammen.
      </p>
    </section>
  );
}

import Logo from "./Logo";

export default function Hero() {
  return (
    <section
      id="top"
      className="max-w-content mx-auto px-6 py-20 md:py-32 text-center"
    >
      <div className="flex justify-center mb-12 md:mb-16">
        <Logo size="lg" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-tight">
        Spiken er i kombinationen.
      </h1>
      <p className="text-lg md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-10 md:mb-12">
        AI alene giver kapacitet. Forretningsforståelse alene giver retning. SpAIke
        kombinerer dem — for danske mid-market virksomheder der vil have målbart
        AI-impact, ikke endnu et eksperiment.
      </p>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <a
          href="https://assessment.spaike.dk"
          className="bg-spaike-blue hover:bg-spaike-blue-dark text-black font-semibold px-8 py-4 rounded-lg transition-colors text-base md:text-lg"
        >
          Kør gratis Discovery →
        </a>
        <a
          href="#manifest"
          className="text-neutral-600 hover:text-neutral-900 font-medium underline-offset-4 hover:underline"
        >
          Eller læs vores manifest
        </a>
      </div>
    </section>
  );
}

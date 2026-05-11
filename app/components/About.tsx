export default function About() {
  return (
    <section
      id="om"
      className="py-20 md:py-28 border-t border-neutral-200"
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-xs bg-background-tertiary border border-neutral-200 rounded-2xl flex items-center justify-center">
              <span className="text-sm text-neutral-400">[Foto kommer]</span>
            </div>
            <a
              href="https://www.linkedin.com/in/michaelsbm/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-spaike-blue-dark hover:text-spaike-blue font-medium text-sm underline-offset-4 hover:underline"
            >
              Find Michael på LinkedIn →
            </a>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase">
              Hvorfor SpAIke
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Det er ikke teknologien der mangler.
            </h2>
            <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
              <p>
                Efter 15+ år i kommercielle roller — McKinsey, Nilfisk, GetWhy,
                home — fra konsulent-verden til scale-up til stor corporate —
                har jeg set hvor AI-projekter strander.
              </p>
              <p>
                Ikke fordi teknologien ikke virker. Fordi forretningsforståelsen
                mangler.
              </p>
              <p>
                Så jeg byggede SpAIke. Spiken er i kombinationen — kommerciel
                skarpsindighed plus hands-on AI-byggeri. Det er det der gør
                forskellen mellem at eksperimentere med AI og at flytte tallene.
              </p>
              <p className="text-base text-neutral-600">— Michael Mortensen, founder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

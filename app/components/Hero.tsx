import { Dateline, SectionLabel, SpaikeWordmark } from "./EditorialUI";

const stats: [string, string][] = [
  ["48 t", "fra kick-off til handlingsplan"],
  ["3-5", "medarbejdere AI-interviewet"],
  ["10", "gratis Discovery-spots i beta"],
];

export default function Hero() {
  return (
    <section id="top" className="flex flex-col">
      <Dateline
        left="Vol. I · Beta · Maj 2026"
        mid="København · Danmark"
        right="For kommercielle ledere i mid-market"
      />

      <div className="max-w-editorial mx-auto w-full grid md:grid-cols-[1.15fr_1fr] gap-0 px-6 md:px-14 pt-14 md:pt-16 pb-14">
        {/* LEFT — Forsidehistorien */}
        <div className="md:pr-12 md:border-r border-rule flex flex-col gap-7 pb-10 md:pb-0">
          <SectionLabel>Forsidehistorien</SectionLabel>

          <div className="-mb-2">
            <SpaikeWordmark size="xl" />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-[96px] font-normal leading-[0.95] tracking-tight text-ink">
            Commercial impact, <em className="italic font-normal">drevet af <span className="not-italic font-sans font-bold text-amber">AI</span>.</em>
          </h1>

          <p className="font-serif text-lg md:text-xl leading-relaxed text-ink-soft max-w-[500px]">
            De fleste virksomheder har afprøvet AI. Få har set det reelt flytte
            tallene. SpAIke hjælper danske mid-market virksomheder med at alignere
            AI-automation med deres strategiske mål, så frigjorte ressourcer lander
            der, hvor de faktisk accelererer <em className="italic">forretningen.</em>
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="#discovery"
              className="bg-ink text-cream px-8 py-5 font-sans text-base md:text-lg font-medium hover:bg-ink/85 transition-colors"
            >
              Kør gratis Discovery →
            </a>
            <a
              href="#cases"
              className="font-sans text-sm text-muted underline underline-offset-4 decoration-rule hover:decoration-ink hover:text-ink"
            >
              Se hvem vi har leveret for
            </a>
          </div>
        </div>

        {/* RIGHT — Et lille manifest + founder + stats */}
        <div className="md:pl-12 pt-10 md:pt-0 flex flex-col gap-7">
          <SectionLabel>Et lille manifest</SectionLabel>

          <blockquote className="font-serif text-xl md:text-[28px] leading-[1.3] italic text-ink">
            "Det er ikke teknologien der mangler. Det er{" "}
            <span className="text-amber-dark not-italic font-semibold">
              kombinationen
            </span>{" "}
            af forretnings­forståelse og hands-on AI-implementering."
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ink text-cream flex items-center justify-center font-serif font-semibold text-lg">
              MM
            </div>
            <div>
              <div className="font-sans text-sm font-semibold text-ink">
                Michael Mortensen
              </div>
              <div className="font-mono text-[10px] tracking-wider uppercase text-muted mt-1">
                Founder · 15+ år kommerciel erfaring · McKinsey · Nilfisk · GetWhy · home
              </div>
            </div>
          </div>

          <div className="h-px bg-rule mt-auto" />

          <div className="grid grid-cols-3 gap-0">
            {stats.map(([n, l], i) => (
              <div
                key={i}
                className={`px-4 md:px-5 pt-1 ${i ? "border-l border-rule" : ""}`}
              >
                <div className="font-serif text-4xl md:text-5xl font-medium leading-none tracking-tight">
                  {n}
                </div>
                <div className="font-sans text-xs text-muted mt-2 leading-snug">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

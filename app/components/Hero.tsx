import { Dateline, SectionLabel, SpaikeWordmark } from "./EditorialUI";

export default function Hero() {
  return (
    <section id="top" className="flex flex-col">
      <Dateline
        left="Vol. I · Maj 2026"
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
            tallene. SpAIke hjælper danske mid-market virksomheder med at aligne
            AI-automation med deres strategiske mål, så frigjorte ressourcer lander
            der, hvor de faktisk accelererer <em className="italic">forretningen.</em>
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="https://calendly.com/michael-spaike/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="book_moede_click"
              data-umami-event-location="hero"
              className="bg-ink text-cream px-8 py-5 font-sans text-base md:text-lg font-medium hover:bg-ink/85 transition-colors"
            >
              Book møde →
            </a>
            <a
              href="https://assessment.spaike.dk"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="discovery_cta_click"
              data-umami-event-location="hero"
              className="border border-ink text-ink px-8 py-5 font-sans text-base md:text-lg font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              Prøv Discovery (beta)
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
        </div>
      </div>
    </section>
  );
}

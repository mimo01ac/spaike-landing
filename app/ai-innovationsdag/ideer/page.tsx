import type { Metadata } from "next";
import Logo from "../../components/Logo";
import IdeaCatalog from "../_components/IdeaCatalog";

export const metadata: Metadata = {
  title: "Idékatalog: AI-cases til kommercielle teams | SpAIke",
  description:
    "Inspiration til en AI-innovationsdag: konkrete værktøjer kommercielle teams (salg, RevOps, marketing, customer success, onboarding) kan bygge på en dag med vibe coding.",
  alternates: { canonical: "https://www.spaike.dk/ai-innovationsdag/ideer" },
  openGraph: {
    title: "Idékatalog: hvad kan I bygge på en AI-innovationsdag?",
    description:
      "Konkrete, kommercielle AI-cases til salg, RevOps, marketing, customer success og onboarding.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/ai-innovationsdag/ideer",
  },
};

export default function IdeerPage() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-rule">
        <div className="max-w-content mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6">
          <a href="/ai-innovationsdag" aria-label="SpAIke" className="flex items-baseline gap-3.5">
            <Logo size="md" />
            <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-muted">
              AI advisory
            </span>
          </a>
          <a
            href="/ai-innovationsdag#vaerktoej"
            className="bg-ink text-cream px-4 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
          >
            Find jeres case →
          </a>
        </div>
      </header>

      <section className="max-w-content mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
            Idékatalog
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] text-ink mb-5">
            Hvad kan I bygge på en dag?
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Det sværeste er ofte at se hvad der overhovedet er muligt. Her er konkrete cases, som
            kommercielle teams kan bygge på en AI-innovationsdag, fra salg og RevOps til marketing,
            customer success og onboarding. Brug dem som afsæt, ikke som facitliste, og find jeres
            egen i værktøjet.
          </p>
        </div>

        <IdeaCatalog />

        <div className="mt-12 border-t border-rule pt-10 max-w-2xl">
          <h2 className="font-serif text-2xl text-ink leading-tight mb-2">
            Genkender I en af dem, eller fik I en idé?
          </h2>
          <p className="text-ink-soft leading-relaxed mb-6">
            Værktøjet hjælper jer med at skærpe netop jeres case og går fra det med en færdig brief.
          </p>
          <a
            href="/ai-innovationsdag#vaerktoej"
            className="inline-block bg-ink text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
          >
            Find jeres case →
          </a>
        </div>
      </section>

      <footer className="border-t border-rule">
        <div className="max-w-content mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <Logo size="md" />
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted self-end">
            © {new Date().getFullYear()} SpAIke ApS ·{" "}
            <a href="/ai-innovationsdag" className="hover:text-amber-dark transition-colors">
              AI-innovationsdag
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

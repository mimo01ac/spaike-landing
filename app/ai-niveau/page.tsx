import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";
import ProficiencyTest from "./_components/ProficiencyTest";

export const metadata: Metadata = {
  title: "AI Proficiency Snapshot · Hvad er dit AI-niveau, og hvad er næste skridt?",
  description:
    "Svar på 12 spørgsmål og få dit AI-niveau, dit svageste område og en konkret plan til at komme et trin op, tilpasset det du har adgang til. Gratis, dansk, ingen konto. Ca. to minutter.",
  openGraph: {
    title: "AI Proficiency Snapshot · Test dit AI-niveau",
    description:
      "Dit AI-niveau på to minutter: fire niveauer fra Den Nysgerrige til Agent-orkestratoren, dit svageste område og en konkret plan videre. Gratis og på dansk.",
    url: "https://www.spaike.dk/ai-niveau",
    locale: "da_DK",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Hvad måler testen?",
    a: "Din AI-modenhed på tværs af fem områder: hvordan du prompter, dit værktøjskendskab, om du bygger AI ind i faste arbejdsgange, om du automatiserer, og hvor kritisk og sikkert du bruger AI. Du placeres på ét af fire niveauer og får dit svageste område udpeget.",
  },
  {
    q: "Hvad er de fire niveauer?",
    a: "Den Nysgerrige (bruger AI usystematisk og manuelt), Den Daglige bruger (fast hjælper, men én ting ad gangen), Workflow-byggeren (AI bygget ind i arbejdsgange) og Agent-orkestratoren (får AI til at arbejde selv). Du får også en konkret plan til at komme et trin op.",
  },
  {
    q: "Koster det noget, og skal jeg oprette en konto?",
    a: "Nej. Testen er gratis og kræver hverken konto eller e-mail. Du kan hente dit resultat som PDF med det samme. Vil du have en plan skræddersyet til din egen hverdag, kan du tage et hurtigt AI-interview bagefter.",
  },
  {
    q: "Hvorfor spørger I hvad jeg har adgang til?",
    a: "Fordi en plan kun er brugbar hvis den passer til dit miljø. Er du låst til Microsoft Copilot, anbefaler vi kun ting du faktisk kan gøre der. Har du en fri stak (ChatGPT, Claude, automatiseringsværktøjer), åbner planen for flere muligheder.",
  },
];

export default function AiNiveauPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SpAIke AI Proficiency Snapshot",
        url: "https://www.spaike.dk/ai-niveau",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "DKK" },
        provider: { "@type": "Organization", name: "SpAIke", url: "https://www.spaike.dk" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-12">
          <SectionLabel>AI Proficiency Snapshot · beta</SectionLabel>
          <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] tracking-tight max-w-4xl mt-2">
            Hvad er dit AI-niveau, og hvad er dit{" "}
            <em className="italic text-amber-dark">næste skridt?</em>
          </h1>
          <p className="font-serif text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
            Svar på 12 spørgsmål og få dit niveau, dit svageste område og en konkret
            step-by-step plan til at komme et trin op, tilpasset det du har adgang til på
            arbejdet. Cirka to minutter.
          </p>
          <div className="mt-8">
            <ProficiencyTest />
          </div>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>De fire niveauer</SectionLabel>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mt-6">
            {[
              ["Den Nysgerrige", "Du er godt i gang, men bruger AI usystematisk og manuelt."],
              ["Den Daglige bruger", "AI er en fast hjælper, men stadig manuelt, én ting ad gangen."],
              ["Workflow-byggeren", "Du har bygget AI ind i dine arbejdsgange. Næste skridt er at få det til at køre selv."],
              ["Agent-orkestratoren", "Du er blandt de få der får AI til at arbejde for dig."],
            ].map(([t, b], i) => (
              <div key={t} className="flex flex-col gap-2">
                <p className="font-mono text-[11px] tracking-wider uppercase text-amber-dark">
                  Niveau {i + 1}
                </p>
                <h3 className="font-serif text-xl font-medium leading-tight">{t}</h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-14">
          <SectionLabel>Spørgsmål & svar</SectionLabel>
          <div className="mt-6 max-w-3xl space-y-7">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="font-serif text-lg font-medium">{f.q}</h3>
                <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";

/*
 * UDKAST (2026-11-05): samlet ydelses-hub, så nye ydelser bliver et kort,
 * ikke et nyt menupunkt. Tre trin efter kunderejsen (afklaring → kom i gang
 * selv → få det bygget) + en tværgående stribe (tilskud + guides).
 *
 * ENDNU IKKE koblet på forside/nav. Når strukturen er godkendt:
 *   - tilføj ét nav-punkt "Ydelser" → /ydelser i Header.tsx
 *   - afgør om "Hvad vi bygger" + "Byg selv" på forsiden skal pege herind
 *     eller blive som de er
 *   - overvej en /field-notes-indexside som "Viden"-hjem (findes ikke i dag)
 */

export const metadata: Metadata = {
  title: "Ydelser | SpAIke",
  description:
    "SpAIkes ydelser, fra afklaring til bygget løsning: AI-tjek, Discovery, hands-on Copilot-træning, AI-innovationsdag og AI-automation. Plus tilskud der kan betale op til halvdelen.",
  alternates: { canonical: "/ydelser" },
  openGraph: {
    title: "Ydelser | SpAIke",
    description:
      "Fra afklaring til bygget løsning: AI-tjek, Discovery, Copilot-træning, AI-innovationsdag og AI-automation.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/ydelser",
    images: [{ url: "/og/spaike-default.png", width: 1200, height: 630, alt: "SpAIke ydelser" }],
  },
};

interface Offering {
  title: string;
  body: string;
  href: string;
  cta: string;
  event: string;
  external?: boolean;
}

const tiers: { n: string; label: string; heading: string; intro: string; items: Offering[] }[] = [
  {
    n: "01",
    label: "Trin 1 · Afklaring",
    heading: "Find ud af hvor I står",
    intro:
      "Lav forpligtelse. Start her hvis I vil have et billede af, hvor AI reelt flytter noget hos jer, før I beslutter noget.",
    items: [
      {
        title: "AI-tjek",
        body: "Kan AI-søgning overhovedet finde og anbefale jer? Indtast jeres webadresse og få en AI-parathedsscore på ti sekunder. Gratis, dansk, ingen konto.",
        href: "/ai-tjek",
        cta: "Tag tjekket",
        event: "ydelser-ai-tjek",
      },
      {
        title: "Discovery",
        body: "48 timers klarhed. Jeg starter med jeres strategiske mål, interviewer 3 til 5 medarbejdere, og leverer en prioriteret handlingsplan for hvor AI kan frigøre ressourcer.",
        href: "/#discovery",
        cta: "Se Discovery",
        event: "ydelser-discovery",
      },
    ],
  },
  {
    n: "02",
    label: "Trin 2 · Kom i gang selv",
    heading: "I lærer og bygger, med mig ved siden",
    intro:
      "Enablement. Her får jeres folk hands-on erfaring og en metode, så de kan bygge videre selv bagefter.",
    items: [
      {
        title: "Hands-on Copilot-træning",
        body: "Tre timer, hands-on, på jeres egne opgaver. Folk bygger deres første agenter og lærer metoden, så de selv kan sætte flere op bagefter. Ikke en demo.",
        href: "/field-notes/hands-on-copilot-training",
        cta: "Se forløbet",
        event: "ydelser-copilot-training",
      },
      {
        title: "AI-innovationsdag",
        body: "Ét problem, ét lille team, én dag, og en fungerende løsning I selv har bygget. Med mig som sparringspartner, eller kør den selv med den gratis guide.",
        href: "/ai-innovationsdag",
        cta: "Se dagen",
        event: "ydelser-innovationsdag",
      },
    ],
  },
];

const buildCategories = [
  "AI på indbakker, chatbots og voice agents, når kundeservice ikke kan følge med.",
  "CRM-automation, pitch-assistenter og lead-routing, så sælgerne bruger tiden på kunder.",
  "Søgning i jeres egen dokumentation, automatisk sagsoprettelse og intern AI-assistent.",
  "Workflow-automation og end-to-end flows, når processer kører manuelt.",
];

export default function YdelserPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-10">
          <SectionLabel>Ydelser</SectionLabel>
          <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] tracking-tight max-w-4xl mt-2">
            Fra afklaring til{" "}
            <em className="italic text-amber-dark">bygget løsning.</em>
          </h1>
          <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
            Det meste starter med at finde ud af, hvor AI reelt flytter noget, og
            ender et sted mellem at I bygger selv og at jeg bygger det for jer.
            Her er ydelserne i den rækkefølge, de typisk bruges.
          </p>
        </section>

        {/* TRIN 1 + 2 */}
        {tiers.map((tier) => (
          <section key={tier.n}>
            <DoubleRule />
            <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
              <SectionLabel>{tier.label}</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
                {tier.heading}
              </h2>
              <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
                {tier.intro}
              </p>
            </div>
            <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 border-t border-rule">
              {tier.items.map((o, i) => (
                <a
                  key={o.title}
                  href={o.href}
                  data-track-event="ydelser_click"
                  data-track-target={o.event}
                  className={`group px-6 md:px-9 py-9 flex flex-col gap-3.5 min-h-[220px] no-underline hover:bg-cream-deep transition-colors ${
                    i === 1 ? "border-t md:border-t-0 md:border-l border-rule" : ""
                  }`}
                >
                  <h3 className="font-serif text-2xl font-medium leading-[1.15] text-ink">
                    {o.title}
                  </h3>
                  <p className="font-sans text-[14px] leading-relaxed text-ink-soft">
                    {o.body}
                  </p>
                  <span className="mt-auto font-mono text-[11px] tracking-wider uppercase text-ink group-hover:text-amber-dark transition-colors">
                    {o.cta} →
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* TRIN 3 · FAA DET BYGGET */}
        <section>
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>Trin 3 · Få det bygget</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              Jeg leverer løsningen
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
              Når retningen er klar, bygger jeg AI-automationen aligned med jeres
              strategiske mål. Hvad det bliver, afhænger af jeres Discovery og
              jeres prioriteter.
            </p>
          </div>
          <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 border-t border-rule">
            {buildCategories.map((c, i) => (
              <div
                key={c}
                className={`px-6 md:px-9 py-7 flex gap-4 ${
                  i > 0 ? "border-t border-rule" : ""
                } ${i % 2 === 1 ? "md:border-l" : ""} ${i === 1 ? "md:border-t-0" : ""}`}
              >
                <span className="font-mono text-[11px] text-amber-dark tracking-wider pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-[14.5px] leading-relaxed text-ink">
                  {c}
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-8">
            <a
              href="/#discovery"
              data-track-event="ydelser_click"
              data-track-target="ydelser-byg-discovery"
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Start med en Discovery →
            </a>
          </div>
        </section>

        {/* TVAERGAAENDE: tilskud + guides */}
        <section>
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>På tværs</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              To ting der gælder hele vejen
            </h2>
          </div>
          <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 border-t border-rule">
            <a
              href="/tilskud"
              data-track-event="ydelser_click"
              data-track-target="ydelser-tilskud"
              className="group px-6 md:px-9 py-9 flex flex-col gap-3.5 min-h-[200px] no-underline hover:bg-cream-deep transition-colors"
            >
              <div className="font-mono text-[11px] text-amber-dark tracking-wider">
                Finansiering
              </div>
              <h3 className="font-serif text-2xl font-medium leading-[1.15] text-ink">
                Tilskud kan betale op til halvdelen
              </h3>
              <p className="font-sans text-[14px] leading-relaxed text-ink-soft">
                Tjek på fem til ti minutter, om I kan søge SMV:Digitals
                rådgivertilskud til AI og automatisering (50 %, op til 150.000
                kr.). Flere af ydelserne ovenfor kan lægges ind under det.
              </p>
              <span className="mt-auto font-mono text-[11px] tracking-wider uppercase text-ink group-hover:text-amber-dark transition-colors">
                Tag tilskudstjekket →
              </span>
            </a>
            <div className="px-6 md:px-9 py-9 flex flex-col gap-3.5 min-h-[200px] border-t md:border-t-0 md:border-l border-rule">
              <div className="font-mono text-[11px] text-amber-dark tracking-wider">
                Viden og guides
              </div>
              <h3 className="font-serif text-2xl font-medium leading-[1.15] text-ink">
                Field notes og guides
              </h3>
              <p className="font-sans text-[14px] leading-relaxed text-ink-soft">
                Jeg deler løbende guides og field notes I kan bruge selv, fx{" "}
                <a
                  href="/field-notes/hands-on-copilot-training"
                  className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
                >
                  hands-on Copilot-træning
                </a>{" "}
                og{" "}
                <a
                  href="/field-notes/vibe-coding-guide"
                  className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
                >
                  guiden til vibe coding-værktøjer
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-16">
            <div className="bg-ink text-cream px-8 md:px-12 py-12 rounded">
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
                Ikke sikker på hvor I skal starte?
              </div>
              <h2 className="font-serif font-medium text-[28px] md:text-[36px] leading-[1.2] text-cream mb-5 max-w-2xl">
                Tag en kort snak, så finder vi det rigtige sted at begynde
              </h2>
              <a
                href="https://calendly.com/michael-spaike/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="book_moede_click"
                data-umami-event-location="ydelser"
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
              >
                Book et møde →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

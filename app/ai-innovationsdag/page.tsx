import type { Metadata } from "next";
import Logo from "../components/Logo";
import DiscoveryTool from "./_components/DiscoveryTool";
import ValueAccordion from "./_components/ValueAccordion";

export const metadata: Metadata = {
  title: "AI-innovationsdag: byg en løsning på ét problem på én dag | SpAIke",
  description:
    "En AI-innovationsdag: et lille team bygger en rigtig løsning på ét konkret problem på én dag med vibe coding. Brug det gratis værktøj til at finde og skærpe jeres case.",
  alternates: { canonical: "https://www.spaike.dk/ai-innovationsdag" },
  openGraph: {
    title: "AI-innovationsdag: fra problem til prototype på én dag",
    description:
      "Find en god case fra jeres egen hverdag, og se konkret hvad vi kan bygge sammen på en dag.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/ai-innovationsdag",
  },
};

const AGENDA: { time: string; label: string }[] = [
  { time: "09:00", label: "Velkomst + intro til vibe coding" },
  { time: "09:45", label: "Problem-framing: teamet skærper casen" },
  { time: "10:15", label: "Byg-session 1 (løbende sparring)" },
  { time: "12:00", label: "Frokost" },
  { time: "12:45", label: "Byg-session 2" },
  { time: "15:00", label: "Test & færdiggør" },
  { time: "15:45", label: "Demo" },
  { time: "16:15", label: "Næste skridt: hvordan kommer det i drift" },
  { time: "16:30", label: "Tak" },
];

const REQUIREMENTS: string[] = [
  "3-4 personer der deler ét konkret problem",
  "Et reelt, aktuelt problem, ikke hypotetisk",
  "Én afgrænset problemstilling, lille nok til at vi kan bygge noget på én dag (brug værktøjet nedenfor til at finde et par gode kandidater)",
  "Software- eller automatiserings-formet (ikke hardware)",
  "Ledelsens opbakning + deltagerne fri fra daglige opgaver den dag",
  "Adgang til vibe coding-værktøjer + API-adgang til relevante systemer",
  "Adgang til relevant data (jeg laver gerne syntetisk data, så følsomt ikke røres)",
  "Laptops + internet",
];

const FOR_FORRETNINGEN: { titel: string; tekst: string }[] = [
  {
    titel: "En konkret intern succescase",
    tekst:
      "I går fra dagen med en fungerende prototype på et problem I selv kender. Ikke en abstrakt demo, men beviset på at det kan lade sig gøre hos jer.",
  },
  {
    titel: "AI-kompetencen spredes ud i huset",
    tekst:
      "Forståelsen sidder ikke længere kun hos IT. I får mennesker på tværs af funktioner der kan drive forandringen indefra bagefter.",
  },
  {
    titel: "Problemer og talent kommer frem",
    tekst:
      "Når folk fra forskellige funktioner bygger sammen, brydes siloerne, og I ser hvor de reelle muligheder og kræfter ligger.",
  },
  {
    titel: "En kvalificeret vej videre",
    tekst:
      "Efter dagen ved I præcis hvad der er værd at bygge videre på og automatisere. I gætter ikke længere.",
  },
];

const FOR_DELTAGERNE: { titel: string; tekst: string }[] = [
  {
    titel: "Den tekniske barriere falder",
    tekst:
      "Den største bremse for AI er ofte troen på at det er for svært at lære. En dag med hænderne i værktøjet fjerner den følelse for folk der aldrig har prøvet det.",
  },
  {
    titel: "De forstår hvad AI faktisk kan",
    tekst:
      "Ikke hvad de har hørt det kan, men hvad de selv har set virke. Det flytter folk fra usikkerhed til handlekraft.",
  },
  {
    titel: "En ny måde at tænke på",
    tekst:
      "Når man selv har bygget noget, begynder man at se muligheder overalt. Deltagerne bliver ambassadører for forandringen, ikke skeptikere.",
  },
  {
    titel: "Færdigheder de tager med",
    tekst:
      "De konkrete greb fra dagen følger med tilbage i hverdagen og bruges på de næste opgaver.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
      {children}
    </p>
  );
}

export default function Page() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-rule no-print">
        <div className="max-w-content mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6">
          <a href="/" aria-label="SpAIke" className="flex items-baseline gap-3.5">
            <Logo size="md" />
            <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-muted">
              AI advisory
            </span>
          </a>
          <div className="flex items-center gap-5">
            <a
              href="/ai-innovationsdag/ideer"
              className="hidden sm:inline font-mono text-[11px] tracking-widest uppercase text-ink-soft hover:text-amber-dark transition-colors"
            >
              Idékatalog
            </a>
            <a
              href="#kontakt"
              className="hidden sm:inline font-mono text-[11px] tracking-widest uppercase text-ink-soft hover:text-amber-dark transition-colors"
            >
              Kontakt
            </a>
            <a
              href="#vaerktoej"
              className="bg-ink text-cream px-4 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
            >
              Find din case →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-content mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-14">
        <div className="max-w-2xl">
          <SectionLabel>AI-innovationsdag</SectionLabel>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.08] text-ink mb-6">
            Et problem. Ét team. Én dag.{" "}
            <span className="italic">En løsning I kan se virke.</span>
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-5">
            Vibe coding har gjort det muligt at bygge rigtige løsninger på timer, ikke måneder.
            Men det skal nå ud til de kommercielle folk, ikke kun udviklerne. En AI-innovationsdag
            åbner den dør: et lille team tager ét konkret problem fra jeres hverdag og bygger en
            fungerende prototype på én dag.
          </p>
          <p className="text-lg text-ink-soft leading-relaxed mb-8">
            Det starter med at finde den rigtige case. Det hjælper værktøjet herunder jer med, og
            I går fra det med en brugbar brief uanset hvad.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <a
              href="#vaerktoej"
              className="inline-block bg-ink text-cream px-6 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors text-center"
            >
              Find din case →
            </a>
            <a
              href="/ai-innovationsdag/ideer"
              className="inline-block border border-ink text-ink px-6 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors text-center"
            >
              Se idékataloget
            </a>
          </div>
          <p className="text-[14px] text-muted mt-5">
            Klar til at booke dagen, eller vil I bare høre mere?{" "}
            <a href="#kontakt" className="text-amber-dark underline">
              Tag fat i mig her
            </a>
            .
          </p>
        </div>
      </section>

      {/* Hvad er det — afklaring */}
      <section className="border-t border-rule bg-cream-deep">
        <div className="max-w-content mx-auto px-6 md:px-12 py-10">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-2">
              Hvad er en AI-innovationsdag?
            </p>
            <p className="text-[15px] text-ink-soft leading-relaxed">
              Kært barn har mange navne. Nogle kalder det et hackathon. Kort sagt er det én dag,
              hvor et lille team fra jeres egen virksomhed bygger en fungerende løsning på ét
              konkret problem, med AI-værktøjer og hands-on sparring fra mig. Ingen kodebaggrund
              nødvendig. I går fra dagen med en fungerende prototype, I kan se virke, og en helt ny
              fornemmelse for hvad I selv kan bygge. Vil I køre den selv, har jeg lavet en{" "}
              <a href="/ai-innovationsdag/guide" className="text-amber-dark underline">
                gratis guide til hele dagen
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Hvorfor — værdi */}
      <section className="border-t border-rule">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16">
          <SectionLabel>Hvorfor en AI-innovationsdag</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4 max-w-2xl">
            Den hurtigste vej fra <span className="italic">&laquo;AI er svært&raquo;</span> til{" "}
            <span className="italic">&laquo;det kan vi godt&raquo;</span>
          </h2>
          <p className="text-lg text-ink-soft leading-relaxed mb-12 max-w-2xl">
            At sætte 4-5 mennesker af en hel dag skal kunne betale sig. Det gør det, fordi I ikke
            kun løser ét problem. I åbner en helt ny måde at arbejde på, og I gør det på et problem
            der betyder noget for jer.
          </p>

          <ValueAccordion
            groups={[
              { label: "For forretningen", items: FOR_FORRETNINGEN },
              { label: "For dem der deltager", items: FOR_DELTAGERNE },
            ]}
          />

          <p className="font-serif text-xl md:text-2xl text-ink leading-snug italic mt-12 max-w-3xl border-t border-rule pt-8">
            Resultatet er ikke en rapport der samler støv. Det er en løsning I kan se virke, et team
            der har prøvet det på egen krop, og en ny tro på hvad I selv kan bygge.
          </p>
        </div>
      </section>

      {/* Idékatalog-teaser */}
      <section className="border-t border-rule">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16">
          <div className="max-w-2xl">
            <SectionLabel>Idékatalog</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">
              Brug for inspiration? Se hvad andre har bygget
            </h2>
            <p className="text-lg text-ink-soft leading-relaxed mb-7">
              Det sværeste er ofte at se hvad der overhovedet er muligt. Jeg har samlet konkrete
              cases, som kommercielle teams kan bygge på en dag, på tværs af salg, RevOps,
              marketing, customer success og onboarding.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Salg", "RevOps", "Marketing", "Customer Success", "Onboarding", "Internt & data"].map(
              (c) => (
                <span
                  key={c}
                  className="font-mono text-[11px] tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-rule text-ink-soft"
                >
                  {c}
                </span>
              ),
            )}
          </div>
          <a
            href="/ai-innovationsdag/ideer"
            className="inline-block bg-ink text-cream px-6 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
          >
            Se idékataloget →
          </a>
        </div>
      </section>

      {/* Sådan kører en dag */}
      <section className="border-t border-rule bg-cream-deep">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16">
          <SectionLabel>Sådan kører en AI-innovationsdag</SectionLabel>
          <h2 className="font-serif text-3xl text-ink leading-tight mb-8 max-w-2xl">
            Transparent fra start til slut
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10">
            <div className="border border-rule rounded bg-cream p-6">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
                Før dagen (1-2 uger før)
              </p>
              <ul className="space-y-3 text-[15px] text-ink-soft leading-relaxed">
                <li>Problemet defineres via værktøjet herunder.</li>
                <li>Team på 3-4 vælges, med den der ejer problemet.</li>
                <li>
                  Data og adgang klargøres. Jeg laver et syntetisk datasæt i samme form som jeres
                  rigtige data, så vi ikke rører følsomt på dagen.
                </li>
              </ul>
            </div>

            <div className="border border-rule rounded bg-cream p-6">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
                Selve dagen
              </p>
              <ul className="space-y-2">
                {AGENDA.map((a) => (
                  <li key={a.time} className="flex gap-4 text-[14px]">
                    <span className="font-mono text-amber-dark shrink-0 w-12">{a.time}</span>
                    <span className="text-ink">{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Forberedelse */}
      <section className="border-t border-rule">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16">
          <SectionLabel>Sådan forbereder I jer</SectionLabel>
          <h2 className="font-serif text-3xl text-ink leading-tight mb-3 max-w-2xl">
            Hvad der skal til for at en dag flyver
          </h2>
          <p className="text-ink-soft leading-relaxed mb-8 max-w-2xl">
            Det er ikke gatekeeping, det er readiness. Jo flere af disse I har på plads, jo mere
            får I ud af dagen.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="flex gap-3 text-[15px] text-ink leading-relaxed">
                <span className="text-amber-dark mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Værktøjet (centerpiece) */}
      <section id="vaerktoej" className="border-t border-rule bg-cream-deep scroll-mt-20">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16 md:py-20">
          <DiscoveryTool />
        </div>
      </section>

      {/* Kontakt / book dagen */}
      <section id="kontakt" className="border-t border-rule bg-ink scroll-mt-20">
        <div className="max-w-content mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-widest uppercase text-amber mb-3">
              Skal vi holde den hos jer?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-5">
              Book en uforpligtende snak om jeres AI-innovationsdag
            </h2>
            <p className="text-lg text-cream/85 leading-relaxed mb-8">
              30 minutter, hvor vi vender jeres situation: har I en oplagt case, hvem skal
              med på dagen, og giver formatet mening for jer. I får min ærlige vurdering,
              også hvis svaret er, at I skal starte et andet sted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <a
                href="https://calendly.com/michael-spaike/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="book_moede_click"
                data-umami-event-location="ai-innovationsdag-kontakt"
                className="inline-block bg-amber text-ink px-6 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-amber-dark hover:text-cream transition-colors text-center"
              >
                Book en snak →
              </a>
              <a
                href="mailto:michael@spaike.dk?subject=AI-innovationsdag"
                data-umami-event="email_click"
                data-umami-event-location="ai-innovationsdag-kontakt"
                className="inline-block border border-cream text-cream px-6 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-cream hover:text-ink transition-colors text-center"
              >
                Skriv til mig
              </a>
            </div>
            <p className="font-mono text-[11px] tracking-wider text-cream/60 mt-6">
              Ikke klar endnu? Brug værktøjet ovenfor og få en gratis case-brief først.
            </p>
          </div>
        </div>
      </section>

      {/* Footer + privatlivsnote */}
      <footer id="privatliv" className="border-t border-rule no-print">
        <div className="max-w-content mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10">
            <div>
              <Logo size="md" />
              <p className="font-serif italic text-base text-ink-soft leading-snug mt-4 max-w-sm">
                Commercial impact, drevet af{" "}
                <span className="not-italic font-sans font-bold text-amber">AI</span>.
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted mt-4">
                Drevet af SpAIke ApS
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
                Privatliv
              </p>
              <p className="text-[13px] text-ink-soft leading-relaxed max-w-md">
                Jeg gemmer kun det nødvendige: dit navn, din mail og samtalen, så jeg kan hjælpe dig
                videre. Data ligger EU-hosted. Jeg deler det ikke med tredjepart og bruger det ikke
                til andet. Vil du have dine data slettet, så skriv til{" "}
                <a
                  href="mailto:michael@spaike.dk"
                  className="text-amber-dark underline"
                  data-umami-event="email_click"
                >
                  michael@spaike.dk
                </a>
                .
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-rule flex justify-between font-mono text-[10px] tracking-widest uppercase text-muted">
            <span>© {new Date().getFullYear()} SpAIke ApS</span>
            <a href="/" className="hover:text-amber-dark transition-colors">
              spaike.dk
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

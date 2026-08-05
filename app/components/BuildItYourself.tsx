import { SectionLabel, DoubleRule } from "./EditorialUI";

const entries = [
  {
    n: "01",
    title: "Vælg det rigtige værktøj",
    body: "Guiden til de fem største vibe coding-værktøjer, skrevet i almindeligt dansk til folk uden teknisk baggrund. Baseret på 20+ uafhængige tests: hvad de kan, hvad de koster, og hvor du skal starte.",
    href: "/field-notes/vibe-coding-guide",
    cta: "Læs guiden",
    event: "byg-selv-guide",
  },
  {
    n: "02",
    title: "Find ud af hvad I skal bygge",
    body: "17 konkrete idéer, kommercielle teams kan bygge på en dag, fra mødeforberedelse til tilbudsbygger. Eller chat med case-finderen og få et bud skræddersyet til jeres hverdag.",
    href: "/ai-innovationsdag/ideer",
    cta: "Se idékataloget",
    event: "byg-selv-idekatalog",
  },
  {
    n: "03",
    title: "Byg det sammen på én dag",
    body: "En AI-innovationsdag: ét problem, ét lille team, én dag, og en fungerende løsning I selv har bygget. Med mig som sparringspartner, eller kør den selv med den gratis guide.",
    href: "/ai-innovationsdag",
    cta: "Se AI-innovationsdagen",
    event: "byg-selv-innovationsdag",
  },
];

export default function BuildItYourself() {
  return (
    <section id="byg-selv">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel>Byg selv med AI</SectionLabel>
        <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight max-w-4xl">
          I kan bygge mere selv,{" "}
          <em className="italic font-normal">end I tror.</em>
        </h2>
        <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
          Vibe coding har gjort det muligt at bygge rigtige værktøjer uden at
          kunne kode: beskriv hvad du vil have, og se det blive bygget. Jeg har
          samlet det, der skal til for at komme godt i gang, fra værktøjsvalg
          til den første byggedag.
        </p>
      </div>

      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-3 border-t border-rule">
        {entries.map((e, i) => (
          <a
            key={e.n}
            href={e.href}
            data-track-event="byg_selv_click"
            data-track-target={e.event}
            className={`group px-6 md:px-7 py-8 flex flex-col gap-3.5 min-h-[240px] no-underline hover:bg-cream-deep transition-colors ${
              i > 0 ? "border-t md:border-t-0 md:border-l border-rule" : ""
            }`}
          >
            <div className="font-mono text-[11px] text-amber-dark tracking-wider">
              {e.n}
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-medium leading-[1.15] text-ink">
              {e.title}
            </h3>
            <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">
              {e.body}
            </p>
            <span className="mt-auto font-mono text-[11px] tracking-wider uppercase text-ink group-hover:text-amber-dark transition-colors">
              {e.cta} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i transport — SpAIke",
  description:
    "Tallene og de navngivne cases. Hvad transportvirksomheder som C.H. Robinson faktisk har opnået med AI, kildebelagt og med vægt på den kommercielle side: tilbud, forespørgsler og udbud.",
  openGraph: {
    title: "AI i transport — tallene og de firmaer der allerede gør det",
    description:
      "Kildebelagte tal (Penske, Descartes) og navngivne cases med konkrete resultater (C.H. Robinson, Uber Freight) om AI i transport og logistik.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-transport",
  },
  twitter: {
    card: "summary",
    title: "AI i transport — tallene og de firmaer der allerede gør det",
    description:
      "Kildebelagte tal og navngivne cases med konkrete resultater om AI i transport og logistik.",
  },
};

export default function AiITransport() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / AI i transport</span>
        <span className="text-amber-dark">4&nbsp;min</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        AI i transport:{" "}
        <em className="italic font-medium text-amber-dark">
          tallene, og de firmaer der allerede gør det
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke endnu et &ldquo;AI er fremtiden&rdquo;-oplæg. Her er de tal og de
        navngivne cases, der faktisk er dokumenteret i branchen, med kilder du
        selv kan klikke på. Med vægt på den kommercielle side: tilbud,
        forespørgsler og udbud.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>
          Kilder: Penske Transportation Leaders Survey · Descartes · Forbes ·
          C.H. Robinson · Uber Freight
        </span>
        <span>
          AI-automatisering for danske virksomheder, af{" "}
          <a
            href="https://spaike.dk"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            SpAIke
          </a>
        </span>
      </div>

      {/* LEDE */}
      <section className="lede">
        <p className="mb-[18px] first-letter:font-serif first-letter:text-[64px] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1 first-letter:mr-2 first-letter:-mb-1 first-letter:text-amber-dark">
          Det korte svar fra tallene: AI er ikke længere et forspring i
          transport, det er ved at blive udgangspunktet. Syv ud af ti
          transportvirksomheder bruger det nu, en firedobling på ét år. Men de
          fleste er stadig kun delvist automatiserede, og 84% mener selv, de
          sakker bagud. Vinduet for at komme foran er stadig åbent, især for de
          mellemstore.
        </p>
      </section>

      {/* ============ TALLENE ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Tallene</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          AI er gået fra forspring til udgangspunkt
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              70%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af transportvirksomheder bruger nu AI, en firedobling på ét år
              (Penske, 255 transportledere, 2025)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              84%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              mener deres egen branche sakker bagud på AI, op 20 point på ét år.
              Vinduet lukker (Penske)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              40%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af dem der har taget AI i brug ser 50%+ forbedring i brændstof,
              omkostning eller ruteafstand (Penske)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              Kun 17%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              er fuldt automatiserede, selvom 96% bruger generativ AI. Gabet er
              eksekvering, ikke vilje (Descartes)
            </div>
          </div>
        </div>

        <p className="mb-[18px]">
          Tallene kommer fra to navngivne undersøgelser: Penskes 2025
          Transportation Leaders Survey blandt 255 transport- og
          logistikledere, og Descartes&rsquo; årlige globale benchmark blandt
          over 600 afskibere og logistikoperatører. Billedet er det samme i
          begge: næsten alle er i gang, men meget få er færdige. De mest
          udbredte anvendelser er ikke science fiction, men det administrative
          arbejde der spiser dagen, dataindtastning, rute- og lastoptimering og
          fragtprognoser.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Tre firmaer, tre konkrete resultater
        </h2>

        {[
          {
            n: "1",
            title:
              "C.H. Robinson: fra 65% til 100% af tilbud, besvaret på cirka 30 sekunder",
            body: "Verdens største fragtformidler satte en flåde af AI-agenter på indkommende forespørgsler. De gik fra at nå 65% af tilbuddene til at svare på dem alle, døgnet rundt, på cirka 30 sekunder, mod op til fire timer i mail-køen før. Resultatet er 40% flere forsendelser pr. medarbejder siden 2022, og over en million tilbud og en million ordrer behandlet af AI. Tallene er bekræftet uafhængigt af Forbes, ikke kun i virksomhedens egen pressemeddelelse.",
            src: "Kilde: Forbes (Steve Banker, dec. 2025) · C.H. Robinson pressemeddelelse",
          },
          {
            n: "2",
            title:
              "Et europæisk logistikfirma: tilbud fra dage til minutter",
            body: "Et mellemstort logistikfirma lod AI læse indkommende mail- og PDF-forespørgsler, trække rute, gods og betingelser ud automatisk og lægge dem i kø til hurtig godkendelse. Med over 20.000 tilbudsforespørgsler om året faldt tilbudscyklussen fra dage til minutter. Det er den mest direkte skabelon for en almindelig vognmand: hurtige, konsistente tilbud vinder opgaver, og det kan piloteres på uger.",
            src: "Kilde: Datsugi case study (leverandør-case, klienten er anonym)",
          },
          {
            n: "3",
            title: "Uber Freight: modellér bud-strategier på minutter, ikke uger",
            body: "Uber Freight kører 30+ AI-agenter over hele forsendelsens livscyklus, fra indkøb og prissætning til tracking og afregning, og har kørt over 1,6 mia. USD fragt gennem AI-infrastrukturen på ét år. Deres udbudsværktøj modellerer flere bud-strategier side om side på minutter i stedet for uger. Relevant for enhver der byder på tilbagevendende kørsel og entreprenør-udbud.",
            src: "Kilde: Uber Freight newsroom (virksomhedens egne tal)",
          },
        ].map((c) => (
          <div key={c.n} className="border-l-[3px] border-amber px-5 py-4 my-7">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm font-mono text-[10px]">
                {c.n}
              </span>
              <h3 className="font-sans font-semibold text-[17px] text-ink">
                {c.title}
              </h3>
            </div>
            <p className="text-[16px] mb-2.5">{c.body}</p>
            <div className="font-mono text-[11px] tracking-wider text-muted">
              {c.src}
            </div>
          </div>
        ))}

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-9 pl-7 border-l-2 border-ink">
          Det spændende er ikke, at AI kan køre en lastbil. Det er, at den kan
          fjerne timerne omkring kørslen: tilbuddene, forespørgslerne og
          papirgangen, så folkene bruger tiden på kunderne og opgaverne.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Én proces i drift, ikke en total omlægning
        </h2>
        <p className="mb-[18px]">
          De virksomheder det lykkes for, kaster sig ikke ud i alt på én gang. De
          tager én afgrænset proces, ofte hurtige svar på indkommende
          forespørgsler eller automatiske tilbud på tilbagevendende kørsel, kører
          den i drift, måler hvad den flytter, og bygger derfra. Og fordi kun 17%
          er fuldt automatiserede, er der en reel fordel i at komme foran nu,
          mens de fleste stadig kun er delvist i gang.
        </p>
      </section>

      {/* ============ MIN HOLDNING ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Min holdning</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          AI er infrastruktur, ikke magi
        </h2>
        <p className="mb-[18px]">
          Jeg leder med ROI, ikke med hype. Nogle ting egner sig glimrende til
          automatisering i en transportvirksomhed, andre gør ikke, og jeg siger{" "}
          &ldquo;det duer ikke her&rdquo; lige så tit som &ldquo;det kan vi
          løse&rdquo;. Pointen er at finde de få steder, hvor det frigør reelle
          timer eller vinder flere opgaver, og starte der.
        </p>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Er noget af det relevant for jer?
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Vil I finde jeres egne tidsrøvere?
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Jeg viser gerne konkret, hvordan hurtige tilbud,
          forespørgsels-håndtering og udbudsovervågning ser ud i praksis, eller
          sparrer på, hvor AI giver mening for netop jeres transportforretning.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-ai-i-transport"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book et kort møde →
          </a>
          <a
            href="https://spaike.dk"
            data-track-event="field_note_closer_more_click"
            data-track-article="ai-i-transport"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Mere fra SpAIke
          </a>
        </div>
      </div>

      {/* ============ KILDER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        <div className="uppercase text-amber-dark mb-3">Kilder</div>
        <ul className="list-none p-0 m-0 space-y-2.5 normal-case tracking-normal text-[12px] leading-[1.55]">
          <li>
            <a
              href="https://www.truckinginfo.com/10241279/ai-in-logistics-penske-survey-uncovers-surging-adoption-rising-concerns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Penske 2025 Transportation Leaders Survey
            </a>
            : 70% bruger AI (firedoblet på ét år), 84% mener de sakker bagud, 40%
            ser 50%+ forbedring.
          </li>
          <li>
            <a
              href="https://www.thescxchange.com/tech-infrastructure/technology/annual-survey-shows-widespread-adoption-of-generative-ai-in-transportation-operations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Descartes / SAPIO, Global Transportation Benchmark Survey 2025
            </a>
            : 96% bruger generativ AI, men kun 17% er fuldt automatiserede.
          </li>
          <li>
            <a
              href="https://www.forbes.com/sites/stevebanker/2025/12/03/ch-robinson-capitalizes-on-ai-to-grow-market-share-and-reduce-costs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Forbes, Steve Banker (dec. 2025)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.chrobinson.com/en-us/about-us/newsroom/press-releases/2025/ai-performs-over-three-million-shipping-tasks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              C.H. Robinson pressemeddelelse
            </a>
            : 100% af tilbud på ~30 sek., 40% flere forsendelser pr. medarbejder
            siden 2022.
          </li>
          <li>
            <a
              href="https://datsugi.com/case-studies/ai-agent-quoting-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Datsugi, AI-agent quoting tool case study
            </a>
            : logistikfirma med 20.000+ forespørgsler/år, tilbud fra dage til
            minutter (leverandør-case).
          </li>
          <li>
            <a
              href="https://www.uberfreight.com/en-US/newsroom/uber-freight-launches-industry-first-ai-logistics-network-at-scale-ushering"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Uber Freight newsroom
            </a>
            : 30+ AI-agenter, 1,6 mia. USD fragt gennem AI-infrastrukturen,
            udbudsværktøj.
          </li>
          <li>
            <a
              href="https://www.mckinsey.com/industries/industrials/our-insights/distribution-blog/harnessing-the-power-of-ai-in-distribution-operations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              McKinsey, Harnessing the power of AI in distribution operations
            </a>
            : 5-20% lavere logistikomkostninger som ramme, ikke løfte.
          </li>
        </ul>
        <div className="mt-6">
          Kurateret for danske transportvirksomheder af{" "}
          <a
            href="https://spaike.dk"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            SpAIke
          </a>{" "}
          · Commercial impact, drevet af AI.
        </div>
      </footer>
    </article>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i transport — SpAIke",
  description:
    "Hvad tallene viser, og hvem der allerede gør det. Kildebelagte tal og navngivne cases om AI i transport og logistik, med vægt på den kommercielle side: tilbud, forespørgsler og udbud.",
  openGraph: {
    title: "AI i transport — hvad tallene viser, og hvem der allerede gør det",
    description:
      "Kildebelagte tal (Descartes, McKinsey) og navngivne cases (C.H. Robinson, Uber Freight, DSV) om AI i transport, kurateret for danske transportvirksomheder.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-transport",
  },
  twitter: {
    card: "summary",
    title: "AI i transport — hvad tallene viser, og hvem der allerede gør det",
    description:
      "Kildebelagte tal og navngivne cases om AI i transport og logistik, kurateret for danske transportvirksomheder.",
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
          hvad tallene viser, og hvem der allerede gør det
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke endnu et &ldquo;AI er fremtiden&rdquo;-oplæg. Her er de tal og
        navngivne cases, der faktisk er dokumenteret i branchen, med kilder du
        selv kan klikke på. Med vægt på den kommercielle side: tilbud,
        forespørgsler og udbud.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>
          Kilder: Descartes Transportation Benchmark · McKinsey · C.H. Robinson
          · Uber Freight · DSV
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
          transport, det er ved at blive udgangspunktet. Men de fleste
          virksomheder er stadig kun delvist automatiserede, og forskellen på de
          bedste og de svageste er enorm. Vinduet for at komme foran er stadig
          åbent, især for de mellemstore.
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
              96%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af transportvirksomheder bruger allerede generativ AI til
              transport management (Descartes, 616 virksomheder NA og EU)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              Kun 3%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af europæiske afskibere og logistikoperatører bruger IKKE AI
              (Descartes European Benchmark)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              17 → 51%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              fuldt automatiserede processer: 17% blandt alle, men 51% hos de
              finansielt bedste, mod 5% hos de svageste. Gabet er eksekvering
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              5-20%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              lavere logistikomkostninger som McKinseys estimat for AI i
              distributionsdrift. En ramme, ikke et løfte
            </div>
          </div>
        </div>

        <p className="mb-[18px]">
          De mest udbredte anvendelser er ikke science fiction, men det
          administrative arbejde der spiser dagen: dataindtastning (41%), rute-
          og lastoptimering (39%), fragtprognoser (35%) og automatisk
          load-matching (35%). Tallene kommer fra Descartes&rsquo; årlige globale
          og europæiske benchmark-undersøgelser blandt afskibere og
          logistikoperatører.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Tre steder det rent faktisk rykker på den kommercielle side
        </h2>

        {[
          {
            n: "1",
            title:
              "C.H. Robinson: mailforespørgsler besvaret på under 90 sekunder",
            body: "Verdens største fragtformidler lod AI-agenter læse indkommende mailforespørgsler, skelne mellem fragttyper og behandle ordren. Over 5.200 kunder får nu deres læs behandlet på under 90 sekunder, mod tidligere op til fire timer i mail-køen. Over en million pristilbud er leveret af AI, og antallet vokser 30% om måneden.",
            src: "Kilde: C.H. Robinson pressemeddelelse marts 2025 · Trucking Dive",
          },
          {
            n: "2",
            title: "Uber Freight: modellér bud-strategier på minutter, ikke uger",
            body: "Uber Freight kører 30+ AI-agenter over hele forsendelsens livscyklus, fra indkøb og prissætning til tracking og afregning. Over 1,6 mia. USD fragt er kørt gennem AI-infrastrukturen på ét år, og deres tender-værktøj modellerer bud-strategier på minutter i stedet for uger. Relevant for enhver der byder på tilbagevendende kørsel og udbud.",
            src: "Kilde: Uber Freight newsroom",
          },
          {
            n: "3",
            title: "DSV: AI i den daglige drift (dansk)",
            body: "DSV bruger dagligt AI til toldbehandling, fakturahåndtering, lastoptimering, ruteplanlægning og prognoser, med tyngde på dokumenthåndtering. Et dansk eksempel på, at det ikke kun er de amerikanske giganter, der er i gang, men at det er blevet driftsstandard i store nordiske transportvirksomheder.",
            src: "Kilde: PwC CXO-magasinet · Transportmagasinet (anvendelses-eksempel, ikke besparelsestal)",
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
            data-umami-event="field_note_closer_more_click"
            data-umami-event-article="ai-i-transport"
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
              href="https://www.thescxchange.com/tech-infrastructure/technology/annual-survey-shows-widespread-adoption-of-generative-ai-in-transportation-operations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Descartes / SAPIO, Global Transportation Benchmark Survey 2025
            </a>
            : 96% generativ AI, 17% vs 51% automatisering, mest udbredte
            anvendelser.
          </li>
          <li>
            <a
              href="https://www.loginext.nl/en/artikelen/descartes-onderzoek-slechts-3-van-de-europese-verladers-en-logistiek-dienstverleners-gebruikt-nog-geen-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Descartes European Transport Management Benchmark Survey 2025
            </a>
            : kun 3% af europæiske operatører bruger ikke AI.
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
            : 5-20% lavere logistikomkostninger.
          </li>
          <li>
            <a
              href="https://www.chrobinson.com/en-us/about-us/newsroom/press-releases/2025/ai-performs-over-three-million-shipping-tasks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              C.H. Robinson pressemeddelelse, marts 2025
            </a>{" "}
            ·{" "}
            <a
              href="https://www.truckingdive.com/news/ch-robinson-ltl-price-quotes-truck-capacity-appointments/745434/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Trucking Dive
            </a>
            : svar under 90 sekunder, 1 mio.+ AI-tilbud.
          </li>
          <li>
            Uber Freight newsroom: 30+ AI-agenter, 1,6 mia. USD fragt,
            tender-værktøj.
          </li>
          <li>
            PwC CXO-magasinet · Transportmagasinet: DSV&rsquo;s AI-anvendelser i
            drift.
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

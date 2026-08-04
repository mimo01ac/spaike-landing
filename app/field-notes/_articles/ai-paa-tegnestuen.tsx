import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI på tegnestuen — SpAIke",
  description:
    "Hvor AI faktisk flytter noget for arkitekter og tegnestuer, og hvor det stadig er støj. Kildebelagte tal og konkrete cases, kurateret for den danske byggebranche.",
  openGraph: {
    title: "AI på tegnestuen — hvad arkitekter faktisk bruger det til",
    description:
      "Kildebelagte tal (RIBA) og konkrete cases (bl.a. en tegnestue i Orlando fra 40 timer til under 4), kurateret for danske arkitekter og tegnestuer.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-paa-tegnestuen",
  },
  twitter: {
    card: "summary",
    title: "AI på tegnestuen — hvad arkitekter faktisk bruger det til",
    description:
      "Kildebelagte tal og konkrete cases om AI for arkitekter og tegnestuer, kurateret for den danske byggebranche.",
  },
};

export default function AiPaaTegnestuen() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / AI i byggeriet</span>
        <span className="text-amber-dark">4&nbsp;min</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        AI på tegnestuen:{" "}
        <em className="italic font-medium text-amber-dark">
          hvad arkitekter faktisk bruger det til
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Jeg arbejder til daglig med automatisering i den danske byggebranche.
        Her er hvad jeg har samlet om, hvor AI reelt flytter noget for
        arkitekter og tegnestuer, og hvor det stadig mest er støj.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · juli 2026</span>
        <span>Kilder: RIBA AI Report 2024/2025 · Autodesk Forma (Baker Barrios) · AIA</span>
        <span>
          Med fødderne i byggebranchen, af{" "}
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
          De sidste to år er AI gået fra &ldquo;spændende at følge&rdquo; til
          noget, tegnestuer faktisk lægger i arbejdsgangen. Men billedet er
          skævt: de store er langt fremme, mens mange mellemstore studier stadig
          kigger på. Det er præcis dér, der er en fordel at hente lige nu.
        </p>
      </section>

      {/* ============ TALLENE ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Tallene</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Adoptionen er tippet på ét år
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              41 → 59%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              Andel af tegnestuer der bruger AI, 2024 til 2025 (RIBA)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              ~48%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              Mindre studier, mod over 80% hos de store. Adoptionen er skæv efter
              størrelse
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              15%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              Har en formel AI-politik. Næsten ingen har styr på data og
              governance endnu
            </div>
          </div>
        </div>

        <p className="mb-[18px]">
          Tallene kommer fra RIBA (Royal Institute of British Architects), den
          britiske arkitektforening, der udgiver en årlig AI-rapport for
          branchen. Den viser, at brugen mere end steg på ét år, og at de mest
          udbredte anvendelser ikke er det spektakulære generative design, men de
          nære ting: tidlig visualisering og at skrive udbuds- og
          bygningsbeskrivelser. Der hvor tiden reelt bliver ædt.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Fire steder det rent faktisk rykker
        </h2>

        {[
          {
            n: "1",
            title: "Tidlig skitse og feasibility",
            body: "En tegnestue i Orlando, Baker Barrios, skalerede brugen af Autodesk Forma (tidligere Spacemaker) og fortæller, at arbejde der før tog 40 timer nu tager fire timer eller mindre. Værktøjet lægger sol, vind og støj ind i skitsen fra start, så man rammer færre dyre rettelser sent i forløbet.",
            src: "Kilde: Autodesk-case (Baker Barrios) via Cadalyst, 2024",
          },
          {
            n: "2",
            title: "Specifikationer og beskrivelser",
            body: "En stor del af indholdet i bygningsbeskrivelser går igen fra sag til sag. AI kan lave et solidt baseline-udkast, så arkitekten bruger tiden på det unikke i projektet i stedet for at genskrive standardteksten. RIBA fremhæver netop specifikationsskrivning som en af de gevinster, der slår hurtigst igennem.",
            src: "Kilde: RIBA AI Report; AIA om AI i specifikationer",
          },
          {
            n: "3",
            title: "Tidlig visualisering",
            body: "Fra idé til stemningsbillede på minutter. Concept-rendering er den mest udbredte AI-anvendelse blandt arkitekter overhovedet, fordi det gør en tidlig dialog med bygherren konkret uden at binde mange timer i et færdigt render.",
            src: "Kilde: RIBA AI Report 2025",
          },
          {
            n: "4",
            title: "Sags- og dokumentautomatisering",
            body: "Det er her jeg selv arbejder. For en dansk rådgiver i byggeriet har jeg bygget en løsning, hvor en komplet sags dokumenter nu genereres på sekunder i deres eget SharePoint, udfyldt i deres egne skabeloner. Det der før var timers manuelt arbejde pr. sag. Det rammer typisk præcis det, en digital-ansvarlig skal levere de første måneder.",
            src: "Kilde: egen leverance (dansk byggerådgiver, 2026)",
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
          Det spændende er ikke, at AI kan tegne. Det er, at den kan fjerne
          timerne omkring tegningen, så arkitekterne bruger tiden på det, kun de
          kan.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Pilot frem for big bang
        </h2>
        <p className="mb-[18px]">
          De studier, det lykkes for, kaster sig ikke ud i en total omlægning.
          De tager én afgrænset proces, som feasibility eller beskrivelser, kører
          den i drift, måler hvad den flytter, og bygger derfra. Og fordi kun
          omkring 15% har en AI-politik, er der en reel fordel i at få styr på
          data, skabeloner og governance tidligt, i stedet for at rydde op
          bagefter.
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
          automatisering i en tegnestue, andre gør ikke, og jeg siger &ldquo;det
          duer ikke her&rdquo; lige så tit som &ldquo;det kan vi løse&rdquo;.
          Pointen er at finde de få steder, hvor det frigør reelle timer, og
          starte der.
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
          Hvis I er ved at bygge den digitale side op, viser jeg gerne konkret,
          hvordan sags- og dokumentautomatisering ser ud i praksis, eller sparrer
          på, hvor AI giver mening for netop jeres tegnestue.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-ai-paa-tegnestuen"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book et kort møde →
          </a>
          <a
            href="https://spaike.dk"
            data-umami-event="field_note_closer_more_click"
            data-umami-event-article="ai-paa-tegnestuen"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Mere fra SpAIke
          </a>
        </div>
      </div>

      {/* ============ ARTICLE FOOTER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        Kilder: RIBA AI Report 2024 og 2025 (Royal Institute of British
        Architects), adoption 41% til 59%, anvendelser og AI-politik.
        <br />
        Autodesk Forma / Baker Barrios Architects (Orlando), 40 timer til under
        4, via Cadalyst og Autodesk case study.
        <br />
        AIA, &ldquo;Six key benefits of AI in specifications&rdquo;, om
        specifikationsautomatisering.
        <br />
        <br />
        Kurateret for den danske byggebranche af{" "}
        <a
          href="https://spaike.dk"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          SpAIke
        </a>{" "}
        · Commercial impact, drevet af AI.
      </footer>
    </article>
  );
}

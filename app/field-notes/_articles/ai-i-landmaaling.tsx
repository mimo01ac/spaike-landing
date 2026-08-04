import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i landmåling — SpAIke",
  description:
    "Tallene og de navngivne firmaer. Hvad landinspektør- og opmålingsvirksomheder som LE34 faktisk har opnået med AI, kildebelagt og med vægt på felt-til-leverance: punktsky, volumen og optegning.",
  openGraph: {
    title: "AI i landmåling — tallene og de firmaer der allerede gør det",
    description:
      "Kildebelagte tal (EAASI, RICS) og navngivne cases (LE34, Langan, Lerch Weber) om AI hos landinspektører og opmålingsvirksomheder.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-landmaaling",
  },
  twitter: {
    card: "summary",
    title: "AI i landmåling — tallene og de firmaer der allerede gør det",
    description:
      "Kildebelagte tal og navngivne cases om AI hos landinspektører og opmålingsvirksomheder.",
  },
};

export default function AiILandmaaling() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / AI i landmåling</span>
        <span className="text-amber-dark">4&nbsp;min</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        AI i landmåling:{" "}
        <em className="italic font-medium text-amber-dark">
          tallene, og de firmaer der allerede gør det
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke endnu et &ldquo;AI er fremtiden&rdquo;-oplæg. Her er de tal og de
        navngivne cases, der faktisk er dokumenteret i branchen, med kilder du
        selv kan klikke på. Med vægt på det der lander hurtigst: felt-til-leverance,
        punktsky og volumen.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>Kilder: EAASI · RICS · Trimble / LE34 · Mach9 · Wingtra</span>
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
          Det korte svar fra tallene: AI er stadig i en tidlig fase i
          opmålingsbranchen, men de førende firmaer bruger det allerede til at
          halvere kontor-timerne efter feltarbejdet. Intenten er høj, den reelle
          brug er lav, og barriererne er praktiske, ikke principielle. Vinduet
          for at komme foran er stadig åbent.
        </p>
      </section>

      {/* ============ TALLENE ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Tallene</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Høj intent, tidlig brug, åbent vindue
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              49%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af geospatiale firmaer kalder AI-databehandling en top
              tech-investeringsprioritet (EAASI-branchesurvey, 2026)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              Kun 12%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              bruger AI regelmæssigt i deres workflows, og kun 1% har skaleret
              det på tværs af projekter (RICS, 2.200+ fagfolk)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              ~70%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              tror AI vil hjælpe dem levere mere værdi. Viljen er der, brugen er
              stadig tidlig (RICS)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              46 / 37 / 30%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              de tre største barrierer: kompetencer, integration og
              datakvalitet. Alt sammen løsbart med den rette hjælp (RICS)
            </div>
          </div>
        </div>

        <p className="mb-[18px]">
          Tallene kommer fra to uafhængige undersøgelser: EAASI&rsquo;s første
          brancheundersøgelse blandt geospatiale virksomheder (2026) og
          RICS&rsquo; AI in Construction 2025 blandt over 2.200 fagfolk, inklusive
          landmålere. Billedet er tydeligt: næsten alle vil investere, men de
          færreste er kommet i gang for alvor. Og barriererne er ikke skepsis,
          men kompetencer, integration og data, altså praktiske ting der kan
          løses.
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
              "LE34 (Danmark, landets største landinspektørfirma): volumen på halvdelen af tiden",
            body: "LE34 lod AI klassificere punktskyer og trække stakke ud automatisk i Trimble Business Center, blandt andet på drone-opmåling af cirka 350 muld-stakke tre gange om året. Den automatiske volumenberegning tager omtrent halvdelen af tiden i forhold til manuelt, og skel kan tegnes med et enkelt klik ved 80 til 90% nøjagtighed. Et navngivet dansk eksempel, ikke en amerikansk gigant.",
            src: "Rapporteret af Trimble (René Bundgaard Christensen, Land Inspector, LE34)",
          },
          {
            n: "2",
            title:
              "Lerch Weber (Schweiz): felttid fra en dag til en time, samme nøjagtighed",
            body: "På en 20 hektar grusgrav sammenlignede Lerch Weber en opmålingsdrone med fotogrammetri mod en klassisk terrestrisk scanner. Feltarbejdet faldt fra cirka en fuld dag til omkring en time, og de to volumenresultater lå 0,24 m³ fra hinanden, altså i praksis samme nøjagtighed. Hurtigere i felten uden at give køb på præcisionen.",
            src: "Rapporteret af Wingtra",
          },
          {
            n: "3",
            title:
              "Langan (USA): leveret en uge før tid og 30% under budget",
            body: "Langan brugte AI-automatisk feature-ekstraktion fra LiDAR (striber, master, brønde) på en design-grade topografisk opmåling i ørkenterræn. Projektet blev leveret en uge før tid og 30% under budget. Det operationelle resultat der faktisk tæller for en kunde: til tiden og til prisen.",
            src: "Rapporteret af Mach9",
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
          Det spændende er ikke, at en drone kan flyve. Det er, at AI kan fjerne
          kontor-timerne bagefter: klassifikationen, volumen og optegningen, så I
          kommer hurtigere videre til næste opgave.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Start på kontoret, hvor dataen allerede er i huset
        </h2>
        <p className="mb-[18px]">
          De firmaer det lykkes for, kaster sig ikke ud i alt på én gang. De
          tager ét kontor-flow, ofte punktsky-klassifikation eller volumen og
          optegning på data de allerede har liggende, kører det i drift, måler
          før og efter, og skalerer derfra. Og fordi kun cirka 12% bruger AI
          regelmæssigt, er der en reel fordel i at komme foran nu, mens de fleste
          stadig kun overvejer det. Mennesket bliver i loopet: AI foreslår
          klassifikationen, landmåleren godkender.
        </p>
      </section>

      {/* ============ MIN HOLDNING ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Min holdning</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          AI hører til i opmålingen, ikke i myndighedsarbejdet
        </h2>
        <p className="mb-[18px]">
          Jeg leder med ROI, ikke med hype. Den matrikulære kerne, skelforretning
          og myndighedsarbejde, rører jeg ikke, den skal og bliver hos
          landinspektøren. Jeg hjælper med opmålings- og kontor-laget, hvor
          gevinsten er umiddelbar og risikoen lav: punktsky-klassifikation,
          volumen, optegning, rapport og tilbud. Barriererne fra undersøgelserne,
          kompetencer, integration og data, er præcis dem jeg løser. Og har I
          allerede en strømlinet workflow fra felt til leverance, så siger jeg
          det. Pointen er ROI på jeres tal, ikke et AI-projekt for projektets
          skyld.
        </p>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Er noget af det relevant for jer?
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Vil I finde jeres hurtigste gevinst efter feltarbejdet?
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Jeg viser gerne konkret, hvordan ét enkelt flow som punktsky-klassifikation
          eller volumen og optegning kan se ud hos jer, og hvad det realistisk er
          værd i sparet kontor-tid.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-ai-i-landmaaling"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book et kort møde →
          </a>
          <a
            href="https://spaike.dk"
            data-umami-event="field_note_closer_more_click"
            data-umami-event-article="ai-i-landmaaling"
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
              href="https://www.gim-international.com/content/article/results-of-eaasi-s-first-industry-survey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              EAASI First Industry Survey (2026, via GIM International)
            </a>
            : 49% AI-databehandling som top-investeringsprioritet, 44% AI som
            kritisk kompetence.
          </li>
          <li>
            <a
              href="https://www.rics.org/news-insights/artificial-intelligence-in-construction-report"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              RICS, AI in Construction 2025
            </a>
            : 45% bruger intet AI, kun ~12% regelmæssigt, ~70% tror på værdien,
            barrierer 46/37/30%.
          </li>
          <li>
            <a
              href="https://geospatial.trimble.com/blog/geospatial/en-US/article/ai-based-feature-extraction-in-tbc-adds-value-to-collected-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Trimble Resource Center
            </a>
            : LE34 (volumen på ~halvdelen af tiden, one-click skel 80-90%),
            GeoVerra (~30% tidsbesparelse), Severino (85% hurtigere DTM).
          </li>
          <li>
            <a
              href="https://mach9.ai/customers/case-studies/langan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Mach9, Langan case
            </a>
            : AI feature-ekstraktion fra LiDAR, leveret en uge før tid og 30%
            under budget.
          </li>
          <li>
            <a
              href="https://wingtra.com/surveying-gis/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Wingtra
            </a>
            : Lerch Weber (felttid fra en dag til en time, nøjagtighed matchet),
            Idaho Forest Group (måletid -80%, &gt;50.000 USD/år sparet).
          </li>
        </ul>
        <div className="mt-6">
          Kurateret for landinspektør- og opmålingsvirksomheder af{" "}
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

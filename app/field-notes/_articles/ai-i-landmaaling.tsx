import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i landmåling — SpAIke",
  description:
    "Ikke en liste over software du skal købe. Hvad rigtige virksomheder har bygget med AI til kontor-arbejdet (rapporter, tilbud, dokumenter), fortalt firma-først, for landinspektør- og opmålingsvirksomheder.",
  openGraph: {
    title: "AI i landmåling — hvad firmaer har bygget, ikke købt",
    description:
      "Firma-først cases (Landbrugsstyrelsen, Arup, Talbots Law): AI bygget omkring egne data til rapporter, tilbud og dokumenter. Ikke droner, ikke produkter du skal købe.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-landmaaling",
  },
  twitter: {
    card: "summary",
    title: "AI i landmåling — hvad firmaer har bygget, ikke købt",
    description:
      "Firma-først cases om AI bygget omkring egne data til kontor-arbejdet, for landinspektør- og opmålingsvirksomheder.",
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
          hvad firmaer har bygget, ikke hvad de har købt
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke et AI-oplæg om droner, og ikke en liste over software I skal købe.
        Her er hvad rigtige virksomheder har bygget med AI til kontor-arbejdet,
        rapporter, tilbud og dokumenter, fortalt firma-først, med kilder du selv
        kan klikke på.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>
          Kilder: Landbrugsstyrelsen / Alexandra Instituttet · Arup · Today&rsquo;s
          Conveyancer · EAASI · RICS
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
          Det korte svar: du behøver hverken en drone eller et nyt stykke
          software for at komme i gang. Den tunge felt-tech er reel, men kompleks,
          og de færdige værktøjer gør dig til køber, ikke til ejer. Det
          interessante er, hvad firmaer har BYGGET med AI omkring deres egne data:
          rapporter skrevet fra eget arkiv, forespørgsler læst og besvaret,
          dokumenter der før blev tjekket i hånden. Næsten ingen landmålere har
          vist det offentligt endnu, så her er de nærmeste eksempler, og den
          first-mover-fordel der ligger og venter.
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
          RICS&rsquo; AI in Construction 2025 blandt over 2.200 fagfolk. Billedet
          er tydeligt: næsten alle vil investere, men de færreste er i gang for
          alvor, og endnu færre har vist deres AI-arbejde offentligt. Det er
          præcis derfor de næste tre eksempler er værd at kigge på, selvom to af
          dem kommer fra nabofag: de viser bevægelsen, ikke et produkt.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Tre firmaer, ikke tre produkter
        </h2>

        {[
          {
            n: "1",
            title:
              "Landbrugsstyrelsen (Danmark): AI screener 450.000 markblokke, der før blev tjekket i hånden",
            body: "En dansk myndighed byggede sammen med Alexandra Instituttet en deep-learning-model, der automatisk screener og afgrænser cirka 450.000 markblokke ud fra luftfotos, grundlaget for arealstøtte, som før var en tung, delvist manuel GIS-proces. Pointen er ikke et købt produkt, men en model bygget til deres egne data og eget GIS. Så tæt på landmåling som en case kommer: arealer, geodata, opmåling.",
            src: "Kilde: Alexandra Instituttet. Ærligt: en prototype, uden et offentliggjort tidstal.",
          },
          {
            n: "2",
            title: "Arup (global ingeniørvirksomhed): byggede sit eget AI, købte det ikke",
            body: "Arup byggede to egne AI-værktøjer frem for at købe et produkt. Det ene er trænet på årtiers egne projekter, standarder og regler og bruges til at slå viden op og skrive udkast til rapporter. Det andet læser indkommende forespørgsler, opsummerer kravene og finder relevante tidligere projekter og folk på tværs af 150.000 projekter, så de hurtigt kan afgøre hvad de skal byde på, 16.000 forespørgsler om året. Præcis en landmålers hverdag: skrive rapporter fra egen viden, og vurdere hvilke opgaver der er værd at give tilbud på.",
            src: "Kilde: Microsoft-story, firma-fortalt. Ærligt: kvalitativt, ikke ét hårdt tal.",
          },
          {
            n: "3",
            title: "Talbots Law (UK): AI læser ejendomsdokumenterne og skriver rapporten",
            body: "Et britisk advokatfirma satte AI til at læse indkommende ejendoms- og tinglysningsdokumenter på deres bolighandels-sager, flage problemer tidligt og skrive klient-klare rapporter. Resultat: over fem timer sparet pr. medarbejder om ugen, og færre fejl, fordi problemer fanges før. Det er samme bevægelse som at læse et skøde eller en matrikeludskrift og skrive rapporten ud fra det.",
            src: "Kilde: Today's Conveyancer (firma og medarbejdere navngivne; tallet er rapporteret via AI-leverandøren).",
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
          Værktøjerne findes. Fordelen ligger ikke i at købe et produkt, men i at
          bygge AI omkring jeres egne data, jeres skabeloner og jeres arkiv.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          De bygger om deres egne data, de køber ikke et produkt
        </h2>
        <p className="mb-[18px]">
          De firmaer der får noget ud af det, starter dér hvor deres egen data
          ligger: tidligere rapporter, skabeloner, dokument-arkivet. De bygger ét
          smalt AI-flow omkring det, måler før og efter, og skalerer derfra. Det
          er ikke et produkt man installerer, men en evne formet til firmaet,
          sådan som Arup og Landbrugsstyrelsen gjorde. Og fordi næsten ingen
          landmålere har vist det offentligt endnu, er der en reel
          first-mover-fordel i at komme i gang nu.
        </p>
      </section>

      {/* ============ MIN HOLDNING ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Min holdning</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Jeg bygger det, jeg sælger jer ikke en licens
        </h2>
        <p className="mb-[18px]">
          Jeg leder med ROI, ikke med hype. Der findes masser af færdige
          værktøjer, men den reelle værdi ligger ikke i at installere et produkt,
          den ligger i at bygge AI omkring netop jeres skabeloner, jeres tidligere
          rapporter og jeres dokumenter, sådan som Arup og Landbrugsstyrelsen
          gjorde det. Det er dét jeg laver: løsningen bygges om jeres data, den
          sælges ikke som en licens. Den tunge felt-tech med drone og punktsky er
          reel, men det er ikke der man starter. Og har I allerede bygget det, så
          siger jeg det. Pointen er ROI på jeres tal, ikke et AI-projekt for
          projektets skyld.
        </p>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Er noget af det relevant for jer?
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Vil I bygge jeres første kontor-AI?
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Jeg viser gerne konkret, hvordan ét enkelt flow som rapporter fra jeres
          eget arkiv eller tilbud på indkommende forespørgsler kan bygges om jeres
          data, og hvad det realistisk er værd i sparet kontor-tid. Ingen droner
          nødvendige.
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
              href="https://alexandra.dk/effektiv-forvaltning-og-bedre-service-til-landbruget/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Alexandra Instituttet, Landbrugsstyrelsen-case
            </a>
            : deep-learning-model screener ~450.000 markblokke fra luftfotos
            (prototype).
          </li>
          <li>
            <a
              href="https://ukstories.microsoft.com/features/how-arup-is-shaping-a-better-world-with-microsoft-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Microsoft UK Stories, Arup
            </a>
            : egne AI-værktøjer til rapport-udkast fra eget arkiv + triage af
            16.000 forespørgsler/år.
          </li>
          <li>
            <a
              href="https://todaysconveyancer.co.uk/talbots-law-shaping-future-conveyancing-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Today&rsquo;s Conveyancer, Talbots Law
            </a>
            : AI læser ejendomsdokumenter og skriver rapporter, 5+ timer sparet
            pr. medarbejder/uge (tal via AI-leverandøren).
          </li>
          <li>
            <a
              href="https://www.gim-international.com/content/article/results-of-eaasi-s-first-industry-survey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              EAASI First Industry Survey (2026, via GIM International)
            </a>
            : 49% AI-databehandling som top-investeringsprioritet.
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
            : kun ~12% bruger AI regelmæssigt, ~70% tror på værdien.
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

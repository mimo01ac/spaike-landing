import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i landmåling — SpAIke",
  description:
    "De nemme AI-gevinster ligger i kontoret, ikke i luften. Hvordan landinspektør- og opmålingsvirksomheder kan automatisere tilbud, rapporter og dokumenter uden drone eller hardware, med kilder du selv kan klikke på.",
  openGraph: {
    title: "AI i landmåling — de nemme gevinster ligger i kontoret",
    description:
      "Kildebelagte tal (EAASI, RICS) + konkrete kontor-cases (Survey Booker, Go Report, V7): tilbud, rapporter og dokumenter uden drone eller hardware.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-landmaaling",
  },
  twitter: {
    card: "summary",
    title: "AI i landmåling — de nemme gevinster ligger i kontoret",
    description:
      "Kildebelagte tal og konkrete kontor-cases om AI hos landinspektører og opmålingsvirksomheder, uden hardware.",
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
          de nemme gevinster ligger i kontoret, ikke i luften
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke endnu et AI-oplæg om droner og punktskyer. De hurtigste gevinster
        kræver ingen hardware: de ligger i tilbuddene, rapporterne og
        dokumenterne, på data I allerede har. Med kilder du selv kan klikke på.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>Kilder: EAASI · RICS · Survey Booker · Go Report · V7</span>
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
          Det korte svar: du behøver ikke en drone for at komme i gang med AI.
          Den tunge felt-tech, LiDAR, punktsky og kalibrering, er reel, men
          kompleks og langt fra hverdagen. De nemme, hurtige gevinster ligger i
          kontoret: at svare på en forespørgsel med et tilbud på minutter, at
          gøre felt-noter til en færdig rapport, og at trække data ud af
          dokumenter i stedet for at taste om. Software, ingen hardware, payback
          i uger.
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
          men kompetencer, integration og data, altså praktiske ting man løser i
          kontoret, ikke i luften.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Tre nemme kontor-gevinster, ingen hardware
        </h2>

        {[
          {
            n: "1",
            title:
              "Tilbud på minuttet, direkte fra forespørgslen",
            body: "Survey Booker, et system bygget til opmålingsfirmaer, fanger en forespørgsel fra hjemmesiden eller mailen, genererer automatisk et tilbud mod jeres prisskala og sender et svar med det samme. Det britiske opmålingsfirma Streetwise Surveyors bruger det og melder om markant mindre admin-tid. Til sammenligning er et tilbud fra en fritekst-mail i nabobrancher gået fra 45 til 90 minutter til under et minut med AI, der læser mailen og udfylder tilbuddet. Hurtigt svar vinder opgaven.",
            src: "Kilde: Survey Booker (opmålings-CRM, kunde Streetwise Surveyors), leverandør-tal. Magnitude fra nabobranche.",
          },
          {
            n: "2",
            title: "Fra felt-noter til færdig rapport",
            body: "Go Report, lavet til bygnings- og opmålingsrapporter, tager landmålerens stikord og fotos og skriver dem ud til en færdig, skabelon-styret rapport, med korrektur og konsistens-tjek inden den sendes. En praksis kan vende en rapport på 48 timer, hvor mange bruger op mod to uger, og AI halverer typisk selve skrivetiden. Landmåleren er stadig den, der godkender.",
            src: "Kilde: Go Report (rapport-værktøj til survey), leverandør-tal",
          },
          {
            n: "3",
            title: "Træk data ud af dokumenter i stedet for at taste om",
            body: "AI læser skøder, matrikeludskrifter og gamle PDF'er og trækker mål, servitutter og beskrivelser ud i struktureret form med kilde-henvisning, i stedet for manuel gennemtastning. På dokument- og title-gennemgang er tiden faldet fra to til fire timer til femten til tredive minutter. Software alene, på dokumenter I allerede har liggende.",
            src: "Kilde: V7 (AI-dokument-udtræk, title-nært værktøj), leverandør-tal",
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
          Du behøver ikke en drone for at komme i gang. De hurtigste gevinster
          ligger i kontoret: tilbuddene, rapporterne og dokumenterne, på data I
          allerede har.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Start med ét kontor-flow, ikke med en dronepark
        </h2>
        <p className="mb-[18px]">
          De firmaer det lykkes for, starter dér hvor der ingen hardware er: ét
          flow som automatiske tilbud på indkommende forespørgsler eller
          hurtigere rapporter, på data de allerede har. De måler før og efter, og
          skalerer derfra. Det kræver ingen investering i droner, scannere eller
          kalibrering, og det kan piloteres på uger. Den tunge felt-tech kan
          komme bagefter, når kontoret først kører. Og fordi kun cirka 12% bruger
          AI regelmæssigt, er der en reel fordel i at komme foran nu.
        </p>
      </section>

      {/* ============ MIN HOLDNING ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Min holdning</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Start i kontoret, ikke i luften
        </h2>
        <p className="mb-[18px]">
          Jeg leder med ROI, ikke med hype. Den avancerede felt-tech,
          drone-opmåling og AI-punktsky, som fx danske LE34 bruger til
          volumenberegning, er reel, men den er tung, kræver hardware og
          kalibrering, og er ikke der man kommer nemmest i gang. Jeg hjælper med
          kontor-laget, hvor gevinsten er umiddelbar og risikoen lav: tilbud,
          rapporter, kunde-mails og dokumenthåndtering, software alene, på data I
          allerede har. Barriererne fra undersøgelserne, kompetencer, integration
          og data, er præcis dem jeg løser. Og har I allerede strømlinet det, så
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
          Vil I finde jeres nemmeste kontor-gevinst?
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Jeg viser gerne konkret, hvordan ét enkelt flow som automatiske tilbud
          på forespørgsler eller hurtigere rapporter kan se ud hos jer, og hvad
          det realistisk er værd i sparet kontor-tid. Ingen droner nødvendige.
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
            : kun ~12% bruger AI regelmæssigt, ~70% tror på værdien, barrierer
            46/37/30%.
          </li>
          <li>
            <a
              href="https://surveybooker.co.uk/customer-testimonials/streetwise-surveyors-testimonial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Survey Booker, Streetwise Surveyors case
            </a>{" "}
            ·{" "}
            <a
              href="https://surveybooker.co.uk/optimising-processes/save-time-providing-quotes-and-respond-faster-to-enquiries/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              tilbud og svartid
            </a>
            : automatiske tilbud og intake for opmålingsfirmaer.
          </li>
          <li>
            <a
              href="https://goreport.com/ai-driven-survey-reporting/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Go Report, AI-drevet survey-rapportering
            </a>
            : felt-noter til færdig rapport, rapport på 48 timer vs op mod to uger.
          </li>
          <li>
            <a
              href="https://www.v7labs.com/automations/land-title-surveys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              V7, land-title survey-analyse
            </a>
            : AI-dokument-udtræk, gennemgang 2-4 timer ned til 15-30 minutter.
          </li>
          <li>
            <a
              href="https://www.infomazeelite.com/blog/ai-generated-rfq-forms-from-unstructured-customer-emails/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Infomaze (nabobranche)
            </a>
            : tilbud fra fritekst-mail fra 45-90 min til under et minut. Markeret
            som nabobranche, ikke opmåling.
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

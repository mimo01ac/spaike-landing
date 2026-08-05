import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: AI i fertilitetsbehandling — SpAIke",
  description:
    "Hvad tallene viser, og hvad frontløberne allerede gør. Kildebelagte tal og navngivne cases om AI i fertilitetsbehandling, med vægt på driften: svartid, opfølgning og patientkommunikation.",
  openGraph: {
    title:
      "AI i fertilitetsbehandling — hvad frontløberne allerede gør",
    description:
      "Kildebelagte tal (Journal of IVF-Worldwide, Nature Medicine) og navngivne cases (Care Fertility, IVF Australia, First Fertility) om AI i fertilitetsbehandling.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/ai-i-fertilitet",
  },
  twitter: {
    card: "summary",
    title:
      "AI i fertilitetsbehandling — hvad frontløberne allerede gør",
    description:
      "Kildebelagte tal og navngivne cases om AI i fertilitetsbehandling, kurateret for fertilitetsklinikker.",
  },
};

export default function AiIFertilitet() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">
          SpAIke / Field Notes / AI i fertilitetsbehandling
        </span>
        <span className="text-amber-dark">4&nbsp;min</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        AI i fertilitetsbehandling:{" "}
        <em className="italic font-medium text-amber-dark">
          hvad frontløberne allerede gør
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Ikke et oplæg om jeres branche, den kender I. Det her handler kun om AI:
        hvor udbredt det er blevet, hvad de førende klinikker gør konkret, og
        hvor gevinsten er størst lige nu. Alt med kilder, du selv kan klikke på.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Kurateret af Michael Mortensen · SpAIke · august 2026</span>
        <span>
          Kilder: Journal of IVF-Worldwide · Nature Medicine · Care Fertility ·
          First Fertility
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
          Det korte svar fra tallene: på under tre år er AI gået fra
          tidlig-adopter-niche til norm i IVF-laboratoriet, og over halvdelen af
          fertilitetsspecialister bruger det nu. Spørgsmålet i branchen er ikke
          længere om AI virker, men hvor man starter. Og den billigste,
          hurtigste gevinst ligger ikke i laboratoriet, men i driften.
        </p>
      </section>

      {/* ============ TALLENE ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Tallene</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          AI er gået fra niche til norm i branchen
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              53%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af fertilitetsspecialister bruger nu AI, op fra 25% i 2022 (global
              survey, Journal of IVF-Worldwide)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              84%
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              af klinikkerne vil investere i AI inden for 1-5 år, adoptionen
              accelererer (samme survey)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              100+
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              fertilitetsklinikker kører allerede Fairtility CHLOE til
              AI-embryo-vurdering globalt (Fairtility, 2026)
            </div>
          </div>
          <div className="bg-cream-deep border border-rule rounded px-5 py-6">
            <div className="font-serif font-bold text-[32px] leading-none text-amber-dark">
              10×
            </div>
            <div className="text-[14px] text-ink-soft mt-2.5">
              hurtigere embryo-vurdering med AI (iDAScore), samme
              graviditetsrater, RCT med 1.066 patienter (Nature Medicine)
            </div>
          </div>
        </div>

        <p className="mb-[18px]">
          Den mest citérbare måling er Journal of IVF-Worldwides gentagne globale
          survey blandt specialister og embryologer: regelmæssig eller
          lejlighedsvis AI-brug mere end fordoblede sig fra 24,8% til 53,2% på
          tre år. Barriererne er nu praktiske (omkostning og træning), ikke
          skepsis over for teknologien. En ærlig note: den kliniske embryo-AI
          dokumenterer indtil videre hastighed og ensartethed (samme resultat,
          hurtigere, mindre variation mellem embryologer), ikke en bevist højere
          fødselsrate. Værdien er reproducerbarhed og frigjort ekspert-tid.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ HVOR DET SKABER VÆRDI ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Hvor det skaber værdi</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-8">
          Tre steder klinikker allerede bruger AI i drift
        </h2>

        {[
          {
            n: "1",
            title:
              "Care Fertility (UK/Irland, 15 laboratorier): en halv embryolog-årsværk frigjort",
            body: "Trænede en model på cirka 500 mio. time-lapse-billeder fra egne klinikker og lod embryologerne verificere AI'ens udvalg i stedet for at gennemgå tusindvis af billeder manuelt. Det frigjorde omtrent seks måneders embryolog-tid om året, rullet ud på tværs af 15 laboratorier.",
            src: "Kilde: CGI, Care Fertility case study",
          },
          {
            n: "2",
            title:
              "Virtus Health / IVF Australia: samme graviditetsrater, 10× hurtigere",
            body: "Indførte AI-embryoudvælgelse (iDAScore) klinisk og validerede den i et randomiseret, dobbeltblindt forsøg med 1.066 patienter på tværs af 14 klinikker. AI'en scorede embryoner cirka 10 gange hurtigere end en embryolog med klinisk sammenlignelige graviditetsrater. Publiceret i Nature Medicine.",
            src: "Kilde: IVF Australia / Nature Medicine-RCT (2024)",
          },
          {
            n: "3",
            title:
              "First Fertility Bangkok (drift): svartid fra 50 til 10 minutter",
            body: "Satte en AI-agent på indkommende patient-henvendelser med klinik-specifik viden og overdragelse til specialist ved behov. Den besvarede 77% af henvendelserne uden menneske, sænkede svartiden fra cirka 50 til 10 minutter, og udvidede fra 2 til 5 sprog uden at ansætte flere. Det operationelle lag, uden regulatorisk risiko.",
            src: "Kilde: Zaapi, First Fertility case (leverandør-case, egne tal)",
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
          Spørgsmålet i branchen er ikke længere om AI virker, men hvor man
          starter. Den billigste gevinst ligger i driften, ikke i laboratoriet.
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SÅDAN GRIBER DE KLOGE DET AN ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Sådan griber de kloge det an</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Pilotér smalt, mål effekten, skalér
        </h2>
        <p className="mb-[18px]">
          De klinikker der lykkes, sætter ikke AI i drift over hele forløbet på
          én gang. De starter dér, hvor dataen allerede er i huset
          (time-lapse-billeder til embryo-AI, henvendelses-log til
          kommunikations-AI), piloterer på ét laboratorium eller ét flow, måler
          før og efter, og skalerer først derefter. Og de tager den kommercielle
          lavrisiko-gevinst først: automatiseret første-svar, booking,
          sprog-support og opfølgning rører ikke den kliniske beslutning, kan
          piloteres på uger, og har målbar ROI. Gennemgående er mennesket i
          loopet fra dag ét: AI håndterer rutinen og eskalerer til specialisten,
          embryologen verificerer frem for at blive erstattet.
        </p>
      </section>

      {/* ============ MIN HOLDNING ============ */}
      <section className="my-16">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span>Min holdning</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Start i driften, ikke i laboratoriet
        </h2>
        <p className="mb-[18px]">
          Den kliniske embryo-AI er reel, men regulatorisk tung og dokumenterer
          i dag ensartethed og hastighed, ikke flere fødte børn. Det er ikke
          der, jeg arbejder. Jeg hjælper med det operationelle og kommercielle
          lag, hvor gevinsten er umiddelbar og risikoen lav: hurtigere svar på
          henvendelser, automatiseret opfølgning (et peer-reviewet forsøg viste,
          at en enkelt, medfølende opfølgnings-mail til udeblevne patienter
          løftede &ldquo;return to care&rdquo; fra 32% til 41%), intake, booking
          og sprog. Og ærligt: har I allerede hurtige svar og god opfølgning, er
          der måske ikke så meget at hente, og så siger jeg det. Pointen er ROI
          på jeres tal, ikke et AI-projekt for projektets skyld.
        </p>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Er noget af det relevant for jer?
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Vil I finde jeres hurtigste gevinst i driften?
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Jeg viser gerne konkret, hvordan ét enkelt flow som svartid på
          henvendelser eller opfølgning på patienter kan se ud hos jer, og hvad
          det realistisk er værd.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-ai-i-fertilitet"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book et kort møde →
          </a>
          <a
            href="https://spaike.dk"
            data-track-event="field_note_closer_more_click"
            data-track-article="ai-i-fertilitet"
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
              href="https://jivfww.scholasticahq.com/article/140673-global-trends-in-the-use-of-artificial-intelligence-ai-in-reproductive-medicine-insights-from-surveys-of-international-fertility-specialists"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Journal of IVF-Worldwide, Shoham et al. (2025)
            </a>
            : AI-brug 24,8% (2022) til 53,2% (2025), 84% vil investere inden for
            1-5 år.
          </li>
          <li>
            <a
              href="https://www.cgi.com/au/en-au/case-study/health/care-fertility-transforms-ivf-selection-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              CGI, Care Fertility case study
            </a>
            : AI-auto-annotering trænet på ~500 mio. billeder, frigjorde ~6
            måneders embryolog-tid/år, udrullet på 15 laboratorier.
          </li>
          <li>
            <a
              href="https://www.ivf.com.au/resources/news/artificial-intelligence-for-ivf-patients-first-global-study-confirms-effectiveness"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              IVF Australia / Nature Medicine-RCT (2024)
            </a>
            : iDAScore ~10× hurtigere, sammenlignelige graviditetsrater, 1.066
            patienter i 14 klinikker.
          </li>
          <li>
            <a
              href="https://www.globenewswire.com/news-release/2026/07/27/3333648/0/en/Fairtility-and-First-Fertility-Expand-Strategic-Partnership-to-Deploy-CHLOE-Across-Multiple-IVF-Laboratories.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Fairtility / First Fertility (GlobeNewswire, 2026)
            </a>
            : CHLOE i drift på 100+ fertilitetsklinikker globalt.
          </li>
          <li>
            <a
              href="https://www.emjreviews.com/reproductive-health/congress-review/how-ai-is-revolutionising-reproductive-clinical-practice-j150125/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              European Medical Journal, ESHRE 2025-review
            </a>
            : AI flytter fra embryo-scoring mod stimulerings-respons og workflow.
          </li>
          <li>
            <a
              href="https://doi.org/10.1016/j.heliyon.2023.e19705"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Heliyon, Domar et al. (2023)
            </a>
            : opfølgnings-mail løftede return-to-care fra 32% til 41%
            (peer-reviewed).
          </li>
          <li>
            <a
              href="https://www.zaapi.com/case-study/how-ai-helped-first-fertility-serve-more-patients-in-more-languages-faster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
            >
              Zaapi, First Fertility Bangkok case
            </a>
            : AI løste 77% af henvendelser, svartid 50 til 10 min. (leverandør-case).
          </li>
        </ul>
        <div className="mt-6">
          Kurateret for fertilitetsklinikker af{" "}
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

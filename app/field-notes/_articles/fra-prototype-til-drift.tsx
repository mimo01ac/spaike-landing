import type { Metadata } from "next";

/**
 * Field Notes № 03 — SKREVET MEN IKKE PUBLICERET.
 *
 * Publicér ved at registrere den i ./_articles/index.ts:
 *
 *   import FraPrototypeTilDrift, {
 *     metadata as fraPrototypeTilDriftMetadata,
 *   } from "./fra-prototype-til-drift";
 *   ...
 *   "fra-prototype-til-drift": {
 *     component: FraPrototypeTilDrift,
 *     metadata: fraPrototypeTilDriftMetadata,
 *   },
 *
 * Overvej samtidig at tilføje et link i vibe-coding-guide.tsx
 * (70 %-afsnittet i leden er det naturlige sted).
 */

export const metadata: Metadata = {
  title: "Field Notes: Fra prototype til drift · SpAIke",
  description:
    "I har bygget noget med AI, der virker, og teamet er begejstret. Her er hvad de sidste 30 % består af, og hvordan I beslutter, om appen skal blive, hvor den er, gøres robust eller bygges rigtigt.",
  openGraph: {
    title: "Fra prototype til drift: hvad du gør, når appen virker (næsten)",
    description:
      "De sidste 30 % af en AI-bygget app, forklaret uden teknisk sprog: de tre veje videre, signalerne du skal reagere på, og de fem spørgsmål der afgør vejen.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/fra-prototype-til-drift",
  },
  twitter: {
    card: "summary",
    title: "Fra prototype til drift: hvad du gør, når appen virker (næsten)",
    description:
      "De sidste 30 % af en AI-bygget app, forklaret uden teknisk sprog.",
  },
};

export default function FraPrototypeTilDrift() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / №&nbsp;03</span>
        <span className="text-amber-dark">6&nbsp;min læsning</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        Fra prototype til drift:{" "}
        <em className="italic font-medium text-amber-dark">
          hvad du gør, når appen virker (næsten)
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        I har bygget noget med AI. Det virker, teamet bruger det, og nogen har
        allerede spurgt, om resten af afdelingen kan få adgang. Tillykke, I er
        nået længere end de fleste. Nu kommer den del, ingen af demoerne
        forberedte jer på.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Opfølger på Field Notes № 02: guiden til vibe coding-værktøjerne</span>
        <span>
          Skrevet af{" "}
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
          I{" "}
          <a
            href="/field-notes/vibe-coding-guide"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            guiden til vibe coding-værktøjerne
          </a>{" "}
          skrev jeg, at værktøjerne får dig cirka 70 % af vejen. Det her er
          artiklen om de sidste 30 %. Ikke for at tage modet fra nogen, tværtimod:
          de fleste apps behøver aldrig at komme længere end til de 70 %, og det
          er helt fint. Men i det øjeblik din app bliver vigtig for andre end
          dig selv, er der nogle beslutninger, der er meget billigere at tage
          tidligt end sent.
        </p>
        <p className="mb-[18px]">
          Det her er ikke en teknisk artikel. Det er en beslutningsguide for
          dig, der leder et kommercielt team og nu står med et velfungerende
          hjemmebygget værktøj og spørgsmålet: hvad nu?
        </p>
      </section>

      {/* ============ HVAD ER DE SIDSTE 30 % ============ */}
      <section className="my-16 scroll-mt-10" id="sidste-30">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Hvad de sidste 30 % egentlig består af
        </h2>
        <p className="mb-[18px]">
          En prototype og et driftsklart værktøj ligner hinanden på overfladen.
          Forskellen ligger i alt det, man ikke ser, før det mangler:
        </p>
        <ul className="list-none my-8">
          {[
            ["Hvem må se hvad?", "I prototypen kan alle alt. I virkeligheden må sælgeren i Jylland måske ikke se kollegaens provision, og praktikanten skal ikke kunne slette kundelisten."],
            ["Hvad sker der, når 20 kolleger bruger den samtidig?", "Et værktøj, der virker perfekt for tre personer, kan blive langsomt eller ustabilt, når hele afdelingen logger på mandag morgen."],
            ["Hvor ligger jeres data, og hvem passer på dem?", "Så snart der er kundenavne, priser eller personoplysninger i appen, er det ikke længere et legetøj. Så gælder der regler, og nogen skal have ansvaret."],
            ["Hvem fikser den, når den driller en fredag kl. 15?", "Prototyper har en ejer af lyst. Driftsværktøjer skal have en ejer af pligt, ellers dør de stille, når ildsjælen skifter job eller får travlt."],
          ].map((item, i) => (
            <li
              key={i}
              className={`py-4 ${i === 0 ? "" : "border-t border-dotted border-rule"}`}
            >
              <span className="font-serif text-[19px] font-semibold text-ink">
                {item[0]}
              </span>{" "}
              <span className="text-ink-soft">{item[1]}</span>
            </li>
          ))}
        </ul>
        <p className="mb-[18px]">
          Ingen af de fire ting er svære at løse. De er kun dyre at opdage for
          sent.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ DE TRE VEJE ============ */}
      <section className="my-16 scroll-mt-10" id="tre-veje">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          De tre veje videre
        </h2>

        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5 mt-10">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">A</span>
          <span>Lad den blive, hvor den er</span>
        </div>
        <h3 className="font-serif font-semibold text-[24px] leading-[1.2] text-ink mb-4">
          Det undervurderede valg
        </h3>
        <p className="mb-[18px]">
          Langt de fleste hjemmebyggede værktøjer skal bare have lov at leve
          som det, de er: et internt værktøj, der sparer et par timer om ugen
          for et lille team. Ingen kundedata, ingen betalinger, begrænset
          skade hvis den er nede en dag. Så er der ærligt talt ikke mere at
          gøre. Brug den, vær stolt af den, og byg den næste.
        </p>

        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5 mt-10">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">B</span>
          <span>Gør den robust</span>
        </div>
        <h3 className="font-serif font-semibold text-[24px] leading-[1.2] text-ink mb-4">
          En teknisk gennemgang, ikke en ombygning
        </h3>
        <p className="mb-[18px]">
          Når appen begynder at betyde noget (flere teams bruger den, der
          ligger rigtige kundedata i den), er næste skridt ikke at bygge den
          om. Det er at få en teknisk person til at bruge en dag eller to på
          at gå den igennem: lukke hullerne, sikre at data behandles
          ordentligt, sætte adgang op for de rigtige, og aftale hvem der har
          ansvaret fremover. Det koster typisk en konsulentdag eller to, og
          det er den bedst forrentede investering i hele forløbet.
        </p>

        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5 mt-10">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">C</span>
          <span>Byg den rigtigt</span>
        </div>
        <h3 className="font-serif font-semibold text-[24px] leading-[1.2] text-ink mb-4">
          Når prototypen har bevist sit værd
        </h3>
        <p className="mb-[18px]">
          Nogle gange rammer et hjemmebygget værktøj noget så værdifuldt, at
          det skal være en del af forretningen: kunder skal bruge det, penge
          skal igennem det, eller hele virksomheden skal arbejde i det. Så
          skal det bygges af folk, der bygger den slags. Her er prototypen
          ikke spildt arbejde, tværtimod: den er den bedste kravspecifikation,
          der findes. I ved allerede præcis, hvad der virker, fordi I har
          brugt det. Det halverer typisk både pris og misforståelser i det
          rigtige byggeprojekt.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ SIGNALERNE ============ */}
      <section className="my-16 scroll-mt-10" id="signaler">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Signalerne, der betyder, at det er tid til at rykke
        </h2>
        <p className="mb-[18px]">
          Du behøver ikke overvåge noget. Der er fire helt konkrete øjeblikke,
          hvor du skal stoppe op og vælge vej:
        </p>
        <ol className="list-none">
          {[
            ["Et andet team spørger, om de også må bruge den.", "Glædeligt, og præcis her opstår behovet for adgangsstyring og en ejer. Vej B."],
            ["Der er kundedata eller personoplysninger på vej ind.", "Det er den skarpeste grænse af dem alle. Ingen persondata i appen uden en teknisk gennemgang først. Vej B, uden undtagelse."],
            ["Nogen foreslår, at kunder skal have adgang.", "Så er det ikke længere et internt værktøj, det er en del af jeres produkt. Vej C."],
            ["Én person er blevet uundværlig.", "Hvis appen dør, når en bestemt kollega holder ferie, har I ikke et værktøjsproblem men et ansvarsproblem. Vej B, og få det skrevet ned."],
          ].map((item, i) => (
            <li
              key={i}
              className={`py-4 ${i === 0 ? "" : "border-t border-dotted border-rule"}`}
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-[12px] text-amber-dark shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="font-serif text-[19px] font-semibold text-ink">
                    {item[0]}
                  </span>{" "}
                  <span className="text-ink-soft">{item[1]}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-10 pl-7 border-l-2 border-ink">
          Reglen er enkel: jo flere mennesker og jo vigtigere data, jo mere
          voksen skal appen være. Og det er billigere at gøre den voksen i
          etaper end at redde den bagefter.
        </blockquote>
      </section>

      {/* ============ FEM SPØRGSMÅL ============ */}
      <section className="my-16 scroll-mt-10" id="fem-spoergsmaal">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          De fem spørgsmål, der afgør vejen
        </h2>
        <p className="mb-[18px]">
          Sæt jer sammen en halv time, dig og den, der har bygget appen, og
          svar ærligt på de her fem. Så ved I, hvilken vej I skal:
        </p>
        <ol className="list-none">
          {[
            ["Hvad er det værste, der kan ske, hvis appen er nede en hel uge?", "Et træk på skuldrene: vej A. Et reelt problem for forretningen: vej B eller C."],
            ["Ligger der oplysninger i den, som ikke må slippe ud?", "Kundedata, priser, personoplysninger, løn. Ja betyder teknisk gennemgang nu, ikke senere."],
            ["Hvor mange mennesker er afhængige af den?", "Under fem: A. Afdelingen: B. Kunder: C."],
            ["Hvem ejer den, hvis bygherren stopper i morgen?", "Hvis svaret er ingen, er det den første ting, der skal på plads, uanset vej."],
            ["Sparer eller tjener den nok til at retfærdiggøre næste skridt?", "Sæt et groft tal på timerne, den sparer. Det tal fortæller dig, om en konsulentdag eller et byggeprojekt er en god handel."],
          ].map((item, i) => (
            <li
              key={i}
              className={`py-4 ${i === 0 ? "" : "border-t border-dotted border-rule"}`}
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-[12px] text-amber-dark shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="font-serif text-[19px] font-semibold text-ink">
                    {item[0]}
                  </span>{" "}
                  <span className="text-ink-soft">{item[1]}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Hvorfor det her betyder noget
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          De sidste 30 % er ikke en mur. Det er en beslutning.
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          De fleste går i stå her, ikke fordi det er svært, men fordi ingen
          har fortalt dem, at der findes tre veje, og at den ene af dem er
          bare at lade appen være. Står I med en prototype og er i tvivl om
          vejen, så tag en halv times snak med mig om den. Det er præcis den
          slags beslutninger, jeg hjælper med.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-fra-prototype-til-drift"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book en snak →
          </a>
          <a
            href="/field-notes/vibe-coding-guide"
            data-track-event="field_note_universe_click"
            data-track-target="guide-fra-drift"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Læs værktøjsguiden
          </a>
        </div>
      </div>

      {/* ============ ARTICLE FOOTER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        Bygger på research-grundlaget fra Field Notes № 02 (24 kilder, 2025-2026),
        heriblandt det tværgående fund at vibe coding-værktøjer bærer et produkt
        til cirka 60-70 % af produktionsklart, og at der findes et kommercielt
        marked for at redde fastkørte projekter. Fuld kildeliste:{" "}
        <a
          href="/field-notes/vibe-coding-guide"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          guiden til vibe coding-værktøjerne
        </a>
        .
        <br />
        <br />
        Skrevet af{" "}
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

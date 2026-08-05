import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: Byg selv med AI, uden at kunne kode · SpAIke",
  description:
    "Du behøver ikke kunne kode for at bygge rigtige værktøjer til dit team. Jeg har gennemgået 20+ uafhængige tests af de fem største vibe coding-værktøjer og kogt det ned til en guide i almindeligt dansk: hvad de kan, hvad de koster, og hvor du skal starte.",
  openGraph: {
    title: "Byg selv med AI, uden at kunne kode: sådan vælger du det rigtige værktøj",
    description:
      "20+ uafhængige tests af Base44, Lovable, Replit, v0 og Bolt, oversat til almindeligt dansk for salgschefer, kundeservicechefer og alle andre uden teknisk baggrund.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/vibe-coding-guide",
  },
  twitter: {
    card: "summary",
    title: "Byg selv med AI, uden at kunne kode: sådan vælger du det rigtige værktøj",
    description:
      "20+ uafhængige tests af Base44, Lovable, Replit, v0 og Bolt, oversat til almindeligt dansk for folk uden teknisk baggrund.",
  },
};

function VerdictBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-[3px] border-amber px-5 py-4 my-7">
      <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
        {label}
      </div>
      <p className="text-[16px]">{text}</p>
    </div>
  );
}

function PriceLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[12px] tracking-wider text-muted border-t border-dotted border-rule pt-3 mt-6">
      {children}
    </p>
  );
}

export default function VibeCodingGuide() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / №&nbsp;02</span>
        <span className="text-amber-dark">8&nbsp;min læsning</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        Byg selv med AI, uden at kunne kode:{" "}
        <em className="italic font-medium text-amber-dark">
          sådan vælger du det rigtige værktøj
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Skriv på almindeligt dansk hvad du gerne vil have, og få et fungerende
        værktøj tilbage. Det er ikke fremtidssnak, det virker nu. Jeg har
        gennemgået 20+ uafhængige tests af de fem største værktøjer og oversat
        det hele til en guide for folk uden teknisk baggrund.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Research: 24 kilder, heraf 6 sammenlignende hands-on-tests · 2025-2026</span>
        <span>Alle priser tjekket hos leverandørerne selv, 11. juli 2026</span>
        <span>
          Researchet og skrevet af{" "}
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
          Vibe coding er det nye ord for noget ret simpelt: du beskriver med
          dine egne ord, hvad du gerne vil have bygget, og et AI-værktøj
          bygger det for dig, mens du kigger på. Et prioriteringsoverblik til
          salgsteamet. En lille app der laver mødeforberedelsen for dig. Et
          værktøj der samler de tal, du alligevel sidder og klipper sammen i
          Excel hver fredag. Den slags kan du bygge selv nu, på en eftermiddag,
          uden at kunne kode.
        </p>
        <p className="mb-[18px]">
          Denne guide er skrevet til dig, der leder eller sidder i et
          kommercielt team: salg, kundeservice, customer success, marketing.
          Du behøver ikke vide noget som helst teknisk på forhånd. Det eneste,
          du skal have med, er et problem fra din egen hverdag, der irriterer
          dig nok til at bruge en eftermiddag på det.
        </p>
        <p className="mb-[18px]">
          Én ærlig forventningsafstemning, før vi går i gang, for det er det
          vigtigste fund på tværs af alle tests: værktøjerne får dig cirka 70 %
          af vejen. Den første fungerende version, noget du kan vise kollegerne
          og bruge internt: helt realistisk. Et system, som kunder skal logge
          ind i og betale penge igennem: dér skal du have teknisk hjælp til det
          sidste stykke. Går du i gang med den forventning, bliver du positivt
          overrasket i stedet for skuffet.
        </p>
      </section>

      {/* TOC */}
      <nav className="border border-rule px-7 py-6 my-12">
        <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-muted mb-3.5">
          I denne udgave
        </div>
        <ol className="list-none">
          {[
            { href: "#hvad-kan-man-bygge", text: "Hvad kan man egentlig bygge?", tag: "Eksempler" },
            { href: "#base44", text: "Base44: det nemmeste sted at starte", tag: "Tool 01" },
            { href: "#lovable", text: "Lovable: det bedste valg for de fleste", tag: "Tool 02" },
            { href: "#replit", text: "Replit: mest kraft, mest bøvl", tag: "Tool 03" },
            { href: "#v0", text: "v0: kun til flotte skærmbilleder", tag: "Tool 04" },
            { href: "#bolt", text: "Bolt: svær at anbefale lige nu", tag: "Tool 05" },
            { href: "#sammenligning", text: "Det samlede overblik", tag: "Tabel" },
            { href: "#tre-ting", text: "De tre ting, demoerne ikke fortæller dig", tag: "Vigtigst" },
            { href: "#kom-i-gang", text: "Sådan kommer I i gang", tag: "Playbook" },
          ].map((item, i) => (
            <li
              key={item.href}
              className={`flex items-baseline gap-3.5 py-2.5 font-serif text-[18px] font-medium ${
                i === 0 ? "" : "border-t border-dotted border-rule"
              }`}
            >
              <span className="font-mono text-[12px] text-amber-dark shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a href={item.href} className="text-ink hover:text-amber-dark transition-colors">
                {item.text}
              </a>
              <span className="ml-auto font-mono text-[10px] font-normal tracking-wider uppercase text-muted hidden sm:inline">
                {item.tag}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* ============ HVAD KAN MAN BYGGE ============ */}
      <section className="my-16 scroll-mt-10" id="hvad-kan-man-bygge">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Hvad kan man egentlig bygge?
        </h2>
        <p className="mb-[18px]">
          Det sværeste er ofte at se, hvad der overhovedet er muligt. Her er
          fire eksempler på ting, kommercielle teams har bygget med de her
          værktøjer, typisk på en halv til en hel dag:
        </p>
        <ul className="list-none my-8">
          {[
            ["Mødeforberedelse på ét klik", "Indtast et kundenavn, og få en side der samler alt det vigtige før mødet: hvem de er, hvad der er sket sidst, hvad du bør spørge om."],
            ["Et prioriteringsoverblik til salget", "Et overblik der sorterer jeres kundeemner, så sælgerne ved hvem de skal ringe til først, i stedet for at gætte."],
            ["En tilbudsbygger", "En formular hvor du taster få ting ind og får et færdigt, ensartet tilbud ud i jeres egen skabelon. Slut med copy-paste-fejl."],
            ["Et overblik over sager der er gået i stå", "For kundeservice eller pipeline: se med det samme hvilke sager eller deals der ligger stille, før det bliver et problem."],
          ].map((item, i) => (
            <li
              key={i}
              className={`py-4 ${i === 0 ? "" : "border-t border-dotted border-rule"}`}
            >
              <span className="font-serif text-[19px] font-semibold text-ink">
                {item[0]}.
              </span>{" "}
              <span className="text-ink-soft">{item[1]}</span>
            </li>
          ))}
        </ul>
        <p className="mb-[18px]">
          Jeg har samlet 17 konkrete idéer som denne slags, fordelt på salg,
          kundeservice, marketing og onboarding, i{" "}
          <a
            href="/ai-innovationsdag/ideer"
            data-track-event="field_note_universe_click"
            data-track-target="idekatalog"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            idékataloget
          </a>
          . Og er du i tvivl om, hvor I skulle starte, kan du{" "}
          <a
            href="/ai-innovationsdag#vaerktoej"
            data-track-event="field_note_universe_click"
            data-track-target="case-finder"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            chatte med min case-finder
          </a>
          : den stiller dig et par spørgsmål om jeres hverdag og giver dig et
          konkret bud på, hvad der ville give mest værdi at bygge først.
        </p>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ BASE44 ============ */}
      <section className="my-16 scroll-mt-10" id="base44">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">01</span>
          <span>Base44</span>
          <span className="text-muted">· sværhedsgrad: 1 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Det nemmeste sted at starte
        </h2>
        <p className="mb-[18px]">
          Base44 er det mest begyndervenlige værktøj af dem alle. Du skriver,
          hvad du vil have, og alt det praktiske følger bare med: dine kolleger
          kan logge ind, appen kan huske det, I taster ind, og den ligger klar
          på nettet med det samme. I den mest grundige sammenlignende test jeg
          fandt (seks værktøjer fik nøjagtig samme opgave) var Base44 det
          eneste, hvor alt bare virkede i første forsøg.
        </p>
        <p className="mb-[18px]">
          Der er én ting, du skal vide, inden du vælger den: en app bygget i
          Base44 bliver boende hos Base44. Hvis den en dag bliver så vigtig,
          at I vil have en udvikler til at bygge videre på den, kan den ikke
          rigtig flytte med. Så skal den bygges forfra. For interne værktøjer,
          der bare skal virke, er det sjældent et problem. For noget, der kan
          vokse sig stort, er det værd at tænke over fra start.
        </p>
        <VerdictBox
          label="Vælg Base44 hvis"
          text="Du vil have den nemmeste start overhovedet og bygger et internt værktøj til dig selv eller teamet. Bare gå i gang, det er gratis at prøve."
        />
        <PriceLine>
          Gratis at prøve (25 beskeder om måneden) · Betalt fra ca. 110 kr./md.
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ LOVABLE ============ */}
      <section className="my-16 scroll-mt-10" id="lovable">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">02</span>
          <span>Lovable</span>
          <span className="text-muted">· sværhedsgrad: 2 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Det bedste valg for de fleste
        </h2>
        <p className="mb-[18px]">
          Lovable er det værktøj, jeg vil pege på for de fleste. Det laver de
          flotteste og mest gennemførte resultater i testene, og det har én
          afgørende fordel: det, Lovable bygger til dig, er dit. Bliver appen
          en dag vigtig nok til, at en udvikler skal overtage og bygge videre,
          kan det lade sig gøre uden at starte forfra. Et bureau, der testede
          begge, sagde det meget præcist: til alt, der skal leve videre, vender
          de altid tilbage til Lovable.
        </p>
        <p className="mb-[18px]">
          Ulemperne er ærligt beskrevet af folk, der har brugt det meget: på
          store projekter kan værktøjet miste overblikket og komme til at
          ødelægge noget, det selv har bygget, og så bruger man penge på at
          rette frem og tilbage. Rådet fra de erfarne: hold dine første
          projekter små og afgrænsede, så er Lovable en fornøjelse.
        </p>
        <VerdictBox
          label="Vælg Lovable hvis"
          text="Du vil bygge noget, der skal bruges af flere end dig selv, og som måske skal leve videre og vokse. Den bedste balance mellem nemt nu og frit senere."
        />
        <PriceLine>
          Gratis at prøve (5 forsøg om dagen) · Betalt fra ca. 175 kr./md.
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ REPLIT ============ */}
      <section className="my-16 scroll-mt-10" id="replit">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">03</span>
          <span>Replit</span>
          <span className="text-muted">· sværhedsgrad: 4 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Mest kraft, mest bøvl
        </h2>
        <p className="mb-[18px]">
          Replit kan mere end de andre og vandt den grundigste tekniske
          sammenligning. Men det føles som at træde ind i et værksted for
          udviklere, og for dig, der bare vil have noget bygget, er det
          overvældende. Vigtigst: prisen er uforudsigelig. Replit tager
          betaling efter, hvor meget arbejde AI&apos;en laver, og den har det
          med at lave mere, end du bad om. Brugere fortæller om at have brugt
          en tredjedel af månedsbudgettet på en enkelt aften, og aktive brugere
          ender ofte med regninger på 700-2.000 kr. om måneden oveni
          abonnementet.
        </p>
        <VerdictBox
          label="Vælg Replit hvis"
          text="Der sidder en i teamet, der har prøvet lidt af det her før og har lyst til mere kraft. Ellers: start et af de andre steder."
        />
        <PriceLine>
          Gratis at prøve (begrænset) · Betalt fra ca. 175 kr./md. plus
          forbrug, og forbruget skal man holde øje med
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ V0 ============ */}
      <section className="my-16 scroll-mt-10" id="v0">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">04</span>
          <span>v0</span>
          <span className="text-muted">· sværhedsgrad: 4 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Kun til flotte skærmbilleder
        </h2>
        <p className="mb-[18px]">
          v0 laver de flotteste skærmbilleder af dem alle, og det går
          lynhurtigt: fire minutter i en af testene. Men det er også alt, hvad
          den laver. Det, der kommer ud, ser ud som en færdig app, men der er
          ikke noget bagved: den kan ikke huske det, man taster ind, og ingen
          kan logge ind. I den store sammenlignende test blev v0&apos;s
          resultat beskrevet som &ldquo;flot, men virkede overhovedet
          ikke&rdquo;. Skal du overbevise ledelsen om en idé med noget, der
          ligner den færdige løsning, er den perfekt. Skal værktøjet bruges i
          hverdagen, skal du kigge på de andre.
        </p>
        <VerdictBox
          label="Vælg v0 hvis"
          text="Du skal sælge en idé internt og vil vise, hvordan løsningen kunne se ud, i stedet for at beskrive den i PowerPoint."
        />
        <PriceLine>
          Gratis at prøve (op til 7 beskeder om dagen) · Betalt fra ca. 210
          kr./md.
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ BOLT ============ */}
      <section className="my-16 scroll-mt-10" id="bolt">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">05</span>
          <span>Bolt</span>
          <span className="text-muted">· sværhedsgrad: 3 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Svær at anbefale lige nu
        </h2>
        <p className="mb-[18px]">
          Bolt er hurtig at komme i gang med, men den klarede sig konsekvent
          dårligst i de sammenlignende tests: login der ikke virkede, fejl ved
          første forsøg, og ønsker der bare aldrig blev bygget. I en test med
          point fik den 6 ud af 15, hvor Lovable og Base44 begge fik 13. Det
          kan sagtens ændre sig, værktøjerne udvikler sig hurtigt, men lige nu
          er der ingen grund til at starte her, når de andre findes.
        </p>
        <VerdictBox
          label="Vælg Bolt hvis"
          text="Du er nysgerrig og vil eksperimentere. Ikke hvis du skal have noget til at virke første gang."
        />
        <PriceLine>
          Gratis at prøve · Betalt fra ca. 175 kr./md.
        </PriceLine>
      </section>

      {/* ============ SAMMENLIGNING ============ */}
      <section className="my-16 scroll-mt-10" id="sammenligning">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Det samlede overblik
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="font-mono text-[10px] font-medium tracking-widest uppercase text-muted border-b-2 border-ink">
                <th className="text-left py-3 pr-3"></th>
                <th className="text-left py-3 px-3">Base44</th>
                <th className="text-left py-3 px-3">Lovable</th>
                <th className="text-left py-3 px-3">Replit</th>
                <th className="text-left py-3 px-3">v0</th>
                <th className="text-left py-3 px-3">Bolt</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sværhedsgrad (1-5)", "1", "2", "4", "4", "3"],
                ["En hel app der virker", "Ja", "Ja", "Ja", "Nej, kun skærmbilleder", "Ja, med bøvl"],
                ["Kan en udvikler overtage den senere?", "Nej, reelt ikke", "Ja", "Delvist", "Delvist", "Ja"],
                ["Betalt fra (ca.)", "110 kr./md.", "175 kr./md.", "175 kr./md. + forbrug", "210 kr./md.", "175 kr./md."],
                ["Gratis at prøve", "Ja", "Ja", "Begrænset", "Ja", "Ja"],
              ].map((row, i) => (
                <tr key={row[0]} className={i === 0 ? "" : "border-t border-dotted border-rule"}>
                  <td className="py-3 pr-3 font-medium text-ink">{row[0]}</td>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className="py-3 px-3 text-ink-soft">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-muted mt-4">
          Priser tjekket hos leverandørerne 11. juli 2026, omregnet fra USD.
          De ændrer sig ofte.
        </p>
      </section>

      {/* ============ TRE TING ============ */}
      <section className="my-16 scroll-mt-10" id="tre-ting">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          De tre ting, demoerne ikke fortæller dig
        </h2>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          1. Du betaler pr. forsøg, ikke pr. resultat
        </h3>
        <p className="mb-[18px]">
          Alle værktøjerne sælger dig et antal forsøg om måneden, og et forsøg
          tæller, uanset om det lykkedes. Beder du værktøjet rette en fejl, og
          det ikke virker, har det stadig kostet et forsøg. En simpel app
          koster typisk 70-100 kr. at bygge færdig. Men rammer du et problem,
          AI&apos;en ikke kan løse, kan det løbe op. Mit råd: har du prøvet at
          rette det samme problem fem gange uden held, så stop. Det er
          billigere at spørge et menneske end at blive ved med at trykke på
          knappen.
        </p>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          2. Det nemmeste værktøj at starte i er det sværeste at forlade
        </h3>
        <p className="mb-[18px]">
          Stil ét spørgsmål, før du vælger: hvis det her bliver vigtigt for
          os, kan vi så tage det med os videre? Med Lovable er svaret ja: det
          byggede er jeres og kan overdrages til en udvikler. Med Base44 er
          svaret reelt nej: appen bliver boende hos dem. Det gør ikke Base44
          til et dårligt valg, det er stadig det nemmeste sted at starte. Men
          vælg med åbne øjne: der findes et dokumenteret eksempel, hvor det
          kostede seks ugers arbejde at flytte en app, der var bygget på tre
          måneder.
        </p>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          3. Persondata og betalinger kræver et ekstra sæt øjne
        </h3>
        <p className="mb-[18px]">
          I en af testene byggede et af værktøjerne en app med et hul, hvor
          uvedkommende i princippet kunne se de data, der lå i den. Værktøjets
          egen kontrolfunktion opdagede det selv bagefter. Konklusionen er
          ikke, at du skal lade være. Byg løs på interne værktøjer med
          ufarlige data. Men skal appen håndtere kundedata, persondata eller
          penge, så få en teknisk person til at kigge den igennem, før den
          slippes løs. Det er en times arbejde, der kan spare dig for en rigtig
          dårlig dag.
        </p>

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-7 pl-7 border-l-2 border-ink">
          Der findes firmaer, der lever af at redde folks fastkørte AI-byggede
          apps, til priser op til 50.000 kr. Det siger alt om, hvor de sidste
          30 % af arbejdet ligger, og hvorfor det betaler sig at starte småt.
        </blockquote>
      </section>

      {/* ============ KOM I GANG ============ */}
      <section className="my-16 scroll-mt-10" id="kom-i-gang">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Sådan kommer I i gang
        </h2>
        <p className="mb-[18px]">
          Du behøver ikke et projekt, et budget eller ledelsens godkendelse
          for at tage første skridt. Sådan her ville jeg gøre:
        </p>
        <ol className="list-none">
          {[
            ["Find 2-3 kolleger, der har lyst.", "Interesse slår titel. De bedste hold blander en, der ejer problemet, med en, der er nysgerrig på værktøjerne."],
            ["Vælg et lille, irriterende hverdagsproblem.", "Ikke jeres største strategiske udfordring, men det dér, der koster en time hver uge. Mangler I inspiration, ligger der 17 konkrete idéer i idékataloget, eller chat med case-finderen og få et bud skræddersyet til jer."],
            ["Beskriv opgaven, som om du forklarer den til en ny kollega.", "Hvad skal værktøjet kunne, hvem skal bruge det, hvordan ser en god dag ud med det? Jo mere konkret beskrivelse, jo bedre resultat. Det var det tydeligste mønster i alle tests."],
            ["Brug en eftermiddag i Base44 og Lovable, gratis.", "Giv begge værktøjer den samme opgave, og se hvad der sker. Det er den hurtigste måde at forstå, hvad det her kan, og det koster ingenting."],
            ["Vil I have flere med: hold en AI-innovationsdag.", "Én dag, ét problem, et lille team, og en fungerende løsning I selv har bygget. Det er den hurtigste måde at få en hel organisation til at forstå, hvad der er muligt."],
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
        <p className="mb-[18px] mt-6">
          Til punkt 2: se{" "}
          <a
            href="/ai-innovationsdag/ideer"
            data-track-event="field_note_universe_click"
            data-track-target="idekatalog-playbook"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            idékataloget
          </a>{" "}
          eller{" "}
          <a
            href="/ai-innovationsdag#vaerktoej"
            data-track-event="field_note_universe_click"
            data-track-target="case-finder-playbook"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            case-finderen
          </a>
          . Til punkt 5: læs om{" "}
          <a
            href="/ai-innovationsdag"
            data-track-event="field_note_universe_click"
            data-track-target="innovationsdag"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            AI-innovationsdagen
          </a>
          , eller kør den selv med{" "}
          <a
            href="/ai-innovationsdag/guide"
            data-track-event="field_note_universe_click"
            data-track-target="diy-guide"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            min gratis gør-det-selv-guide
          </a>
          .
        </p>
      </section>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Hvorfor det her betyder noget
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Barrieren er ikke teknik længere. Det er at komme i gang.
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Den hurtigste vej til at forstå, hvad det her kan for jeres
          forretning, er ikke flere artikler. Det er en dag, hvor jeres eget
          team bygger en løsning på et problem fra jeres egen hverdag, og går
          hjem med både løsningen og troen på, at de kan. Det er præcis, hvad
          en AI-innovationsdag er.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="/ai-innovationsdag"
            data-track-event="field_note_universe_click"
            data-track-target="innovationsdag-closer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Se AI-innovationsdagen →
          </a>
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-vibe-coding-guide"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book en snak
          </a>
        </div>
      </div>

      {/* ============ ARTICLE FOOTER / KILDER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        Guiden bygger på 20+ uafhængige hands-on-kilder fra 2025-2026, heriblandt
        seks tests hvor samme person byggede samme app i flere værktøjer. De
        vigtigste:
        <br />
        <br />
        {[
          ["Aquavoice: Vibe Coding Showdown (6 værktøjer, samme prompt)", "https://aquavoice.com/blog/vibe-coding-showdown-2025-base44-vs-replit-vs-bolt-vs-loveable-vs-rork-vs-v0"],
          ["Technically.dev: samme app i 4 værktøjer, marts 2026", "https://technically.dev/posts/vibe-coding-tool-comparison"],
          ["Head-to-head: Lovable vs Base44 vs Bolt (video)", "https://www.youtube.com/watch?v=GfnkxLb41ZM"],
          ["The Tool Nerd: 6 måneders hands-on med Replit, Bolt og Lovable", "https://www.thetoolnerd.com/p/replit-vs-bolt-vs-lovable-2025-handson-review-thetoolnerd"],
          ["Zapier: Lovable vs Bolt vs Replit, opdateret juli 2026", "https://zapier.com/blog/lovable-vs-bolt/"],
          ["Anna Arteeva: AI prototyping stack for PM'er og designere", "https://annaarteeva.medium.com/choosing-your-ai-prototyping-stack-lovable-v0-bolt-replit-cursor-magic-patterns-compared-9a5194f163e9"],
          ["InfoWorld: Replits prisproblemer", "https://www.infoworld.com/article/4059876/replit-update-sparks-developers-dissatisfaction-over-pricing.html"],
          ["Superdesign: v0-review med bruger-erfaringer, juni 2026", "https://superdesign.dev/blog/v0-review"],
          ["EntreResource: Lovable efter 100+ timer", "https://entreresource.com/loveable-ai/"],
          ["Altar.io: landskabsoverblik inkl. begrænsninger og sikkerhed", "https://altar.io/lovable-vs-bolt-vs-v0-vs-replit-vs-base44/"],
        ].map(([label, url]) => (
          <span key={url}>
            <a
              href={url}
              data-umami-event="field_note_source_click"
              data-umami-event-source={label}
              className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
            <br />
          </span>
        ))}
        <br />
        Researchet, verificeret og skrevet af{" "}
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

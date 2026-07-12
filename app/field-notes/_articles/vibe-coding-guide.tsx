import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Notes: Vibe coding uden kode-baggrund · SpAIke",
  description:
    "Base44, Lovable, Replit, v0 eller Bolt? Jeg har gennemgået 20+ uafhængige hands-on-tests og kogt det ned til en guide for ikke-tekniske: hvad værktøjerne kan, hvad de koster, og hvor de låser dig fast.",
  openGraph: {
    title: "Vibe coding uden kode-baggrund: sådan vælger du det rigtige værktøj",
    description:
      "20+ uafhængige tests af Base44, Lovable, Replit, v0 og Bolt, kogt ned til én guide for ikke-tekniske. Med verificerede priser og de tre ting, demoerne ikke fortæller dig.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/vibe-coding-guide",
  },
  twitter: {
    card: "summary",
    title: "Vibe coding uden kode-baggrund: sådan vælger du det rigtige værktøj",
    description:
      "20+ uafhængige tests af Base44, Lovable, Replit, v0 og Bolt, kogt ned til én guide for ikke-tekniske.",
  },
};

interface ToolVerdict {
  label: string;
  text: string;
}

function VerdictBox({ label, text }: ToolVerdict) {
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
        Vibe coding uden kode-baggrund:{" "}
        <em className="italic font-medium text-amber-dark">
          sådan vælger du det rigtige værktøj
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Skriv en sætning, få en app. Det virker faktisk, men kun til et vist
        punkt, og værktøjerne er langt fra ens. Jeg har gennemgået 20+
        uafhængige hands-on-tests og kogt dem ned til én guide for folk uden
        teknisk baggrund.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Research: 24 kilder, heraf 6 sammenlignende hands-on-tests · 2025-2026</span>
        <span>Alle priser verificeret mod leverandørernes egne prissider 11. juli 2026</span>
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
          Vibe coding-værktøjerne har ét fælles grundvilkår, og det er det
          vigtigste fund på tværs af alle kilder: de får dig 60-70 % af vejen.
          Første version, første brugere, en demo du kan vise ledelsen eller
          investorer: helt realistisk. Et produktionsklart system med
          betalinger, følsomme data og oppetidskrav: nej, ikke uden teknisk
          hjælp til det sidste stykke.
        </p>
        <p className="mb-[18px]">
          Vælger du værktøj med det i baghovedet, bliver du ikke skuffet. Og
          valget betyder mere, end demoerne antyder, for forskellene ligger
          ikke i hvor flot den første version ser ud. De ligger i prismodellen,
          i hvad der sker når noget går galt, og i hvor nemt du kan tage din
          app med dig videre.
        </p>
        <p className="mb-[18px]">
          Guiden her er til forretningsfolk, product managers og teams uden
          egen udvikler. Jeg har bevidst udeladt AI-udviklerværktøjer som
          Cursor og Windsurf: her handler det kun om værktøjer, hvor du
          skriver på almindeligt dansk (eller engelsk) og får en kørende,
          hostet app tilbage.
        </p>
      </section>

      {/* TOC */}
      <nav className="border border-rule px-7 py-6 my-12">
        <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-muted mb-3.5">
          I denne udgave
        </div>
        <ol className="list-none">
          {[
            { href: "#base44", text: "Base44: det nemmeste sted at starte", tag: "Tool 01" },
            { href: "#lovable", text: "Lovable: den bedste balance for de fleste", tag: "Tool 02" },
            { href: "#replit", text: "Replit: mest kraft, mest bøvl", tag: "Tool 03" },
            { href: "#v0", text: "v0: kun til flotte brugerflader", tag: "Tool 04" },
            { href: "#bolt", text: "Bolt: svær at anbefale lige nu", tag: "Tool 05" },
            { href: "#sammenligning", text: "Sammenligningen på én skærm", tag: "Tabel" },
            { href: "#tre-ting", text: "De tre ting, demoerne ikke fortæller dig", tag: "Vigtigst" },
            { href: "#kom-i-gang", text: "Sådan kommer du i gang", tag: "Playbook" },
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

      {/* ============ BASE44 ============ */}
      <section className="my-16 scroll-mt-10" id="base44">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">01</span>
          <span>Base44</span>
          <span className="text-muted">· teknisk krav: 1 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Det nemmeste sted at starte
        </h2>
        <p className="mb-[18px]">
          Base44 er det mest begyndervenlige af alle værktøjerne, og i den mest
          grundige sammenlignende test jeg fandt (seks værktøjer, samme
          detaljerede opgave) var Base44 det eneste, der leverede alle
          kernefunktioner i virkende stand fra første forsøg: login, indhold,
          billedupload, det hele.
        </p>
        <p className="mb-[18px]">
          Men der er en pris, og den er vigtig: Base44 har den hårdeste
          indlåsning i feltet. Selv når du eksporterer din kode, bliver
          backend, database og login-system kørende på Base44&apos;s servere.
          Vokser din app ud af platformen, skal den bygges om, ikke flyttes.
          Flere kilder melder desuden om ustabil drift.
        </p>
        <VerdictBox
          label="Vælg Base44 hvis"
          text="Du er helt ikke-teknisk og bygger et internt værktøj, der gerne må blive boende på platformen. Nemmeste start i feltet, men vid hvad du siger ja til."
        />
        <PriceLine>
          Gratis: 25 beskeder/md. · Betalt fra 16 USD/md. (årlig betaling) ·
          Kode-eksport fra Starter-planen, men backend forbliver hos Base44
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ LOVABLE ============ */}
      <section className="my-16 scroll-mt-10" id="lovable">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">02</span>
          <span>Lovable</span>
          <span className="text-muted">· teknisk krav: 2 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Den bedste balance for de fleste
        </h2>
        <p className="mb-[18px]">
          Lovable rammer det bedste kompromis mellem brugervenlighed og frihed.
          Den bygger hele appen inklusive database og login, laver de flotteste
          brugerflader i flere af testene, og vigtigst: du kan eksportere det
          hele til dit eget GitHub-repo med en standard-backend, som enhver
          udvikler kan arbejde videre på. Et bureau formulerede det præcist i
          deres test: de vender altid tilbage til Lovable til kundearbejde,
          fordi en backend man ikke kan eksportere er en dealbreaker.
        </p>
        <p className="mb-[18px]">
          Svaghederne er lige så veldokumenterede: credits bliver også brugt,
          når AI&apos;en fejler, og på større projekter kan den miste
          overblikket og ødelægge ting, den selv har bygget. En bruger med
          100+ timer i værktøjet undgår bevidst projekter med betalinger og
          komplekse integrationer.
        </p>
        <VerdictBox
          label="Vælg Lovable hvis"
          text="Du er ikke-teknisk, men har ambitioner om et rigtigt produkt, som en udvikler måske skal overtage senere. Koden er reelt din, og det er den største enkeltforskel i feltet."
        />
        <PriceLine>
          Gratis: 5 credits/dag · Pro fra 25 USD/md. (100 credits) · Fuld
          eksport af både frontend og backend til eget GitHub-repo
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ REPLIT ============ */}
      <section className="my-16 scroll-mt-10" id="replit">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">03</span>
          <span>Replit Agent</span>
          <span className="text-muted">· teknisk krav: 3-4 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Mest kraft, mest bøvl
        </h2>
        <p className="mb-[18px]">
          Replit Agent er det mest kapable værktøj i feltet: database, login,
          integrationer og deployment i én pakke, og den vandt den grundigste
          tekniske sammenligning fra marts 2026. Men den føles som et
          udviklerværktøj, og prisen er blevet et reelt problem. Siden skiftet
          til forbrugsbaseret afregning melder brugere om uforudsigelige
          regninger, og aktive brugere rapporterer 100-300 USD/md. oveni
          abonnementet. Agenten har også en dokumenteret tendens til at lave
          om på ting, du ikke har bedt om.
        </p>
        <VerdictBox
          label="Vælg Replit hvis"
          text="Du har lidt teknisk selvtillid og bygger interne værktøjer med database og integrationer, og du er klar til at holde øje med forbruget."
        />
        <PriceLine>
          Gratis: begrænset prøveadgang · Core 25 USD/md. (20 ved årlig
          betaling) plus forbrugsafregnet agent-arbejde
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ V0 ============ */}
      <section className="my-16 scroll-mt-10" id="v0">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">04</span>
          <span>v0 by Vercel</span>
          <span className="text-muted">· teknisk krav: 4 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Kun til flotte brugerflader
        </h2>
        <p className="mb-[18px]">
          v0 laver flotte, professionelle brugerflader hurtigere og billigere
          end noget andet værktøj i testene (fire minutter i den hurtigste).
          Men den bygger kun forsiden: ingen database, intet login, ingen
          backend. I den store sammenlignende test var v0&apos;s app
          &ldquo;flot, men virkede overhovedet ikke&rdquo;. Til landing pages
          og klikbare prototyper er den fremragende; som selvstændig
          app-builder for ikke-tekniske er den det ikke.
        </p>
        <VerdictBox
          label="Vælg v0 hvis"
          text="Du skal bruge en flot landing page eller en klikbar prototype til at sælge en idé internt eller eksternt. Ikke hvis appen skal kunne noget bagved."
        />
        <PriceLine>
          Gratis: 5 USD credits/md. (max 7 beskeder/dag) · Team 30
          USD/bruger/md. · Premium-planen (20 USD) er lukket for nye brugere
        </PriceLine>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ BOLT ============ */}
      <section className="my-16 scroll-mt-10" id="bolt">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">05</span>
          <span>Bolt.new</span>
          <span className="text-muted">· teknisk krav: 3 af 5</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Svær at anbefale lige nu
        </h2>
        <p className="mb-[18px]">
          Bolt er hurtig at komme i gang med og populær til hackathons, men den
          klarede sig konsekvent dårligst i de sammenlignende tests: login der
          ikke virkede, databasefejl ved første forsøg, og features fra
          kravspecifikationen der bare aldrig blev bygget. I en pointbaseret
          test fik den 6 af 15 point, mod 13 af 15 til både Lovable og Base44.
        </p>
        <VerdictBox
          label="Vælg Bolt hvis"
          text="Du eksperimenterer og vil prøve grænser af. Ikke hvis du skal have noget til at virke første gang."
        />
        <PriceLine>
          Gratis: 300K tokens/dag · Pro 25 USD/md. (10 mio. tokens, ubrugte
          ruller over) · Fuld GitHub-eksport
        </PriceLine>
      </section>

      {/* ============ SAMMENLIGNING ============ */}
      <section className="my-16 scroll-mt-10" id="sammenligning">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Sammenligningen på én skærm
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
                ["Teknisk krav (1-5)", "1", "2", "3-4", "4", "3"],
                ["Hel app inkl. backend", "Ja", "Ja", "Ja", "Nej", "Ja"],
                ["Kan koden flyttes væk?", "Delvist", "Ja, fuldt", "Delvist", "Kun frontend", "Ja"],
                ["Betalt fra", "16 USD/md.", "25 USD/md.", "25 USD/md. + forbrug", "30 USD/md.", "25 USD/md."],
                ["Gratis at prøve", "25 beskeder/md.", "5 credits/dag", "Begrænset trial", "5 USD/md.", "300K tokens/dag"],
              ].map((row, i) => (
                <tr key={row[0]} className={i === 0 ? "" : "border-t border-dotted border-rule"}>
                  <td className="py-3 pr-3 font-medium text-ink whitespace-nowrap">{row[0]}</td>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className="py-3 px-3 text-ink-soft">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-muted mt-4">
          Priser verificeret mod leverandørernes prissider 11. juli 2026. De
          ændrer sig ofte.
        </p>
      </section>

      {/* ============ TRE TING ============ */}
      <section className="my-16 scroll-mt-10" id="tre-ting">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          De tre ting, demoerne ikke fortæller dig
        </h2>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          1. Du betaler også, når AI&apos;en fejler
        </h3>
        <p className="mb-[18px]">
          Alle værktøjerne afregner per forsøg, ikke per succes. Dokumenterede
          eksempler fra kilderne: 100 USD brændt på to uger uden fremskridt,
          30 USD på to dage hvor en femtedel gik til at rette værktøjets egne
          fejl. Realistisk budget for en simpel app: 10-15 USD, men med lang
          hale hvis du rammer en fejl, AI&apos;en ikke kan løse. Mit råd: har
          du brugt mange credits på det samme problem uden fremskridt, så stop
          med at prompte og få et menneske til at kigge på det.
        </p>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          2. Det nemmeste værktøj at starte i er det sværeste at forlade
        </h3>
        <p className="mb-[18px]">
          Indlåsning er den største reelle forskel mellem værktøjerne, og den
          er usynlig indtil den dag, du vil videre. Stil ét spørgsmål før du
          vælger: kan jeg eksportere HELE appen, også database og login? Hos
          Lovable er svaret ja. Hos Base44 er det reelt nej. Der findes en
          dokumenteret case, hvor det tog seks uger og 18.000 USD at flytte en
          app, der var bygget på tre måneder.
        </p>

        <h3 className="font-serif font-semibold text-[22px] leading-[1.2] text-ink mt-10 mb-4">
          3. Sikkerhed er dit ansvar, ikke værktøjets
        </h3>
        <p className="mb-[18px]">
          I en af testene byggede Lovable en database med et sikkerhedshul,
          som værktøjets egen sikkerhedsrådgiver bagefter flagede. Byg gerne
          interne værktøjer og prototyper selv, men lad ikke en AI-genereret
          app håndtere persondata eller betalinger uden et teknisk review.
        </p>

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-7 pl-7 border-l-2 border-ink">
          Der findes et helt marked for at redde fastkørte vibe
          coding-projekter, med priser fra 299 til 7.499 USD. Det siger alt
          om, hvor de sidste 30 % af arbejdet ligger.
        </blockquote>
      </section>

      {/* ============ KOM I GANG ============ */}
      <section className="my-16 scroll-mt-10" id="kom-i-gang">
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Sådan kommer du i gang
        </h2>
        <ol className="list-none">
          {[
            ["Start med et internt værktøj, ikke et kundevendt produkt.", "Lavere risiko, hurtigere gevinst, og fejlene er billige."],
            ["Prøv Base44 og Lovable på deres gratis planer med den samme opgave.", "Det koster en eftermiddag og viser dig, hvad der passer til din måde at tænke på."],
            ["Skriv en kravspecifikation, før du prompter.", "De bedste resultater i testene kom fra detaljerede beskrivelser, ikke enkeltlinjer."],
            ["Sæt et budget-loft fra start.", "Og hold øje med credit-forbruget, især i Replit."],
            ["Planlæg de sidste 30 % fra dag ét.", "Beslut på forhånd, hvem der hjælper dig, når appen er 70 % færdig og skal gøres klar til rigtige brugere."],
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
          Værktøjerne er klar. Spørgsmålet er, hvad I bygger først.
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          Den hurtigste vej til at forstå, hvad vibe coding kan for jeres
          forretning, er ikke flere artikler. Det er en eftermiddag, hvor
          teamet selv bygger noget. Jeg kører hands-on workshops og
          hackathons, hvor ikke-tekniske teams bygger deres første rigtige
          værktøj og går hjem med både appen og dømmekraften til at vælge
          rigtigt.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-vibe-coding-guide"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book en snak →
          </a>
          <a
            href="https://spaike.dk"
            data-umami-event="field_note_closer_more_click"
            data-umami-event-article="vibe-coding-guide"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Mere fra SpAIke
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
          ["Altar.io: landskabsoverblik inkl. lock-in og sikkerhed", "https://altar.io/lovable-vs-bolt-vs-v0-vs-replit-vs-base44/"],
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

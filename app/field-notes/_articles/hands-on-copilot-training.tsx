import type { Metadata } from "next";
import StarterPrompt from "../../components/field-notes/StarterPrompt";
import ThreeLevels from "../../components/field-notes/illustrations/ThreeLevels";
import AgentFlow from "../../components/field-notes/illustrations/AgentFlow";

/*
 * ────────────────────────────────────────────────────────────────────────
 * BESLUTNINGER (spec §9). Bygget med tydelige placeholders hvor de mangler.
 *   1. PRIS: default nedenfor er "Efter aftale" (intet opfundet tal).
 *      Skift til "Fra DKK X" hvis du vil have et offentligt anker. Se PRICE_TODO.
 *   2. SPROG: dansk (afklaret 2026-11-05, matcher resten af spaike.dk og den
 *      danske målgruppe). En engelsk variant kan ligge paa et -en-slug.
 *   3. SLUG: /field-notes/hands-on-copilot-training. Aendr fil + index
 *      + sitemap + OG-url hvis du vil have noget andet.
 *   4. FORINTERVIEW: beskrevet som et let forberedelsestrin i §"Saadan foregaar det".
 *      Loeft det til en fremhaevet feature hvis det skal baere mere vaegt.
 *   5. LEAD MAGNET: kompendiet er beskrevet, ikke gated. Vil du have det som
 *      en email-gated download, saa laeg en formular hvor COMPENDIUM_TODO staar.
 * ────────────────────────────────────────────────────────────────────────
 */

export const metadata: Metadata = {
  title: "Hands-on Copilot-træning | SpAIke",
  description:
    "Et praktisk Copilot-forløb på tre timer for teams der har licensen, men ikke vanen. Bygget på jeres egne opgaver, så folk går hjem med agenter der laver udkast til rigtigt arbejde, og dømmekraften til at tjekke det.",
  alternates: {
    canonical: "/field-notes/hands-on-copilot-training",
  },
  openGraph: {
    title: "Fra chat til jeres egne agenter, bygget på teamets eget arbejde",
    description:
      "Et praktisk Copilot-forløb på tre timer for teams der har Copilot, men ikke har fundet hvor det passer ind. Agenter der laver udkast til mødebriefs, referater og præsentationer fra jeres eget materiale. AI laver udkastet, I retter, beslutter og sender.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/field-notes/hands-on-copilot-training",
    images: [
      {
        url: "/og/hands-on-copilot-training.png",
        width: 1200,
        height: 630,
        alt: "Hands-on Copilot-træning: fra chat til jeres egne agenter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fra chat til jeres egne agenter, bygget på teamets eget arbejde",
    description:
      "Et praktisk Copilot-forløb på tre timer for teams der har Copilot, men ikke har fundet hvor det passer ind i hverdagen.",
    images: ["/og/hands-on-copilot-training.png"],
  },
};

const MEETING_BRIEF = `Du forbereder mig til et kundemøde. Du laver ét kort, internt mødebrief på én side, så jeg møder velforberedt op. Briefet er et udkast, kun til mine øjne, ikke noget der skal sendes ud.

Sådan finder du stoffet:
1. Find mødet i min kalender (tid, sted, deltagere). Er der flere mulige, så spørg kort hvilket.
2. Find de seneste mails med kunden, og hvad kunden har bedt om eller spurgt om.
3. Find det, jeg selv har lovet ("jeg sender", "vi vender tilbage").
4. Find interne noter, der er relevante for kunden.
5. Brug kun websøgning til generelle markedsforhold, og angiv altid kilden.

Skriv briefet i denne faste rækkefølge, kort:
- Møde: dato, tid, sted, deltagere
- Status: 2 til 3 linjer om kunden og anledningen
- Det kunden har bedt om: punkter, hvert med kilde (mail + dato)
- Det vi har lovet: punkter med frist, hvis den fremgår
- Forslag til dagsorden: 3 til 5 punkter i en naturlig rækkefølge
- Spørgsmål at stille: 3 til 5 åbne spørgsmål
- Klar før mødet: tal eller oversigter, med [MANGLER: ...] hvis de ikke findes i kilderne

Regler:
- Opfind aldrig tal, beløb, datoer eller aftaler. Står det ikke i kilderne, så skriv [MANGLER: ...].
- Briefet samler fakta og forbereder dialogen. Det giver ikke rådgivning.
- Hold det internt. Ingen kundeoplysninger i noget, der skal ud af huset.
- Afslut med "Kilder:" og en liste over de mails og noter, du har brugt.`;

const MINUTES = `Du gør rå mødenoter, et Teams-transskript eller indsat tekst til et rent referat plus opfølgning. Alt du laver er et udkast, som et menneske læser igennem, før det deles. Er det uklart hvilket møde, så spørg kort.

Leverance i denne faste rækkefølge:
1. Referat
   - Møde: navn, dato, tid
   - Deltagere, og afbud
   - Beslutninger: nummereret, én linje hver, formuleret som en beslutning ("Besluttet: ...")
   - Drøftet: korte punkter uden beslutning
   - Opgaver: en tabel med kolonnerne Hvad, Hvem, Frist
   - Næste møde: dato og tid, hvis det fremgår
2. Et udkast til opfølgningsmail til deltagerne: kort, med beslutninger og opgaver. Skal godkendes og sendes af et menneske.
3. Forslag til kalenderaftaler: næste møde og vigtige frister, som tekst. Opret dem ikke selv.
4. Uklarheder: ting i noterne der er tvetydige eller mangler en ejer eller frist.

Regler:
- Skriv kun det, der står i kilden. Gæt aldrig navne, tal, frister eller beslutninger. Mangler noget, så skriv [MANGLER: ...] og nævn det under Uklarheder.
- Hold beslutninger og drøftelser adskilt. En mening er ikke en beslutning.
- Send aldrig noget selv, og opret aldrig kalenderaftaler selv.`;

export default function HandsOnCopilotTraining() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / №&nbsp;02</span>
        <span className="text-amber-dark">7&nbsp;min læsning</span>
      </div>

      {/* HERO */}
      <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-4">
        Hands-on Copilot-træning
      </div>
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        Fra chat til jeres egne agenter,{" "}
        <em className="italic font-medium text-amber-dark">
          bygget på teamets eget arbejde
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[640px]">
        Et praktisk forløb på tre timer for teams der har Copilot, men ikke har
        fundet hvor det passer ind i hverdagen. Tre timer, på jeres egne opgaver,
        ikke en demo. Folk går hjem med agenter der laver udkast til rigtigt
        arbejde, og dømmekraften til at tjekke dem.
      </p>

      {/* PRIMARY CTA */}
      <div className="mb-10">
        <a
          href="#book"
          data-track-event="copilot_training_hero_cta"
          className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
        >
          Book et forløb →
        </a>
      </div>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>En field note om hvordan jeg kører forløbet · SpAIke · 2026</span>
        <span>
          Skrevet ud fra et nyligt tre-timers forløb med et kundeteam. Eksempler
          er generaliseret, intet klient-materiale vises.
        </span>
        <span>
          Af{" "}
          <a
            href="https://spaike.dk"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            SpAIke
          </a>
        </span>
      </div>

      {/* ============ PROBLEMET ============ */}
      <section className="lede">
        <p className="mb-[18px] first-letter:font-serif first-letter:text-[64px] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1 first-letter:mr-2 first-letter:-mb-1 first-letter:text-amber-dark">
          Det er ikke det samme at have Copilot som at bruge det. De fleste åbner
          chatboksen, beder den rette en mail til, og stopper der. Licensen er
          betalt, værktøjet sidder inde i de programmer folk allerede arbejder i,
          og alligevel ligner hverdagen stort set sig selv.
        </p>
        <p className="mb-[18px]">
          Det hul er ikke et værktøjsproblem. En licens er ikke en strategi, og
          en demo ændrer ikke en vane. Det der ændrer en vane, er at sætte sig
          med det arbejde folk allerede kender, deres egne mails, møder og
          dokumenter, og bygge noget småt der laver udkast til en opgave de har
          hver uge.
        </p>
        <p className="mb-[18px]">
          Så det er det forløbet er: tre timer, hands-on, på teamets egne
          opgaver. Når vi er færdige, har folk bygget en lille agent, startet den
          selv og tjekket hvad den lavede. Pointen er metoden, så de kan gøre det
          samme med resten af deres arbejde bagefter.
        </p>
      </section>

      {/* ============ SAADAN FOREGAAR DET ============ */}
      <section className="my-16 scroll-mt-10" id="format">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Sådan foregår det
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Tre timer, hands-on, bygget op om jeres opgaver
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 border border-rule rounded overflow-hidden my-8">
          {[
            { k: "Format", v: "Tre timer, hands-on. Folk arbejder i Copilot hele vejen, ikke ser på slides." },
            { k: "Hold", v: "Op til omkring 20 personer, i par, så ingen sidder alene." },
            { k: "To spor", v: "Et begynder-spor og et øvet-spor, så alle går hjem med noget de kan bruge." },
            { k: "Copilot-først", v: "Bygget på den Copilot I allerede har, inde i jeres eget Microsoft-miljø." },
          ].map((f, i) => (
            <div
              key={f.k}
              className={`px-5 py-5 ${i % 2 === 1 ? "sm:border-l border-rule" : ""} ${i > 1 ? "border-t border-rule" : i === 1 ? "border-t sm:border-t-0 border-rule" : ""}`}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber-dark mb-2">
                {f.k}
              </div>
              <p className="text-[15px] leading-relaxed text-ink-soft">{f.v}</p>
            </div>
          ))}
        </div>

        {/* FORINTERVIEW. TODO(beslutning 4): loeft til fremhaevet feature hvis oensket. */}
        <div className="border-l-[3px] border-amber px-5 py-4 my-7">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            Før dagen
          </div>
          <p className="text-[16px]">
            Jeg skræddersyr forløbet, før det går i gang. Et kort AI-forinterview,
            en talende agent folk taler med i et par minutter, kortlægger rollerne
            i rummet og hvad hver enkelt gerne vil have ud af tiden. Programmet og
            eksemplerne bygges så på deres svar, ikke på en generisk skabelon.
          </p>
        </div>

        <p className="mb-[18px]">
          Alle går også hjem med et kort kompendium: dagens tips og prompts, og en
          opskrift på selv at sætte agenter og rutiner op, så forløbet fortsætter
          efter jeg er gået.
        </p>
      </section>

      {/* ============ DE TRE NIVEAUER ============ */}
      <section className="my-16 scroll-mt-10" id="levels">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Det mentale landkort
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Tre niveauer: fra at spørge, til at få det gjort, til at arbejde anderledes
        </h2>
        <p className="mb-[18px]">
          Forløbet åbner med et enkelt landkort, så resten af dagen hænger sammen.
          Først spørger I en dygtig assistent. Så giver I assistenten et fast job
          og konteksten til at gøre det. Med tiden lægger I selve arbejdet
          anderledes, fordi en del af det nu kører af sig selv. De fleste teams er
          på det første niveau. Forløbet bruger det meste af tiden på det andet.
        </p>
        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <ThreeLevels />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            Spørg en dygtig assistent · ansæt den · indret kontoret anderledes
          </p>
        </div>
        <p className="mb-[18px]">
          Springet fra chat til agent er ikke en klogere model. Det er den
          kontekst I giver den. En agent skal onboardes som en ny kollega: adgang
          til værktøjerne, viden om hvordan huset arbejder, og en klar instruktion
          om jobbet, hvad den skal, hvad den ikke må, og hvordan et godt resultat
          ser ud.
        </p>
      </section>

      {/* ============ PROGRAM ============ */}
      <section className="my-16 scroll-mt-10" id="agenda">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Programmet
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Sådan ser et forløb ud, time for time
        </h2>

        <ol className="list-none border-l-2 border-rule pl-6 my-8 space-y-7">
          {[
            {
              t: "Velkomst",
              d: "~10 min",
              b: "En leder åbner: hvorfor teamet gør det her, og rammen for tiden. Det lander stærkere fra en leder end fra konsulenten alene.",
            },
            {
              t: "Modul 1 · Sådan tænker I AI",
              d: "~30 min",
              b: "De tre niveauer (chat, agenter, arbejdsgange). Kontekst som onboarding. Forskellen på gratis chat og jeres egen Copilot, og hvorfor Copilot passer til et reguleret hus, hvor data bliver inden for jeres miljø.",
            },
            {
              t: "Modul 2 · Chat i praksis",
              d: "~45 min",
              b: "Bedre mails, tekster og dokumenter. Hvad der gør en god prompt (mål, kontekst, kilde, forventning) og hvordan I giver Copilot adgang til jeres eget materiale. Øvelse 1: løs en rigtig opgave i Copilot.",
            },
            {
              t: "Pause",
              d: "~10 min",
              b: "",
            },
            {
              t: "Modul 3 · Agenter og triggers",
              d: "~45 min · hovedfokus",
              b: "En agent er en gemt instruktion med et fast job. Vi åbner de fire agenter, ser på skemalægning og triggers, og går opskriften på at bygge en igennem. Øvelse 2: byg din første agent.",
            },
            {
              t: "Modul 4 · Det næste niveau",
              d: "~20 min",
              b: "Hele arbejdsgange, ikke hurtigere udgaver af de gamle. Et spor for dem der vil bygge mere selv. Og pointen at agenter kun er så gode som den viden de får.",
            },
            {
              t: "Modul 5 · Tryghed og kom i gang",
              d: "~15 min",
              b: "Hvad der beskytter jer, hvad I selv skal holde øje med, og det første konkrete skridt hver enkelt tager i denne uge.",
            },
          ].map((m) => (
            <li key={m.t} className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-amber border-2 border-cream" />
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-serif text-[20px] font-semibold text-ink">
                  {m.t}
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                  {m.d}
                </span>
              </div>
              {m.b && (
                <p className="text-[15.5px] leading-relaxed text-ink-soft mt-1.5">
                  {m.b}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ============ AGENTERNE ============ */}
      <section className="my-16 scroll-mt-10" id="agents">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Agenterne vi bygger sammen
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Fire kontoropgaver, hver gjort til en lille agent
        </h2>
        <p className="mb-[18px]">
          Det er de fire agenter jeg tager med til et forløb. Det er helt
          almindelige kontoropgaver, ikke AI-udstillingsvinduer, og de er bygget
          ud fra det teamet bad om i forinterviewet. De gør alle det samme: de
          læser det rigtige input, og de laver et udkast. Et menneske retter,
          beslutter og sender.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {[
            {
              tag: "C",
              title: "Mødebrief",
              does: "Forbereder en rådgiver før et kundemøde.",
              input:
                "Input: kalenderen, de seneste mails med kunden, hvad der er lovet, og relevante interne noter.",
              out:
                "Leverer: ét kort internt mødebrief på én side, status, hvad kunden har bedt om, hvad der er lovet, forslag til dagsorden, og spørgsmål at stille.",
            },
            {
              tag: "D",
              title: "Referat og opfølgning",
              does: "Gør rå noter eller et Teams-transskript til et rent referat.",
              input: "Input: mødenoter, et transskript, eller tekst indsat i chatten.",
              out:
                "Leverer: struktureret referat (beslutninger, drøftet, opgaver med ejer og frist), et udkast til opfølgningsmail, og forslag til kalenderaftaler. Den opretter og sender intet selv.",
            },
            {
              tag: "B",
              title: "Præsentation i husets stil",
              does: "Laver et udkast til en præsentation i jeres eget udtryk og tone.",
              input: "Input: emne, målgruppe og længde, plus jeres stil og skabeloner.",
              out:
                "Leverer: en disposition, færdige slide-tekster, og en prompt til Copilot i PowerPoint, så den kan bygge selve slidesne i husets stil.",
            },
            {
              tag: "A",
              title: "Nyhedsbrev og kundeindhold",
              does: "Laver udkast til kundeindhold i en fast, nøgtern tone.",
              input: "Input: stikord, et link, eller indsat kildetekst, med eventuelle tal.",
              out:
                "Leverer: et udkast til en sektion i en fast struktur, med husets disclaimer. Tal kommer fra input, aldrig gættet, og en tjekliste til godkenderen.",
            },
          ].map((a) => (
            <div
              key={a.tag}
              className="bg-cream-deep border border-rule rounded px-5 py-5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-block bg-ink text-amber font-mono text-[12px] font-bold px-2.5 py-0.5 rounded-sm">
                  {a.tag}
                </span>
                <h3 className="font-serif text-[20px] font-semibold text-ink">
                  {a.title}
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-ink">{a.does}</p>
              <p className="text-[13.5px] leading-relaxed text-muted">{a.input}</p>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{a.out}</p>
            </div>
          ))}
        </div>

        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <AgentFlow />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            Input ind · et udkast ud · et menneske læser og sender
          </p>
        </div>
      </section>

      {/* ============ I BEVARER KONTROLLEN ============ */}
      <section className="my-16 scroll-mt-10" id="control">
        <div className="bg-ink text-cream px-8 py-10 -mx-2 rounded">
          <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
            I bevarer kontrollen
          </div>
          <h2 className="font-serif font-medium text-[30px] md:text-[38px] leading-[1.15] text-cream mb-5">
            AI laver udkastet. I retter, beslutter og sender.
          </h2>
          <p className="text-[16px] text-cream/85 mb-4">
            Det er den ærlige kerne i forløbet, og for et reguleret team er det
            den del der betyder mest. Agenterne laver et udkast. Intet forlader
            huset, før et menneske har læst det, rettet det, og valgt at sende
            det. I dette forløb handler agenterne ikke af sig selv: de rækker jer
            en tekst I selv starter og tjekker.
          </p>
          <p className="text-[16px] text-cream/85 mb-4">
            Så det at tjekke output er en del af færdigheden, ikke en eftertanke.
            Én øvelse er et referat med tre bevidst indlagte fejl, og gruppen
            træner i at fange dem. Det er en lille ting, der ændrer hvordan folk
            behandler alt hvad værktøjet laver bagefter.
          </p>
          <p className="text-[16px] text-cream/85">
            Om adgang: hvad Copilot kan tilgå afhænger af jeres licens og
            opsætning, ikke af at I er i en Microsoft-tenant. Den ser kun det, den
            enkelte selv har adgang til. Det siger jeg lige ud i rummet, for et
            værktøj folk stoler på af de forkerte grunde er værre end et de
            forstår.
          </p>
        </div>
      </section>

      {/* ============ PROEV DET SELV ============ */}
      <section className="my-16 scroll-mt-10" id="try">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Prøv det selv
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          To start-instruktioner I kan bruge i dag
        </h2>
        <p className="mb-[18px]">
          I behøver ikke et forløb for at komme i gang. Her er to generiske
          udgaver af agenterne ovenfor, skrevet så I kan indsætte dem i en
          Copilot-agent og tilpasse dem til jeres eget hus. De laver kun udkast.
          I retter og sender.
        </p>

        <StarterPrompt
          name="meeting_brief"
          summary="Start-instruktion · mødebrief"
          note={
            <>
              Indsæt den i en ny Copilot-agent (Agent Builder) og giv den adgang
              til jeres kalender, mails og filer. Den læser hvad der blev spurgt
              om og lovet, og laver et mødebrief på én side før mødet. Tilpas kun
              de husdetaljer I vil have den til at respektere.
            </>
          }
          prompt={MEETING_BRIEF}
        />

        <StarterPrompt
          name="minutes_follow_up"
          summary="Start-instruktion · referat og opfølgning"
          note={
            <>
              Indsæt den i en Copilot-agent, eller brug den som en gemt prompt i
              chatten. Giv den de rå noter eller et Teams-transskript, og den
              laver udkast til referatet, en opfølgningsmail, og forslag til
              kalenderaftaler. Den opretter og sender intet selv.
            </>
          }
          prompt={MINUTES}
        />
      </section>

      {/* ============ HVAD I GAAR HJEM MED ============ */}
      <section className="my-16 scroll-mt-10" id="takeaways">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Hvad I går hjem med
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          En metode, ikke bare et par prompts
        </h2>
        <ul className="list-none space-y-3.5 my-6">
          {[
            "Metoden: hvordan man spotter en opgave der er værd at automatisere, sætter en lille agent op, starter den selv, og tjekker hvad den laver, så I kan gentage det på jeres eget arbejde.",
            "De fire agenter ovenfor som udgangspunkter, klar til at tilpasse jeres hus.",
            "Et kort kompendium: dagens prompts og tips, plus en opskrift på selv at sætte agenter og rutiner op.",
          ].map((t) => (
            <li key={t} className="relative pl-7 text-[16px] leading-relaxed">
              <span className="absolute left-0 top-[9px] w-2.5 h-2.5 bg-amber rounded-[2px]" />
              {t}
            </li>
          ))}
        </ul>
        {/* COMPENDIUM_TODO(beslutning 5): vil du email-gate kompendiet som download,
            saa laeg en lead-formular her i stedet for at beskrive det ovenfor. */}
      </section>

      {/* ============ MINDRE TEAM ============ */}
      <section className="my-16 scroll-mt-10" id="smaller-team">
        <div className="border-l-[3px] border-ink px-5 py-4 my-7 bg-cream-deep">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            For et mindre team
          </div>
          <p className="text-[16px] mb-3">
            I behøver ikke et helt forløb for at bruge samme tilgang. Er I en
            håndfuld eller arbejder alene, så vælg den ene opgave I gentager
            oftest og byg en enkelt agent til den efter opskriften: løs den én
            gang i chatten, ret den til den er rigtig, skriv jobbet ned som en
            instruktion, og gem den så den kører igen.
          </p>
          <p className="text-[16px]">
            De to start-instruktioner ovenfor er et fint sted at begynde. Start
            med én opgave, én agent, én ejer.
          </p>
        </div>
      </section>

      {/* ============ CTA / PRODUKT ============ */}
      <section id="book" className="scroll-mt-10">
        <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
          <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
            Kør det for jeres team
          </div>
          <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
            Hvis jeres team har Copilot, men ikke har fundet hvor det passer ind
          </h3>
          <p className="text-[16px] text-cream/85 mb-4">
            Jeg kører det som et praktisk forløb bygget op om jeres egne opgaver.
            Det passer til et team der er i en Microsoft-tenant, har Copilot eller
            er tæt på, og gerne vil have folk til faktisk at bruge det i
            hverdagen. I får forinterviewet, de tre timer i to spor, de fire
            agenter som udgangspunkter, og kompendiet bagefter.
          </p>

          {/* PRICE_TODO(beslutning 1): default er "Efter aftale". Skift blokken
              nedenfor til et offentligt anker ("Fra DKK X") hvis du beslutter det. */}
          <div className="inline-flex items-center gap-3 border border-cream/25 rounded-sm px-4 py-2.5 mb-6">
            <span className="font-mono text-[10px] tracking-widest uppercase text-amber">
              Pris
            </span>
            <span className="font-sans text-[15px] text-cream">
              Efter aftale
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            <a
              href="mailto:michael@spaike.dk?subject=Hands-on%20Copilot-tr%C3%A6ning"
              data-track-event="copilot_training_book_click"
              data-track-location="field-notes-copilot-training"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Book et forløb →
            </a>
            <a
              href="https://spaike.dk"
              data-track-event="copilot_training_more_click"
              className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Mere fra SpAIke
            </a>
          </div>
        </div>
      </section>

      {/* ============ ARTIKEL-FOOTER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        En field note fra SpAIke om hvordan jeg kører et praktisk Copilot-forløb.
        Skrevet ud fra et nyligt tre-timers forløb med et kundeteam. Eksempler er
        generaliseret, og intet klient-materiale vises.
        <br />
        <br />
        Spørgsmål:{" "}
        <a
          href="mailto:michael@spaike.dk?subject=Hands-on%20Copilot-tr%C3%A6ning"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          michael@spaike.dk
        </a>
        {" · "}
        <a
          href="https://spaike.dk"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          spaike.dk
        </a>{" "}
        · Commercial impact, drevet af AI.
      </footer>
    </article>
  );
}

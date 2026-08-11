import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "AI-agenter til landinspektører · SpAIke",
  description:
    "De sager der stjæler tiden hos en landinspektør, servitutredegørelser, arkivundersøgelser, tilladelser, tilbud, er dem en AI-agent kan tage det tunge i. Konkrete agenter til den matrikulære hverdag.",
  openGraph: {
    title: "AI-agenter til landinspektører",
    description:
      "Konkrete AI-agenter til servitutredegørelser, matrikulære sager, skelforretninger, LER og tilbud. Agenten forbereder, landinspektøren står inde for det.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/brancher/landinspektorer",
  },
};

const tasks = [
  {
    n: "01",
    title: "Matrikulære sager",
    body: "Udstykning, arealoverførsel, sammenlægning, ejendomsberigtigelse. Hele sagsgangen fra bestilling til registrering i Matriklen via MIA.",
    pain: "Tungt: arkivundersøgelse, koordinering af tilladelser og erklæringer, gentagen dokumentproduktion.",
  },
  {
    n: "02",
    title: "Tinglysning og servitutter",
    body: "Servitutredegørelser, deklarationer, stedfæstelse af servitutter med GML og tinglysningsrids efter 2009.",
    pain: "Tungt: at læse mange scannede, gamle, ofte håndskrevne servitutdokumenter og koge dem ned til et overblik.",
  },
  {
    n: "03",
    title: "Skelforretninger",
    body: "Officiel, retligt bindende fastlæggelse af omtvistede skel. Indkaldelse af naboer, gennemgang af kort og gamle opmålinger, skriftlig erklæring.",
    pain: "Tungt: mødeforberedelse, sammenstilling af historisk materiale, formalia med 8-ugers-fristen.",
  },
  {
    n: "04",
    title: "Opmåling, drone og 3D",
    body: "GNSS, totalstation, dronefotogrammetri, laserscanning. Terrænmodeller, volumen, as-built, monitorering over tid.",
    pain: "Tungt: efterbehandling af rådata og punktskyer til tegninger, modeller og kundevendte rapporter.",
  },
  {
    n: "05",
    title: "Ejerlejligheder og ejendomsdannelse",
    body: "Opdeling i ejerlejligheder, fordelingstal, bygning på fremmed grund, ideelle anparter.",
    pain: "Tungt: arealberegninger, fordelingstal og mange formkrav pr. opdeling.",
  },
  {
    n: "06",
    title: "LER og gravegrundlag",
    body: "Ledningsregistrering og graveforespørgsler i LER 2.0. Samle ledningsejersvar til ét gravegrundlag.",
    pain: "Tungt: at tolke og sammenstille svar fra mange ejere i vidt forskellige formater.",
  },
  {
    n: "07",
    title: "Rådgivning og myndighed",
    body: "Byggemodning, lokalplaner, ekspropriation, lodsejerforhandling, situationsplaner til projektering.",
    pain: "Tungt: parts- og lodsejeradministration, mange breve og koordination med myndigheder.",
  },
  {
    n: "08",
    title: "Det tværgående",
    body: "Tilbud, sagsoprettelse, kvalitetssikring før indsendelse, statusmails, mødereferater, fakturering.",
    pain: "Tungt: tilbud fra bunden hver gang, KS-tjeklister og gentagen kundekommunikation.",
  },
];

const agents = [
  {
    n: "01",
    kicker: "Agent 01 · Kernen",
    hero: true,
    name: "Servitut-analytikeren",
    rammer: "servitutredegørelse og servitutundersøgelse",
    what: "Den læser tingbogsattesten og alle de tilknyttede servitutdokumenter, også de gamle, scannede og håndskrevne. Den finder de enkelte byrder og rettigheder, hvem de gælder for, og hvad de betyder for det konkrete projekt, og leverer et struktureret udkast til servitutredegørelse med risikoflag og henvisning til det sted i akten, hvor byrden står. Landinspektøren gennemgår og godkender.",
    value:
      "Timers dokumentlæsning pr. ejendom bliver til minutter, og risikoen for at overse en relevant byrde falder markant. På et større projekt med mange matrikler er det forskellen på dage og uger.",
  },
  {
    n: "02",
    kicker: "Agent 02",
    name: "Arkiv-graveren",
    rammer: "arkivundersøgelse i Matriklen og Tingbogen",
    what: "Den samler historiske matrikelkort, tidligere sager og målebladsdata for en ejendom til ét sagsresumé med de relevante holdepunkter for skel og rettigheder, så I ikke starter hver gamle sag med at grave manuelt.",
    value:
      "Skærer research-tiden på gamle og landbrugsejendomme, hvor timerne i dag løber løbsk, fordi dokumentationen er ufuldstændig.",
  },
  {
    n: "03",
    kicker: "Agent 03",
    name: "Sagsstyreren",
    rammer: "hele den matrikulære sagsgang",
    what: "Den opretter sagen ud fra bestillingen, genererer en tjekliste over hvad netop denne sagstype kræver (arkivundersøgelse, tilladelser, erklæringer, underskrifter) målt mod Geodatastyrelsens krav, og holder styr på frister og manglende dokumenter frem til indsendelse i MIA.",
    value:
      "Intet falder mellem stolene, og koordineringsadministrationen på tværs af parter bliver til et levende overblik i stedet for huskesedler.",
  },
  {
    n: "04",
    kicker: "Agent 04",
    name: "Tilladelses-jægeren",
    rammer: "indhentning af tilladelser og erklæringer",
    what: "Den finder ud af, hvilke myndighedstilladelser en konkret sagstype kræver (kommune efter udstykningsloven, landbrug, vej, panthaver), udkaster ansøgnings- og følgebreve i jeres sprog og holder styr på, hvad der er sendt, og hvad der mangler svar på.",
    value:
      "Fjerner gentagen brevskrivning og manuel opfølgning, som i dag trækker sager i langdrag.",
  },
  {
    n: "05",
    kicker: "Agent 05",
    name: "Plan- og zone-tjekkeren",
    rammer: "indledende gennemførlighed før udstykning og arealoverførsel",
    what: "Den slår lokalplan, kommuneplan, zonestatus, landbrugspligt og tinglyste byrder op for en ejendom og opsummerer, om den ønskede ændring overhovedet kan lade sig gøre, før der bruges timer på sagen.",
    value:
      "Et hurtigt, kvalificeret ja eller nej til kunden fra dag ét, i stedet for at opdage en showstopper halvvejs inde.",
  },
  {
    n: "06",
    kicker: "Agent 06",
    name: "Skelforretnings-assistenten",
    rammer: "skelforretninger",
    what: "Den forbereder sagen: indkaldelsesbreve til de berørte naboer, sammenstilling af matrikelkort, luftfotos og tidligere opmålinger til ét beslutningsgrundlag, og et udkast til landinspektørens skriftlige erklæring inklusive formalia om 8-ugers-fristen.",
    value:
      "Mindre manuel mødeforberedelse og dokumentproduktion i en sagstype, der ellers er tung og tidskrævende.",
  },
  {
    n: "07",
    kicker: "Agent 07",
    name: "LER-tolken",
    rammer: "graveforespørgsler og ledningssvar i LER 2.0",
    what: "Den samler og normaliserer ledningsejersvarene, der kommer i mange forskellige formater, til ét samlet gravegrundlag med risikoflag og en liste over hvem der mangler at svare.",
    value:
      "Fjerner den manuelle sammenstilling og giver en tydeligere, hurtigere gravevejledning.",
  },
  {
    n: "08",
    kicker: "Agent 08",
    name: "Ejerlejligheds-regnemaskinen",
    rammer: "ejerlejlighedsopdeling og fordelingstal",
    what: "Den beregner fordelingstal og arealer ud fra opmåling og tegninger, tjekker formkravene (mindst to lejligheder, bygning på fremmed grund) og udkaster ejerlejlighedsfortegnelsen.",
    value:
      "Færre regnefejl og hurtigere opdeling, i en opgave hvor formkravene er talrige.",
  },
  {
    n: "09",
    kicker: "Agent 09",
    name: "Punktsky-rapportøren",
    rammer: "drone, laserscanning og 3D-leverancer",
    what: "Den laver volumen- og mængdeberegninger, resuméer af terrænmodeller og kundevendte målerapporter ud fra de behandlede data, og sammenligner monitoreringsmålinger over tid.",
    value:
      "Skærer efterbehandlings- og rapporttiden på de opmålingsopgaver, der ellers hober sig op efter feltarbejdet.",
  },
  {
    n: "10",
    kicker: "Agent 10",
    name: "Kvalitetssikreren",
    rammer: "KS af sager før indsendelse i MIA",
    what: "Den kører sagen mod Geodatastyrelsens tjekliste og flagger manglende erklæringer, uunderskrevne dokumenter og inkonsistente arealer, før sagen sendes.",
    value:
      "Færre afviste sager og genindsendelser, og en mere ensartet kvalitet på tværs af medarbejdere.",
  },
  {
    n: "11",
    kicker: "Agent 11",
    name: "Tilbuds-agenten",
    rammer: "tilbud og prissætning",
    what: "Ud fra kundens forespørgsel, sagstypen og ejendommens kompleksitet (alder, landzone, uklare skel) foreslår den scope, estimat og et færdigt tilbudsudkast i firmaets sprog, og markerer de kompleksitets-røde flag tidligt.",
    value:
      "Hurtigere og mere ensartede tilbud på opgaver, der sjældent er ens, og en tidlig fornemmelse af, hvor de dyre overraskelser gemmer sig.",
  },
  {
    n: "12",
    kicker: "Agent 12",
    name: "Møde- og markreferenten",
    rammer: "nabo-, lodsejer- og kundemøder samt markbesøg",
    what: "Landinspektøren dikterer efter et møde eller besøg, og agenten laver et struktureret referat med aftaler, ansvar og næste skridt, koblet til den rigtige sag.",
    value:
      "Intet tabes fra marken, og referater skrives ikke længere i hånden om aftenen.",
  },
  {
    n: "13",
    kicker: "Agent 13",
    name: "Kunde-kommunikatøren",
    rammer: "status og kundekommunikation gennem lange sager",
    what: "Den udkaster proaktive statusmails i firmaets tone (“din sag afventer nu kommunens tilladelse, forventet svar i uge X”), så kunden holdes opdateret uden at I skal huske det.",
    value:
      "Færre “hvor er min sag?”-henvendelser og en mærkbart bedre kundeoplevelse gennem sager, der kan trække ud i måneder.",
  },
];

const steps = [
  {
    n: "01 · Data",
    title: "Bliver i jeres systemer",
    body: "Agenterne arbejder oven på jeres egne dokumenter, journal og kortdata. Følsomme data forlader ikke jeres kontrol, og løsningen kan hostes på dansk grund efter behov.",
  },
  {
    n: "02 · Kontrol",
    title: "Landinspektøren står inde for det",
    body: "Agenten forbereder, sammenstiller og markerer usikkerhed. Den træffer ikke de faglige eller juridiske afgørelser. I gennemgår og godkender, før noget bruges i en sag.",
  },
  {
    n: "03 · Start",
    title: "Én agent, ét reelt problem",
    body: "Vi starter med den opgave, der gør mest ondt i jeres hverdag, bygger den færdig og får den i drift, før vi udvider. Ingen stor platform, I skal tro på i blinde.",
  },
];

export default function Landinspektorer() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        {/* HERO */}
        <header className="border-b-2 border-ink">
          <div className="max-w-5xl mx-auto px-6 md:px-10 pt-12 pb-12 md:pb-14">
            <div className="flex justify-between items-center flex-wrap gap-2 pb-3.5 mb-8 border-b border-rule font-mono text-[10.5px] tracking-wider uppercase text-muted">
              <span className="text-ink">SpAIke / Industri</span>
              <span>Landinspektører · Danmark</span>
            </div>
            <span className="block font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-5">
              AI-agenter til landinspektørvirksomheder
            </span>
            <h1 className="font-serif font-semibold text-[34px] md:text-[46px] leading-[1.08] tracking-tight max-w-[880px] mb-6">
              De sager, der stjæler jeres tid, er dem{" "}
              <em className="italic font-medium text-amber-dark">
                en agent kan tage det tunge i
              </em>
            </h1>
            <p className="font-serif text-[18px] md:text-[19px] leading-[1.5] text-ink-soft max-w-[760px]">
              Servitutredegørelser, arkivundersøgelser, tilladelser, tilbud,
              sagsdokumentation. Meget af en landinspektørs uge går med at læse
              gamle dokumenter, samle papirer og skrive det samme igen. Det er
              præcis den slags arbejde, en veldefineret AI-agent kan aflaste, uden
              at give slip på den faglige kontrol.
            </p>
            <p className="font-serif text-[18px] md:text-[19px] leading-[1.5] text-ink-soft max-w-[760px] mt-3.5">
              Herunder har jeg oversat det til jeres fag: de faktiske opgaver i en
              matrikulær hverdag, og de konkrete agenter, der rammer dem. Agenten
              forbereder, sammenstiller og markerer usikkerhed. Landinspektøren
              vurderer og står inde for resultatet.
            </p>
          </div>
        </header>

        {/* HVERDAG */}
        <section className="border-b border-rule">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-14">
            <div className="font-mono text-[10.5px] tracking-widest uppercase text-amber-dark mb-3.5">
              Sådan ser hverdagen ud
            </div>
            <h2 className="font-serif font-semibold text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-4 max-w-[820px]">
              Jeg har kortlagt opgaverne,{" "}
              <em className="italic font-medium text-amber-dark">
                før jeg foreslår løsninger
              </em>
            </h2>
            <p className="text-[16.5px] text-ink-soft max-w-[800px] mb-8">
              En privatpraktiserende landinspektør lever i et krydsfelt af
              matrikulær eneret, tinglysning, opmåling og rådgivning. Det er de her
              opgaver, der fylder, og hvor det manuelle arbejde gemmer sig.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {tasks.map((t) => (
                <div key={t.n}>
                  <h3 className="font-serif font-semibold text-[18px] mb-1.5">
                    <span className="font-mono text-[12px] text-amber-dark mr-2">
                      {t.n}
                    </span>
                    {t.title}
                  </h3>
                  <p className="text-[14px] text-ink-soft">{t.body}</p>
                  <p className="text-[13px] text-muted italic mt-1.5">{t.pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AGENTER */}
        <section className="border-b border-rule">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-14">
            <div className="font-mono text-[10.5px] tracking-widest uppercase text-amber-dark mb-3.5">
              Agenterne
            </div>
            <h2 className="font-serif font-semibold text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-4 max-w-[820px]">
              Konkrete agenter til{" "}
              <em className="italic font-medium text-amber-dark">
                en landinspektørs hverdag
              </em>
            </h2>
            <p className="text-[16.5px] text-ink-soft max-w-[800px] mb-8">
              Hver agent er en afgrænset medhjælper til én opgavetype. Den arbejder
              oven på jeres egne data og systemer, og alt kritisk går forbi jer,
              før det bruges. Jeg starter med den, der rammer kernen af det
              matrikulære sagsarbejde.
            </p>

            <div className="space-y-[18px]">
              {agents.map((a) => (
                <div
                  key={a.n}
                  className={
                    a.hero
                      ? "bg-white border border-rule border-l-[3px] border-l-ink rounded-sm px-6 py-6 md:px-8"
                      : "bg-[#fbf9f3] border border-rule border-l-[3px] border-l-amber rounded-sm px-6 py-6 md:px-8"
                  }
                >
                  <div className="flex justify-between items-baseline gap-4 flex-wrap mb-1">
                    <span className="font-mono text-[10.5px] tracking-wider uppercase text-muted">
                      {a.kicker}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-[22px] md:text-[23px] tracking-tight mt-0.5 mb-2.5">
                    {a.name}
                  </h3>
                  <p className="text-[13.5px] text-muted mb-3">
                    Rammer: <b className="text-ink font-semibold">{a.rammer}</b>
                  </p>
                  <p className="text-[15px] mb-3">{a.what}</p>
                  <div className="text-[14.5px] bg-cream-deep rounded-sm px-4 py-3 border-l-2 border-amber">
                    <b className="text-amber-dark">Værdien:</b> {a.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-b border-rule">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-14">
            <div className="font-mono text-[10.5px] tracking-widest uppercase text-amber-dark mb-3.5">
              Sådan gør jeg det trygt
            </div>
            <h2 className="font-serif font-semibold text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-8 max-w-[820px]">
              Jeres data bliver hos jer.{" "}
              <em className="italic font-medium text-amber-dark">
                Ansvaret bliver hos jer.
              </em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {steps.map((s) => (
                <div key={s.n}>
                  <div className="font-mono text-[10.5px] tracking-widest uppercase text-amber-dark mb-2">
                    {s.n}
                  </div>
                  <h4 className="font-serif font-semibold text-[18px] mb-1.5">
                    {s.title}
                  </h4>
                  <p className="text-[14px] text-ink-soft">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="bg-ink text-cream rounded px-8 py-10 md:px-11 my-12">
            <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
              Næste skridt
            </div>
            <h2 className="font-serif font-medium text-[26px] md:text-[30px] leading-[1.2] text-cream mb-4 max-w-[720px]">
              Lad os tage en af jeres sager og se, hvad en agent faktisk kan
            </h2>
            <p className="text-[16px] text-cream/85 max-w-[720px] mb-6">
              Jeg er Michael fra SpAIke. Jeg bygger AI-agenter til danske
              videnstunge virksomheder, og jeg har bygget en servitut-analyse-agent,
              der læser tinglyste dokumenter og trækker byrderne ud automatisk. Send
              mig en typisk sag, så viser jeg konkret, hvor meget af det tunge en
              agent kan tage.
            </p>
            <div className="flex gap-4 flex-wrap items-center">
              <a
                href="https://calendly.com/michael-spaike/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="book_moede_click"
                data-umami-event-location="brancher-landinspektorer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
              >
                Book et kort møde →
              </a>
              <a
                href="mailto:michael@spaike.dk?subject=AI-agenter%20til%20landinspekt%C3%B8rarbejde"
                className="text-amber border-b border-amber/40 hover:border-amber no-underline text-[14px]"
              >
                michael@spaike.dk
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "AI-agenter til rådgivende ingeniører · SpAIke",
  description:
    "Statisk dokumentation, K09, kontrolplaner, granskning, normtjek, tilbud. Den slags arbejde kan en veldefineret AI-agent aflaste, uden at røre ved det ingeniørfaglige ansvar. Konkrete agenter til konstruktionsrådgiverens hverdag.",
  openGraph: {
    title: "AI-agenter til rådgivende ingeniører i byggeriet",
    description:
      "Konkrete AI-agenter til K09-sagsoprettelse, granskning, vidensbank, normgrundlag og tilbud. Agenten forbereder, ingeniøren står inde for det.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/brancher/raadgivende-ingenioerer",
  },
};

const tasks = [
  {
    n: "01",
    title: "Statisk dokumentation (A1 til B3)",
    body: "Den fulde dokumentpakke efter SBi 271: konstruktionsgrundlag, statiske beregninger, tegninger, projektredegørelse og kontrolplaner. K09-mappen som kunden afleverer.",
    pain: "Tungt: oprette mappestruktur og 10-15 dokumenter med de samme stamdata, gang på gang.",
  },
  {
    n: "02",
    title: "Dimensionering og normgrundlag",
    body: "Laster og bæreevne efter Eurocodes (beton, stål, træ, murværk, komposit), med korrekte danske nationale annekser og BR18-kapitler.",
    pain: "Tungt: rigtige normreferencer med rette årstal, som let bliver forældede eller forkerte.",
  },
  {
    n: "03",
    title: "Konstruktionsklasse og certificering",
    body: "Indplacering i KK1 til KK4, certificeret statiker-review, starterklæring før byggetilladelse og sluterklæring ved færdigmelding.",
    pain: "Tungt: skønsvurdering med konsekvenser, og erklæringsfrister der følges manuelt.",
  },
  {
    n: "04",
    title: "Granskning og kvalitetssikring",
    body: "Egenkontrol, uafhængig kontrol og tredjepartskontrol efter DS 1140. Gennemgang af eget og andres materiale for fejl og mangler.",
    pain: "Tungt: manuelt læsearbejde, og kontrolplaner der genoprettes fra skabelon hver gang.",
  },
  {
    n: "05",
    title: "Tilbud, fagbeskrivelser og udbud",
    body: "Honoraroverslag, arbejdsbeskrivelser og tilbudslister, ofte genbrugt og tilrettet fra tidligere sager efter YBL18-faserne.",
    pain: "Tungt: copy-paste fra gamle sager med risiko for at slæbe fejl med.",
  },
  {
    n: "06",
    title: "Tilsyn og byggeledelse",
    body: "Fagtilsyn på pladsen, byggemøder, mangelregistrering, afleveringsforretning, opfølgning på åbne punkter.",
    pain: "Tungt: tilsynsnotater og mangellister skrevet i hånden fra noter eller hukommelse.",
  },
  {
    n: "07",
    title: "Møder, projektweb og versioner",
    body: "Mødereferater, filnavngivning efter A104, versionsstyring på tværs af myndigheds-, udbuds- og udførelsesprojekt i Byggeweb, Dalux eller Ajour.",
    pain: "Tungt: referater renskrives, og versionsstyring på tværs af faser er fejlbar.",
  },
  {
    n: "08",
    title: "Vidensgenbrug",
    body: "At finde tidligere sager med samme bygningstype, materiale og konstruktionsklasse, og firmaets egne metoder og erfaringer.",
    pain: "Tungt: viden ligger spredt i SharePoint-mapper og i hovederne på de erfarne.",
  },
];

const agents = [
  {
    n: "01",
    kicker: "Agent 01 · Kernen",
    hero: true,
    live: "I drift hos en dansk rådgiver",
    name: "Sagsopretteren",
    rammer: "statisk dokumentation og K09-sagsoprettelse",
    what: "Ud fra få stamdata (projektnavn, bygherre, konstruktionsklasse, materialer) opretter den hele mappestrukturen og alle de rette udfyldte Word- og Excel-dokumenter, A1, A2, A3 og B1, plus kontrolplaner fra KK2, direkte i jeres eget SharePoint og ud fra jeres egne skabeloner. Konstruktionsklassen styrer automatisk, hvilke dokumenter der oprettes, og en ændring i stamdata kan slås igennem i hele sagen på én gang.",
    value:
      "Fra timer til sekunder pr. ny sag, konsistent og fejlfrit. Hos den rådgiver, det kører for, tager 10-15 dokumenter under 30 sekunder. Den skjulte gevinst er, at alle dokumenter i sagen altid er enige om stamdata, fordi de kommer fra samme kilde.",
  },
  {
    n: "02",
    kicker: "Agent 02",
    name: "Granskeren",
    rammer: "kvalitetssikring og granskning før aflevering",
    what: "Den læser den statiske dokumentation igennem og flagger hullerne: manglende dokumenter jf. konstruktionsklassen, inkonsistente stamdata på tværs af filer, forkerte eller forældede normreferencer, tomme felter, en dokumentliste der ikke matcher de faktiske filer, og manglende erklæringer.",
    value:
      "Fanger fejlene, før den certificerede statiker eller myndigheden gør. Et adversarielt gennemsyn på minutter, af den type der ellers først dukker op i review-runden.",
  },
  {
    n: "03",
    kicker: "Agent 03",
    name: "Vidensbanken",
    rammer: "vidensgenbrug, “har vi lavet noget lignende?”",
    what: "En read-only agent oven på firmaets sagsarkiv. Medarbejderen spørger “har vi projekteret en 4-etagers betonboligblok i KK2 før, og hvad lærte vi?” og får matchende tidligere sager med deres løsninger og erfaringer. Og “hvad siger reglerne her?” med citation fra en versioneret regelbase (BR18, Eurocodes, SBi 271).",
    value:
      "Låser den erfarne ingeniørs viden op for hele huset og gør nyansatte produktive hurtigere, i stedet for at viden forsvinder ud ad døren ved en opsigelse.",
  },
  {
    n: "04",
    kicker: "Agent 04",
    live: "MVP bygget",
    name: "Mødereferenten",
    rammer: "mødereferater og tilsynsnotater",
    what: "Ingeniøren dikterer på dansk efter et byggemøde eller et tilsyn, for eksempel i bilen på vej hjem. Agenten laver et struktureret referat med beslutninger og action points, klar til projektweb.",
    value:
      "Sparer efterbehandlingstiden, og intet går tabt mellem plads og kontor. En dansk voice-MVP er allerede bygget efter dette mønster.",
  },
  {
    n: "05",
    kicker: "Agent 05",
    name: "Stamdata-opdateringen",
    rammer: "dokumentkonsistens og versionsstyring",
    what: "Den ændrer stamdata (bygherrenavn, sagsnummer, revisionsdato, ansvarlige) på tværs af alle dokumenter i en sag på én gang, med en preview før den skriver.",
    value:
      "Eliminerer den klassiske fejl, hvor bygherrenavnet står forskelligt i tolv dokumenter. Minutter i stedet for manuel gennemgang.",
  },
  {
    n: "06",
    kicker: "Agent 06",
    name: "Normgrundlag-agenten",
    rammer: "A1 konstruktionsgrundlag og dimensionering",
    what: "Den forudfylder normgrundlaget i byggesagsbeskrivelsen med de korrekte Eurocode-referencer og danske nationale annekser (fx DS/EN 1990 DK NA i gældende årgang) ud fra konstruktionsklasse og materialer, plus de relevante BR18-kapitler.",
    value:
      "Rigtige normreferencer hver gang, ingen forældede annekser, og en hyppig granskningsbemærkning fjernet, før den opstår.",
  },
  {
    n: "07",
    kicker: "Agent 07",
    name: "Dokumentliste-agenten",
    rammer: "dokumentliste (B1) og A104-navngivning",
    what: "Den genererer og vedligeholder dokumentlisten (SBi 271-koder, filnavne, ansvarlige, revisionsstatus) ud fra de faktiske filer i sagen, med korrekt A104-navngivning.",
    value:
      "Dokumentlisten er projektets autoritative register, og den bliver altid manuelt forældet. Agenten holder den levende og i sync.",
  },
  {
    n: "08",
    kicker: "Agent 08",
    name: "Kontrol-forbereder",
    rammer: "certificeret statiker-review og tredjepartskontrol (KK2 til KK4)",
    what: "Den samler og strukturerer den fulde dokumentationspakke, som den certificerede statiker eller tredjepartskontrollanten skal gennemgå, tjekker at DS 1140-kontrolomfanget er dækket for den givne konstruktionsklasse, og udkaster kontrolplan og start- og slutredegørelse.",
    value:
      "Gør review-runden hurtigere og billigere, med færre gange frem og tilbage med den eksterne kontrollant.",
  },
  {
    n: "09",
    kicker: "Agent 09",
    name: "Tilbuds-agenten",
    rammer: "tilbud, fagbeskrivelser og udbud",
    what: "Den udkaster honoraroverslag og fagbeskrivelser ved at genbruge og tilpasse fra tidligere lignende sager, med korrekt fase-scope efter YBL18.",
    value:
      "Hurtigere og mere konsistente tilbud, uden at slæbe copy-paste-fejl med fra en gammel sag.",
  },
  {
    n: "10",
    kicker: "Agent 10",
    name: "Normvagten",
    rammer: "vedligehold af regelgrundlaget",
    what: "Den overvåger nye versioner af BR18, de danske nationale annekser og SBi 271, og flagger hvilke af firmaets skabeloner og regelnoter der er blevet forældede.",
    value:
      "Firmaet er aldrig ved et uheld på en forældet norm. Det fjerner en usynlig ansvarsrisiko, ingen har tid til at tjekke manuelt.",
  },
  {
    n: "11",
    kicker: "Agent 11",
    name: "KK-assistenten",
    rammer: "indplacering i konstruktionsklasse",
    what: "Den guider gennem indplacering i KK1 til KK4 ud fra konsekvensklasse, kompleksitet og erfaringsgrundlag, med BR18-eksempler, og foreslår det resulterende dokument- og kontrolomfang.",
    value:
      "Hurtigere og mere ensartet indplacering, med mindre risiko for at over- eller underdokumentere sagen.",
  },
  {
    n: "12",
    kicker: "Agent 12",
    name: "Erklærings-vagten",
    rammer: "certificering, frister og myndighedsprojekt",
    what: "Den holder styr på, hvornår starterklæringen skal udstedes (før byggetilladelse), hvornår sluterklæringen skal med (færdigmelding), samt kontrol- og revisionsfrister pr. sag, og minder proaktivt.",
    value:
      "Ingen sag falder mellem to stole på en formalitet, der ellers kan stoppe byggetilladelsen.",
  },
  {
    n: "13",
    kicker: "Agent 13",
    name: "Mangel- og tilsyns-agenten",
    rammer: "fagtilsyn, mangelgennemgang og byggeledelse",
    what: "Den omdanner tilsynsnoter og fotos til strukturerede mangellister med ansvar og frist, klar til Dalux eller Ajour, og følger op på de åbne punkter.",
    value:
      "Strammere tilsynsopfølgning, og intet tabes mellem to besøg på pladsen.",
  },
];

const steps = [
  {
    n: "01 · Data",
    title: "Bliver i jeres eget miljø",
    body: "Agenterne bygges i jeres eget Microsoft-miljø og arbejder oven på jeres egne skabeloner og SharePoint. Følsomme projekt- og persondata forlader ikke jeres kontrol, og løsningen kan hostes på europæisk grund med GDPR for øje.",
  },
  {
    n: "02 · Kontrol",
    title: "Ingeniøren står inde for det",
    body: "Agenten forbereder, sammenstiller og markerer usikkerhed. Den træffer ikke de ingeniørfaglige afgørelser. Ingeniøren og den certificerede statiker gennemgår og godkender, før noget bruges i en sag.",
  },
  {
    n: "03 · Start",
    title: "Én agent, ét reelt problem",
    body: "Vi starter med den opgave, der gør mest ondt, bygger den færdig og får den i drift i jeres eget miljø, før vi udvider. Sagsopretteren er præcis sådan en start, der allerede har bevist sig.",
  },
];

export default function RaadgivendeIngenioerer() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        {/* HERO */}
        <header className="border-b-2 border-ink">
          <div className="max-w-5xl mx-auto px-6 md:px-10 pt-12 pb-12 md:pb-14">
            <div className="flex justify-between items-center flex-wrap gap-2 pb-3.5 mb-8 border-b border-rule font-mono text-[10.5px] tracking-wider uppercase text-muted">
              <span className="text-ink">SpAIke / Industri</span>
              <span>Rådgivende ingeniører · Byggeri · Danmark</span>
            </div>
            <span className="block font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-5">
              AI-agenter til rådgivende ingeniører i byggeriet
            </span>
            <h1 className="font-serif font-semibold text-[34px] md:text-[46px] leading-[1.08] tracking-tight max-w-[880px] mb-6">
              Den statiske dokumentation skal laves.{" "}
              <em className="italic font-medium text-amber-dark">
                Den behøver ikke tage timer i hånden
              </em>
            </h1>
            <p className="font-serif text-[18px] md:text-[19px] leading-[1.5] text-ink-soft max-w-[760px]">
              Sagsoprettelse, A1 og A2, kontrolplaner, granskning, normtjek,
              tilbud, mødereferater. En stor del af en konstruktionsrådgivers uge
              går med at oprette dokumenter, taste de samme stamdata igen og igen
              og lede efter, hvad reglerne siger. Det er præcis det, en veldefineret
              AI-agent kan aflaste, uden at røre ved det ingeniørfaglige ansvar.
            </p>
            <p className="font-serif text-[18px] md:text-[19px] leading-[1.5] text-ink-soft max-w-[760px] mt-3.5">
              Herunder har jeg oversat det til jeres fag: de faktiske opgaver bag en
              K09-sag og et myndighedsprojekt, og de konkrete agenter, der rammer
              dem. Agenten forbereder og sammenstiller. Ingeniøren og den
              certificerede statiker vurderer og står inde for resultatet.
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
              En konstruktionsrådgiver navigerer BR18, konstruktionsklasser,
              Eurocodes og SBi-anvisning 271 hver dag. Det er de her opgaver, der
              fylder, og hvor det manuelle, gentagne arbejde gemmer sig.
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
                en konstruktionsrådgivers hverdag
              </em>
            </h2>
            <p className="text-[16.5px] text-ink-soft max-w-[800px] mb-8">
              Hver agent er en afgrænset medhjælper til én opgavetype. Den arbejder
              oven på jeres egne skabeloner og jeres eget SharePoint, og alt kritisk
              går forbi ingeniøren, før det bruges. Jeg starter med den, der allerede
              kører i produktion hos en dansk rådgiver.
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
                    {a.live ? (
                      <span className="font-mono text-[9.5px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#3f7d5c] text-[#3f7d5c] whitespace-nowrap">
                        {a.live}
                      </span>
                    ) : null}
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
              Lad os tage én af jeres sagstyper og bygge agenten, der aflaster den
            </h2>
            <p className="text-[16px] text-cream/85 max-w-[720px] mb-6">
              Jeg er Michael fra SpAIke. Jeg bygger AI-agenter til danske
              videnstunge virksomheder, og jeg har allerede en sagsoprettelses-løsning
              til statisk dokumentation i drift hos en rådgivende ingeniør. Send mig
              en typisk K09-sag, så viser jeg konkret, hvor meget af det tunge en
              agent kan tage.
            </p>
            <div className="flex gap-4 flex-wrap items-center">
              <a
                href="https://calendly.com/michael-spaike/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="book_moede_click"
                data-umami-event-location="brancher-raadgivende-ingenioerer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
              >
                Book et kort møde →
              </a>
              <a
                href="mailto:michael@spaike.dk?subject=AI-agenter%20til%20konstruktionsr%C3%A5dgivning"
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

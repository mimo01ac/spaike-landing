import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";
import { MODENHED_NIVEAUER } from "@/lib/snapshot/beregn";

/*
 * Katalog over SpAIke-metoden (SPA-1289, 2026-11-23).
 * Kilde: vault "01 SpAIke/spaike-offering-overblik-2026-11-23.html" (afsnit 1, 1b, 4)
 * og "Pakning og value proposition - SpAIke-metoden (sep 2026).md" (§3.3-3.6).
 *
 * Tekstregler: kun priserne nedenfor, kun beviserne JUC / Audiovox / WePlan,
 * moduler uden kundebevis står som "pilot". Vækst-sporet har ingen pris (ikke besluttet).
 * Ingen PrivateGPT, ingen "10x", ingen andre tal.
 */

const BOOKING_URL = "https://calendly.com/michael-spaike/new-meeting";

export const metadata: Metadata = {
  title: "Ydelser: SpAIke-metoden | SpAIke",
  description:
    "Fire trin: Se, Forstå, Fjern og Hold. Én tidsrøver væk ad gangen, til fast pris, i jeres egne systemer. Se priserne og de seks moduler.",
  alternates: { canonical: "/ydelser" },
  openGraph: {
    title: "Ydelser: SpAIke-metoden | SpAIke",
    description:
      "Fire trin med fast pris: Se, Forstå, Fjern og Hold. Seks moduler, der hver fjerner en tidsrøver.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/ydelser",
    images: [{ url: "/og/spaike-default.png", width: 1200, height: 630, alt: "SpAIke ydelser" }],
  },
};

const trin = [
  {
    n: "01",
    navn: "Se",
    spoergsmaal: "Hvor går vores tid, og hvad koster det?",
    goer: "I får et hurtigt billede af jeres største tidsrøver i timer og kroner og af, hvor I står på skalaen nedenfor. Det gør I selv, uden forpligtelse.",
    pris: "Gratis",
  },
  {
    n: "02",
    navn: "Forstå",
    spoergsmaal: "Hvad skal vi gøre først, og hvad giver det?",
    goer: "Jeg ser på arbejdsgangene sammen med dem, der laver arbejdet. I får hvert problem opgjort i kroner ud fra jeres egne tal, de tre første skridt og ét fast tilbud på det første. Prisen trækkes fra, hvis I går videre.",
    pris: "Fra 22.500 kr.",
    prisNote: "Fuld diagnose 34.500 kr.",
  },
  {
    n: "03",
    navn: "Fjern",
    spoergsmaal: "Kan du ikke bare fjerne det?",
    goer: "Ét modul ad gangen, med fast pris og leveringstid. Det bygges i jeres egne systemer. En medarbejder godkender, før noget går ud, og I overtager det bagefter.",
    pris: "Lille modul 20.000-35.000 kr.",
    prisNote: "Stort modul 50.000-115.000 kr.",
  },
  {
    n: "04",
    navn: "Hold",
    spoergsmaal: "Hvem holder det kørende og gør det bedre?",
    goer: "Overvågning, rettelser og opdateringer, en månedlig driftsrapport og et kvartalsmøde, hvor vi finder det næste, der er værd at tage fat på.",
    pris: "Fra 36.000 kr. om året",
    prisNote: "pr. modul",
  },
];

type Bevis = { kunde: string; tekst: string };

const moduler: {
  id: string;
  tidsroever: string;
  modul: string;
  goer: string;
  beviser: Bevis[];
}[] = [
  {
    id: "henvendelser",
    tidsroever: "Indbakken æder dagen.",
    modul: "Henvendelses-modul",
    goer: "Sorterer mails, skriver svarkladder og fører reklamationer igennem. En medarbejder godkender svaret.",
    beviser: [
      { kunde: "JUC", tekst: "Kundeservice i 7 landeindbakker." },
      { kunde: "Audiovox", tekst: "Reklamation fra 8 trin til 2." },
    ],
  },
  {
    id: "sager",
    tidsroever: "Vi taster det samme ind flere steder.",
    modul: "Sags- og dokument-modul",
    goer: "Gør en formular eller en mail til færdige sager og dokumenter i jeres egne systemer.",
    beviser: [{ kunde: "WePlan", tekst: "Sagsoprettelse fra timer til sekunder." }],
  },
  {
    id: "opfoelgning",
    tidsroever: "Opfølgningen glipper, og CRM'et er ikke opdateret.",
    modul: "Opfølgnings-modul",
    goer: "Forberedelse før mødet, opfølgning bagefter, en ringeliste og et CRM, der holder sig selv opdateret.",
    beviser: [],
  },
  {
    id: "overblik",
    tidsroever: "Jeg mangler overblik over tallene.",
    modul: "Overbliks-modul",
    goer: "Henter tallene fra jeres systemer og samler dem i en ugentlig status til ledelsen.",
    beviser: [],
  },
  {
    id: "viden",
    tidsroever: "Det hele sidder i hovedet på nogle få medarbejdere.",
    modul: "Videns-modul",
    goer: "Samler virksomhedens viden, så medarbejderne kan finde den i jeres egen Claude eller Copilot.",
    beviser: [],
  },
  {
    id: "kundedialog",
    tidsroever: "Kun én person kan svare kunderne.",
    modul: "Kunde-dialog-modul",
    goer: "En chatbot eller en stemmeagent, der svarer kunderne døgnet rundt ud fra jeres egen viden.",
    beviser: [{ kunde: "JUC", tekst: "Chatbot, der svarer døgnet rundt." }],
  },
];

const indbygget = [
  {
    titel: "Data hos jer",
    tekst: "Løsningen kører i jeres egne systemer. Jeres data flytter ikke ud til mig.",
  },
  {
    titel: "Mennesker godkender",
    tekst: "Systemet laver kladden, og en medarbejder godkender den. Intet, der koster penge eller går ud til kunder, sendes af sig selv.",
  },
  {
    titel: "Overdragelse med driftsdokument",
    tekst: "I får et driftsdokument, så jeres egne folk ved, hvordan det kører, og hvad de skal gøre, hvis noget går galt.",
  },
  {
    titel: "Databehandleraftale",
    tekst: "Der er en databehandleraftale, før jeg rører jeres data.",
    link: { href: "/databehandleraftale", label: "Læs databehandleraftalen" },
  },
  {
    titel: "Ingen leverandørlås",
    tekst: "Jeg bygger det, så det kan flyttes til en anden leverandør eller en anden model uden at starte forfra.",
  },
  {
    titel: "Fast pris på skrift",
    tekst: "Pris, omfang og leveringstid står i tilbuddet, før vi går i gang.",
  },
];

// Samme skala som Snapshot-resultatet (én kilde).
const modenhed = MODENHED_NIVEAUER;

export default function YdelserPage() {
  return (
    <>
      <Header />
      <main>
        {/* 1 · HERO */}
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-12">
          <SectionLabel>Ydelser · SpAIke-metoden</SectionLabel>
          <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] tracking-tight max-w-4xl mt-2">
            Få tiden tilbage, <em className="italic text-amber-dark">én tidsrøver ad gangen.</em>
          </h1>
          <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
            Jeg fjerner det, der fylder i hverdagen, fx indbakken, opfølgningen og data, der
            tastes ind to gange. Det sker til fast pris, er i drift på få uger og kører i jeres
            egne systemer. I ejer det bagefter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track-event="ydelser_book_click"
              data-track-placering="hero"
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Book et møde →
            </a>
            <a
              href="/tjek"
              data-track-event="ydelser_tjek_click"
              data-track-placering="hero"
              className="inline-flex items-center gap-2 px-5 py-3 border border-ink text-ink hover:bg-cream-deep no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Tag SpAIke Snapshot
            </a>
          </div>
        </section>

        {/* 2 · DE FIRE TRIN */}
        <section id="trin">
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>Fire trin</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              Se · Forstå · Fjern · Hold
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
              I kan stå af efter hvert trin. Hvert trin har sin egen pris, og I ved, hvad det
              koster, før I siger ja.
            </p>
          </div>
          <ol className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-rule list-none p-0 m-0">
            {trin.map((t, i) => (
              <li
                key={t.navn}
                className={`px-6 md:px-8 py-9 flex flex-col gap-3.5 ${
                  i > 0 ? "border-t md:border-t-0 border-rule" : ""
                } ${i % 2 === 1 ? "md:border-l" : ""} ${i >= 2 ? "md:border-t lg:border-t-0" : ""} ${
                  i > 0 ? "lg:border-l" : ""
                } border-rule`}
              >
                <span className="font-mono text-[11px] text-amber-dark tracking-wider">{t.n}</span>
                <h3 className="font-serif text-3xl font-medium leading-none text-ink">{t.navn}</h3>
                <p className="font-serif italic text-[16px] leading-snug text-ink">
                  &bdquo;{t.spoergsmaal}&ldquo;
                </p>
                <p className="font-sans text-[14px] leading-relaxed text-ink-soft">{t.goer}</p>
                <div className="mt-auto pt-4 border-t border-rule">
                  <p className="font-sans font-semibold text-[15px] text-ink">{t.pris}</p>
                  {t.prisNote && (
                    <p className="font-sans text-[13px] text-muted mt-0.5">{t.prisNote}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-5 pb-2 font-sans text-[12px] text-muted">
            Alle priser er ekskl. moms.
          </p>
        </section>

        {/* 3 · DE SEKS MODULER */}
        <section id="moduler">
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>Fjern · seks moduler</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              Hvilken tidsrøver vil I af med?
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
              Hvert modul fjerner én tidsrøver. Hvor et modul allerede kører hos en kunde, er kunden
              nævnt. De øvrige er i pilot.
            </p>
          </div>
          <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule">
            {moduler.map((m) => (
              <article
                key={m.id}
                id={m.id}
                className="scroll-mt-24 px-6 md:px-8 py-8 flex flex-col gap-3 border-r border-b border-rule"
              >
                <p className="font-serif italic text-[18px] leading-snug text-ink">
                  &bdquo;{m.tidsroever}&ldquo;
                </p>
                <p className="font-mono text-[11px] tracking-wider uppercase text-amber-dark">
                  → {m.modul}
                </p>
                <p className="font-sans text-[14px] leading-relaxed text-ink-soft">{m.goer}</p>
                <div className="mt-2">
                  {m.beviser.length > 0 ? (
                    <ul className="list-none p-0 m-0 space-y-1.5">
                      {m.beviser.map((b) => (
                        <li key={b.kunde + b.tekst} className="font-sans text-[13.5px] text-ink">
                          <span className="font-semibold">{b.kunde}:</span> {b.tekst}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="inline-block font-mono text-[10px] tracking-widest uppercase text-muted border border-rule px-2 py-1 rounded-sm">
                      Pilot
                    </span>
                  )}
                </div>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track-event="ydelser_modul_click"
                  data-track-modul={m.id}
                  className="mt-auto pt-3 font-mono text-[11px] tracking-wider uppercase text-ink hover:text-amber-dark no-underline transition-colors"
                >
                  Spørg til modulet →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* 4 · VÆKST-SPORET */}
        <section id="vaekst">
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-14">
            <div className="border border-amber bg-cream-deep px-6 md:px-10 py-10 rounded-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-widest uppercase bg-amber text-ink px-2 py-1 rounded-sm">
                  Nyt
                </span>
                <span className="font-mono text-[11px] tracking-widest uppercase text-muted">
                  Vækst-sporet
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-normal leading-[1.1] tracking-tight max-w-3xl">
                Flere af de rigtige kunder
              </h2>
              <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
                De seks moduler giver tid tilbage. Vækst-sporet handler om, hvem I skal ringe til.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">Markedskort</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-2">
                    Hvor mange virksomheder i markedet ligner jeres bedste kunder, hvem vokser, og
                    hvem skal I ringe til først? Svaret bygger på CVR og de offentlige regnskaber.
                    Det udpeger beslutningstageren og udelader reklamebeskyttede virksomheder.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">Pipeline-modul</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-2">
                    Det samme grundlag koblet til jeres CRM: hver måned en ny ringeliste med en
                    begrundelse for hvert navn. Jeres egne resultater gør listen bedre over tid.
                  </p>
                </div>
              </div>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="ydelser_book_click"
                data-track-placering="vaekst"
                className="inline-flex items-center gap-2 mt-8 px-5 py-3 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
              >
                Spørg mig om vækst-sporet →
              </a>
            </div>
          </div>
        </section>

        {/* 5 · INDBYGGET I ALT */}
        <section id="indbygget">
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>Indbygget i alt</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              Det får I altid med
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
              Det er ikke tilkøb. Det følger med i hvert modul.
            </p>
          </div>
          <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule">
            {indbygget.map((x) => (
              <div key={x.titel} className="px-6 md:px-8 py-7 border-r border-b border-rule">
                <h3 className="font-serif text-xl font-medium text-ink">{x.titel}</h3>
                <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-2">{x.tekst}</p>
                {x.link && (
                  <a
                    href={x.link.href}
                    className="inline-block mt-3 font-sans text-[13.5px] text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark no-underline transition-colors"
                  >
                    {x.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6 · MODENHEDSSKALA */}
        <section id="modenhed">
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-8">
            <SectionLabel>Modenhed 0-3</SectionLabel>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight max-w-3xl">
              Hvor meget af hverdagen kører af sig selv?
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-ink-soft mt-4 max-w-2xl leading-relaxed">
              SpAIke Snapshot placerer jer gratis på skalaen. Diagnosen viser, hvad der skal til for at
              nå næste trin.
            </p>
          </div>
          <ol
            className="max-w-editorial mx-auto w-full px-6 md:px-14 pb-14 grid grid-cols-1 md:grid-cols-4 gap-3 list-none m-0"
            aria-label="Modenhedsskala fra 0 til 3"
          >
            {modenhed.map((m) => (
              <li key={m.n} className="flex flex-col">
                <div className="flex gap-1 mb-3" aria-hidden="true">
                  {[1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className={`h-2 flex-1 rounded-sm ${bar <= m.n ? "bg-amber" : "bg-rule"}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-[11px] tracking-wider text-amber-dark">Niveau {m.n}</p>
                <p className="font-serif text-lg font-medium text-ink mt-1">{m.navn}</p>
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft mt-1">{m.tekst}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 7 · AFSLUTNING */}
        <section>
          <DoubleRule />
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-16">
            <div className="bg-ink text-cream px-8 md:px-12 py-12 rounded">
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
                Næste skridt
              </div>
              <h2 className="font-serif font-medium text-[28px] md:text-[36px] leading-[1.2] text-cream mb-4 max-w-2xl">
                Tag en snak om jeres største tidsrøver
              </h2>
              <p className="font-sans text-[15px] leading-relaxed text-cream/80 max-w-2xl mb-7">
                En kort samtale uden salgstale. I fortæller, hvad der fylder, og jeg siger ærligt, om
                det er noget, jeg kan fjerne. Eller start med SpAIke Snapshot.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track-event="ydelser_book_click"
                  data-track-placering="afslutning"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
                >
                  Book et møde →
                </a>
                <a
                  href="/tjek"
                  data-track-event="ydelser_tjek_click"
                  data-track-placering="afslutning"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
                >
                  Tag SpAIke Snapshot
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

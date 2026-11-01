import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";
import TilskudFlow from "./_components/TilskudFlow";
import { PULJER, formaterDato, puljeStatus } from "@/lib/tilskud/puljer";

// Puljekalenderens status (åben/kommende) afhænger af klokkeslæt: regenerér
// hver time, så etiketterne skifter selv når et vindue åbner eller lukker.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tilskudstjek · Kan staten betale halvdelen af jeres AI-automatisering?",
  description:
    "Indtast jeres CVR-nummer og få på fem minutter en ærlig indikation af, om I kan søge SMV:Digitals rådgivertilskud (50 %, op til 150.000 kr.) til AI og automatisering, plus et konkret projektoplæg og en projektbeskrivelse som grundlag for jeres ansøgning. Gratis, dansk, ingen konto.",
  openGraph: {
    title: "Tilskudstjek · AI-automatisering med 50 % tilskud",
    description:
      "Egnethed, pulje, projektoplæg og udkast til ansøgning på fem minutter. Bygget på SMV:Digitals egne regler.",
    url: "https://www.spaike.dk/tilskud",
    locale: "da_DK",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Hvad er SMV:Digitals rådgivertilskud?",
    a: "En statslig ordning, hvor små og mellemstore virksomheder får dækket 50 % af honoraret til en godkendt rådgiver om digitalisering, automatisering eller AI. I den aktuelle pulje er tilskuddet 50.000 til 150.000 kr. Tilskuddet dækker rådgivning (kortlægning, business case, kravspecifikation, leverandørvalg), ikke selve bygningen af løsningen.",
  },
  {
    q: "Er det gratis penge?",
    a: "Nej. I betaler selv den anden halvdel kontant, lægger hele regningen ud og får tilskuddet som refusion efter afrapportering. Og intet arbejde må starte, før I har fået tilsagn.",
  },
  {
    q: "Hvor sikker er vurderingen?",
    a: "Det er en indikation bygget på SMV:Digitals offentliggjorte krav og pointmodel, jeres CVR-data og jeres egne svar. Tilsagn gives af SMV:Digital efter pointscoring, så ingen kan love et resultat. Tjekket fortæller jer ærligt, hvis noget stopper jer.",
  },
  {
    q: "Hvem står bag, og hvad får SpAIke ud af det?",
    a: "SpAIke (Michael Mortensen) er godkendt rådgiver i SMV:Digital med speciale i AI og automatisering. Tjekket er gratis. Vil I videre, kan SpAIke være én af de rådgivere, I indhenter tilbud fra; puljen kræver, at I sammenligner flere, og det siger jeg åbent.",
  },
  {
    q: "Hvad gemmer I?",
    a: "Samtalen og vurderingen gemmes kun, hvis I selv beder om at få resultatet på mail. CVR-opslaget bruger offentlige data. Se privatlivspolitikken for detaljer.",
  },
];

export default function TilskudPage() {
  const now = new Date();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SpAIke Tilskudstjek",
        url: "https://www.spaike.dk/tilskud",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "DKK" },
        provider: { "@type": "Organization", name: "SpAIke", url: "https://www.spaike.dk" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-14 pb-12">
          <SectionLabel>Gratis tilskudstjek · beta</SectionLabel>
          <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] tracking-tight max-w-4xl mt-2">
            Kan staten betale halvdelen af jeres{" "}
            <em className="italic text-amber-dark">AI-automatisering?</em>
          </h1>
          <p className="font-serif text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
            SMV:Digital dækker 50 % af rådgivning om automatisering og AI, op til 150.000 kr.
            Indtast jeres CVR-nummer, svar på et par spørgsmål, og få en ærlig indikation af om I
            kan søge, et konkret projektoplæg og en projektbeskrivelse som grundlag for jeres ansøgning. Fem minutter,
            ingen konto.
          </p>
          <div className="mt-8">
            <TilskudFlow />
          </div>
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted mt-4">
            Gratis · ingen konto · dansk · bygget på SMV:Digitals egne regler
          </p>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>Sådan virker det</SectionLabel>
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-8 mt-6">
            {[
              ["1. CVR-opslag", "Jeg henter det, CVR allerede ved: størrelse, alder, branche. Så spørger jeg kun om det, data ikke kan svare på."],
              ["2. Otte spørgsmål", "De hårde krav først (årsværk, regnskab, kontant medfinansiering, tidligere tilskud), så hvilket flow eller område analysen skal dække, og hvor det gør ondt i dag."],
              ["3. Vurdering og oplæg", "Grøn, gul eller rød med begrundelse, den rigtige pulje og dato, et oplæg til selve analysen (omfang, spørgsmål, hypoteser, økonomi), pointindikation og en projektbeskrivelse som grundlag for jeres egen ansøgning."],
            ].map(([t, b]) => (
              <div key={t} className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-medium leading-tight">{t}</h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>Det ærlige først</SectionLabel>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mt-6">
            {[
              ["1:1 kontant", "I betaler selv halvdelen, og egne timer tæller ikke med."],
              ["Refusion bagud", "I lægger hele beløbet ud og får tilskuddet efter afrapportering."],
              ["Intet før tilsagn", "Arbejde der er startet, kan ikke dækkes. Timing er alt."],
              ["Kun rådgivning", "Kortlægning, business case, kravspec og leverandørvalg. Ikke kodning eller licenser."],
            ].map(([t, b]) => (
              <div key={t} className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-medium leading-tight">{t}</h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>Puljekalender</SectionLabel>
          <div className="mt-6 max-w-3xl divide-y divide-rule border-y border-rule">
            {PULJER.map((p) => {
              const s = puljeStatus(p, now);
              const label = s === "aaben" ? "Åben nu" : s === "kommende" ? "Kommende" : "Lukket";
              return (
                <div key={p.id} className="py-4 grid md:grid-cols-[1fr_auto] gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg font-medium">{p.navn}</h3>
                      <span
                        className={`font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border ${
                          s === "aaben" ? "border-amber-dark text-amber-dark" : "border-rule text-muted"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="font-sans text-[13.5px] text-ink-soft mt-1">
                      {p.lukker
                        ? `${formaterDato(p.aabner)} til ${formaterDato(p.lukker)}`
                        : `Åbner ${formaterDato(p.aabner)}`}
                      {" · "}
                      {p.procent} % op til {p.maksTilskudKr.toLocaleString("da-DK")} kr. · {p.medfinansiering}
                    </p>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-umami-event="tilskud_pulje_link"
                    data-umami-event-pulje={p.id}
                    className="font-sans text-[12px] tracking-wider uppercase text-amber-dark hover:text-ink self-start md:self-center"
                  >
                    Officiel side &rarr;
                  </a>
                </div>
              );
            })}
          </div>
          <p className="font-sans text-[12.5px] text-muted mt-3 max-w-3xl">
            Datoer fra smvdigital.dk og Virksomhedsguiden, senest kontrolleret 1. november 2026. Tjek altid
            den officielle side, før I planlægger efter dem.
          </p>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-14">
          <SectionLabel>Spørgsmål & svar</SectionLabel>
          <div className="mt-6 max-w-3xl space-y-7">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="font-serif text-lg font-medium">{f.q}</h3>
                <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

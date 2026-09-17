import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";
import TjekForm from "./_components/TjekForm";

export const metadata: Metadata = {
  title: "Gratis AI-tjek · Kan ChatGPT og AI-søgning finde jeres virksomhed?",
  description:
    "Indtast jeres webadresse og se på 10 sekunder, om AI-søgning kan finde, læse og anbefale jer, eller om jeres priser og tilbud er usynlige for ChatGPT. Gratis, dansk, ingen konto.",
  openGraph: {
    title: "Gratis AI-tjek · Bliver jeres virksomhed fundet af AI-søgning?",
    description:
      "Kan ChatGPT og AI-søgning finde, læse og anbefale jer, eller bliver det konkurrenten? Få en AI-parathedsscore på 10 sekunder. Gratis og på dansk.",
    url: "https://www.spaike.dk/ai-tjek",
    locale: "da_DK",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Hvad tjekker AI-tjekket?",
    a: "Om AI-søgemaskiner overhovedet kan finde, læse og anbefale jer: kan jeres indhold og priser læses uden JavaScript, er AI-crawlere (GPTBot, ClaudeBot, PerplexityBot m.fl.) blokeret, forstår AI hvem I er og hvad I sælger, og fremstår I rigtigt når I bliver delt. I får en score og en konkret liste over, hvad der spænder ben.",
  },
  {
    q: "Koster det noget, og skal jeg oprette en konto?",
    a: "Nej. Selve tjekket er gratis og kræver hverken konto eller e-mail. Rapporten får en delbar adresse, du kan sende videre.",
  },
  {
    q: "Hvad er det fulde AI-panel?",
    a: "En udvidet analyse, hvor jeres virksomhed slås op i de store AI-motorer med de spørgsmål, jeres kunder faktisk stiller: bliver I nævnt, hvem anbefales i stedet, og hvilke kilder citeres? Den leveres som rapport pr. mail.",
  },
  {
    q: "Gemmer I noget om mit site?",
    a: "Kun selve scan-resultatet (adresse, score og fund), så rapport-linket virker. Ingen persondata, medmindre du selv skriver dig op til det fulde panel.",
  },
];

export default function AiTjekPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SpAIke AI-tjek",
        url: "https://www.spaike.dk/ai-tjek",
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
          <SectionLabel>Gratis AI-tjek · beta</SectionLabel>
          <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.02] tracking-tight max-w-4xl mt-2">
            Bliver jeres virksomhed anbefalet af AI, eller bliver jeres{" "}
            <em className="italic text-amber-dark">konkurrent?</em>
          </h1>
          <p className="font-serif text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
            Flere og flere kunder spørger ChatGPT og AI-søgning til råds, før de vælger
            leverandør. Indtast jeres webadresse og få på 10 sekunder en
            AI-parathedsscore: kan AI-motorerne overhovedet læse, forstå og citere jer?
          </p>
          <div className="mt-8">
            <TjekForm />
          </div>
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted mt-4">
            Gratis · ingen konto · dansk · delbar rapport
          </p>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>Det tjekker vi</SectionLabel>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mt-6">
            {[
              ["Kan AI læse jeres tilbud og priser?", "Loader jeres priser og ydelser først med JavaScript, ser AI en tom side og kan ikke sende kunder videre til jer."],
              ["Lukker I AI ude uden at vide det?", "Én linje kode kan blokere ChatGPT og Google AI fra jeres site. Så bliver I aldrig anbefalet, uanset hvor godt indholdet er."],
              ["Ved AI hvem I er, og hvad I sælger?", "Kan AI koble navn, ydelser og priser sammen, bliver I et klart svar i stedet for et gæt."],
              ["Fremstår I rigtigt, når I bliver delt?", "Titel, beskrivelse og delekort afgør, hvordan I ser ud i AI-svar, på Google og når en kunde sender jer videre."],
            ].map(([t, b]) => (
              <div key={t} className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-medium leading-tight">{t}</h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">{b}</p>
              </div>
            ))}
          </div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

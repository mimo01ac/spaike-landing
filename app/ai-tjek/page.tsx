import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DoubleRule, SectionLabel } from "../components/EditorialUI";
import TjekForm from "./_components/TjekForm";

export const metadata: Metadata = {
  title: "Gratis AI-tjek · Kan ChatGPT og AI-søgning finde jeres virksomhed?",
  description:
    "Indtast jeres webadresse og få på 10 sekunder en AI-parathedsscore: kan AI-crawlere læse jeres site, er I blokeret i robots.txt, og har I den metadata, AI-svar bygger på? Gratis, dansk, ingen konto.",
  openGraph: {
    title: "Gratis AI-tjek · Bliver jeres virksomhed fundet af AI-søgning?",
    description:
      "AI-parathedsscore på 10 sekunder: crawlbarhed, robots.txt, struktureret data og delingskort. Gratis og på dansk.",
    url: "https://www.spaike.dk/ai-tjek",
    locale: "da_DK",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Hvad tjekker AI-tjekket?",
    a: "Otte tekniske forudsætninger for at blive fundet og citeret af AI-søgemaskiner: om jeres indhold kan læses uden JavaScript, om AI-crawlere (GPTBot, ClaudeBot, PerplexityBot m.fl.) er blokeret i robots.txt, struktureret data, metadata, sitemap, overskriftsstruktur og delingskort.",
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
              ["Læsbarhed uden JavaScript", "AI-crawlere kører ikke JS. Er jeres indhold usynligt for dem, findes I ikke i AI-svar."],
              ["AI-crawlere i robots.txt", "Blokerer I GPTBot, ClaudeBot eller PerplexityBot, kan de hverken citere eller anbefale jer."],
              ["Struktureret data", "Schema.org-markup gør jeres fakta maskinlæsbare og styrker jeres brand-entitet."],
              ["Metadata & delingskort", "Titel, beskrivelse, sitemap og OpenGraph: fundamentet både Google og AI-motorer bygger på."],
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

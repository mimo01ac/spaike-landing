import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SnapshotFlow from "./_components/SnapshotFlow";

/*
 * SpAIke Snapshot (SPA-1290): Se-trinnet i SpAIke-metoden. Højst 9 spørgsmål,
 * resultatet vises med det samme uden mail; detaljerne ligger bag en mail-gate,
 * der gemmes via /api/kontakt (action "snapshot"). Beregning: lib/snapshot/beregn.ts.
 */

export const metadata: Metadata = {
  title: "SpAIke Snapshot · Hvor går jeres tid, og hvad koster det?",
  description:
    "Højst 9 korte spørgsmål på ca. 2 minutter. Se jeres største tidsrøver i timer om måneden og kroner om året, hvor langt I er med automatisering på en skala fra 0 til 3, og hvilket modul der passer. Gratis, uden mail.",
  alternates: { canonical: "/tjek" },
  openGraph: {
    title: "SpAIke Snapshot · Hvor går jeres tid, og hvad koster det?",
    description:
      "Jeres største tidsrøver i timer og kroner på ca. 2 minutter. Gratis, uden mail.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/tjek",
    images: [{ url: "/og/spaike-default.png", width: 1200, height: 630, alt: "SpAIke Snapshot" }],
  },
};

export default function TjekPage() {
  return (
    <>
      <Header />
      <main className="px-6 md:px-14 pt-8 md:pt-12 pb-16 min-h-[70vh]">
        <SnapshotFlow />
      </main>
      <Footer />
    </>
  );
}

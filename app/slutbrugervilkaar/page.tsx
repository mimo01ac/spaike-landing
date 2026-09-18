import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Slutbrugervilkår | SpAIke",
  description:
    "Vilkår for brug af SpAIkes integrationer og apps, fx SpAIke Fakturering. Kunden kobler integrationen på sine egne systemer via adgange, kunden selv godkender.",
  alternates: { canonical: "https://www.spaike.dk/slutbrugervilkaar" },
  openGraph: {
    title: "Slutbrugervilkår | SpAIke",
    description:
      "Vilkår for brug af SpAIkes integrationer og apps.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/slutbrugervilkaar",
  },
};

export default function Slutbrugervilkaar() {
  return (
    <LegalPage title="Slutbrugervilkår" updated="18. september 2026">
      <p className="meta">
        Vilkår for brug af SpAIkes integrationer og apps (fx SpAIke
        Fakturering).
      </p>

      <h2>Brugsret</h2>
      <p>
        SpAIke (mimoco ApS) giver kunden en ikke-eksklusiv, ikke-overdragelig
        ret til at bruge den leverede integration i kundens egen drift i
        aftaleperioden. Integrationen kobler sig på kundens egne systemer via de
        adgange, kunden selv godkender.
      </p>

      <h2>Kundens ansvar</h2>
      <p>
        Kunden er ansvarlig for rigtigheden af egne data og for at godkende de
        handlinger (fx fakturaer), som integrationen forbereder. Kunden sikrer,
        at de nødvendige adgange gives efter mindste-privilegie.
      </p>

      <h2>Ansvarsbegrænsning</h2>
      <p>
        Integrationen leveres inden for rammerne af den indgåede
        leveranceaftale. SpAIke er ikke ansvarlig for indirekte tab. Intet i
        disse vilkår begrænser ansvar, der ikke lovligt kan begrænses.
      </p>

      <h2>Ophør</h2>
      <p>
        Kunden kan til enhver tid trække integrationens adgange tilbage i sine
        egne systemer. Ved ophør ophører brugsretten, og data håndteres efter{" "}
        <a href="/databehandleraftale">databehandleraftalen</a>.
      </p>

      <h2>Kontakt</h2>
      <p>mimoco ApS (SpAIke), CVR 39127709, michael@spaike.dk.</p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Databehandleraftale | SpAIke",
  description:
    "SpAIke anvender Datatilsynets officielle standardkontraktsbestemmelser for databehandleraftaler. Den bindende aftale udfyldes og underskrives individuelt pr. kunde.",
  alternates: { canonical: "https://www.spaike.dk/databehandleraftale" },
  openGraph: {
    title: "Databehandleraftale | SpAIke",
    description:
      "SpAIke behandler personoplysninger efter Datatilsynets standardkontraktsbestemmelser. Al behandling i EU.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/databehandleraftale",
  },
};

export default function Databehandleraftale() {
  return (
    <LegalPage title="Databehandleraftale" updated="18. september 2026">
      <p className="meta">
        SpAIke (mimoco ApS) anvender Datatilsynets officielle
        standardkontraktsbestemmelser.
      </p>

      <h2>Grundlag</h2>
      <p>
        Når SpAIke behandler personoplysninger på vegne af en kunde, sker det
        efter <strong>Datatilsynets standardkontraktsbestemmelser</strong> for
        databehandleraftaler (de danske standardbestemmelser vedtaget af
        Datatilsynet i medfør af databeskyttelsesforordningens artikel 28, stk.
        8). Vi bruger denne standard, fordi den har særlig retlig bindende
        karakter og ikke efterprøves yderligere af Datatilsynet ved tilsyn.
      </p>

      <h2>Individuel pr. kunde</h2>
      <p>
        Den konkrete databehandleraftale udfyldes og underskrives{" "}
        <strong>individuelt med hver kunde</strong> (den dataansvarlige), med
        bilag om behandlingens genstand og varighed, kategorier af registrerede
        og oplysninger samt de tekniske og organisatoriske
        sikkerhedsforanstaltninger. Denne side beskriver den faste ramme, der
        indgår i bilagene.
      </p>

      <h2>SpAIkes faste ramme</h2>
      <ul>
        <li>
          Al behandling i EU (Azure EU-region); Azure OpenAI i EU-region; data
          forlader ikke EU.
        </li>
        <li>
          Kryptering under transport (HTTPS) og af hemmeligheder (Azure Key
          Vault); mindste-privilegie-adgang og adskilte læse-/skrive-rettigheder.
        </li>
        <li>
          Underdatabehandlere, alle i EU: Microsoft (Azure og Azure OpenAI),
          Visma e-conomic samt Björn Lundén / EazyProject.
        </li>
        <li>
          Menneske-i-loopet før forpligtende handlinger (fx godkendes fakturaer
          af kunden før afsendelse); audit-log over skrivninger; sletning eller
          tilbagelevering af data ved ophør efter kundens valg.
        </li>
        <li>
          Der behandles ikke særlige kategorier (følsomme) af
          personoplysninger.
        </li>
      </ul>

      <h2>Skabelon og kilde</h2>
      <p>
        Standardaftalen bygger på{" "}
        <a
          href="https://www.datatilsynet.dk/Media/637696299321948979/Datatilsynet_skabelon-til-databehandleraftale-dansk.docx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datatilsynets officielle standard-databehandleraftale
        </a>
        . Læs mere om{" "}
        <a
          href="https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2019/dec/standardkontraktsbestemmelser-vedtaget-af-datatilsynet"
          target="_blank"
          rel="noopener noreferrer"
        >
          standardkontraktsbestemmelserne vedtaget af Datatilsynet
        </a>
        . Kontakt os på michael@spaike.dk for at indgå den konkrete aftale.
      </p>
    </LegalPage>
  );
}

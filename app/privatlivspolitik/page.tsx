import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privatlivspolitik | SpAIke",
  description:
    "Sådan behandler SpAIke (mimoco ApS) personoplysninger, når vi driver spaike.dk og leverer vores automatiserings- og integrationsløsninger.",
  alternates: { canonical: "https://www.spaike.dk/privatlivspolitik" },
  openGraph: {
    title: "Privatlivspolitik | SpAIke",
    description:
      "Sådan behandler SpAIke personoplysninger. Al behandling i EU, mindste-privilegie, data forlader ikke EU.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk/privatlivspolitik",
  },
};

export default function Privatlivspolitik() {
  return (
    <LegalPage title="Privatlivspolitik" updated="12. oktober 2026">
      <p className="meta">
        mimoco ApS (SpAIke) &middot; CVR 39127709 &middot; Turistvej 177, 3460
        Birkerød &middot; michael@spaike.dk
      </p>

      <h2>Hvem vi er</h2>
      <p>
        SpAIke er et binavn for mimoco ApS (&quot;SpAIke&quot;,
        &quot;vi&quot;, &quot;os&quot;). Vi bygger og driver
        automatiseringsløsninger, der kobler sig på vores kunders eksisterende
        forretningssystemer (fx e-conomic og EazyProject) via officielle
        API&apos;er. Denne politik beskriver, hvordan vi behandler
        personoplysninger, når vi driver spaike.dk og leverer vores løsninger.
      </p>

      <h2>Når du besøger spaike.dk</h2>
      <p>
        Kontakter du os via formular eller mail, behandler vi de oplysninger, du
        selv giver os (navn, e-mail, besked), alene for at kunne svare og følge
        op. Vi sælger aldrig oplysninger videre. Vi bruger kun nødvendige
        cookies og sætter ikke tredjeparts-marketing-cookies uden dit samtykke.
      </p>

      <h2>Når vi leverer en løsning til en kunde</h2>
      <p>
        I vores integrationer behandler vi de data, der ligger i kundens egne
        systemer (fx faktura-, kunde- og projektdata i e-conomic og
        EazyProject). Her handler vi som <strong>databehandler</strong> på vegne
        af kunden, som er dataansvarlig. Behandlingen sker udelukkende for at
        levere den aftalte funktion, fx at samle fakturagrundlag, danne
        fakturaudkast og skrive dem tilbage i kundens system. Vilkårene står i
        vores{" "}
        <a href="/databehandleraftale">databehandleraftale</a>.
      </p>

      <h2>Når du forbinder din e-mail og kalender</h2>
      <p>
        I nogle af vores løsninger kan du som bruger vælge at forbinde din egen
        e-mail- og kalenderkonto hos <strong>Microsoft 365/Outlook</strong>{" "}
        eller <strong>Google Workspace/Gmail</strong>, så assistenten kan hjælpe
        med opfølgnings-mails og møder. Forbindelsen er frivillig, oprettes via
        udbyderens officielle OAuth-login, og du kan afbryde den igen når som
        helst.
      </p>
      <p>Når du forbinder en konto, beder vi kun om den adgang, funktionerne kræver:</p>
      <ul>
        <li>
          <strong>Google:</strong> læse dine seneste Gmail-beskeder for kontekst
          (<em>gmail.readonly</em>), sende mails du selv godkender
          (<em>gmail.send</em>), oprette og opdatere kalenderaftaler
          (<em>calendar.events</em>) og se din e-mailadresse
          (<em>userinfo.email</em>).
        </li>
        <li>
          <strong>Microsoft:</strong> læse dine seneste mails (<em>Mail.Read</em>),
          sende mails du selv godkender (<em>Mail.Send</em>) og oprette/opdatere
          kalenderaftaler (<em>Calendars.ReadWrite</em>).
        </li>
      </ul>
      <p>
        Vi bruger kun disse data til at levere de funktioner, du selv beder om:
        at vise relevant kontekst, og at sende mails eller oprette møder, som du{" "}
        <strong>udtrykkeligt godkender først</strong>. Vi gemmer ikke dine mails
        eller kalenderaftaler hos os; de hentes kun i øjeblikket for at udføre
        den konkrete handling. Vi sælger og deler aldrig dine mails eller
        kalenderdata, og vi bruger dem ikke til annoncering eller til at træne
        AI-modeller. Adgangstokens opbevares krypteret (AES-256-GCM) pr. bruger
        og slettes, når du afbryder forbindelsen.
      </p>
      <p>
        <strong>Google Limited Use:</strong> SpAIkes brug af oplysninger
        modtaget fra Google API&apos;er overholder{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , herunder kravene om <em>Limited Use</em>. In English: &quot;SpAIke&apos;s
        use of information received from Google APIs will adhere to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.&quot;
      </p>

      <h2>Hvor data behandles</h2>
      <ul>
        <li>
          Behandling sker i <strong>EU</strong> (Microsoft Azure, EU-region).
          Data forlader ikke EU.
        </li>
        <li>
          Hvor vi bruger sprogmodeller (AI) til fx at foreslå fakturatekst, sker
          det via <strong>Azure OpenAI i EU-region</strong> i kundens eget
          miljø. Data bruges ikke til at træne modeller.
        </li>
        <li>
          Nøgler og adgangstokens opbevares krypteret (Azure Key Vault), aldrig
          i klartekst i kode.
        </li>
        <li>
          Vi arbejder efter mindste-privilegie: vi beder kun om den adgang, en
          given funktion kræver.
        </li>
      </ul>

      <h2>Retsgrundlag og opbevaring</h2>
      <p>
        For besøgende på spaike.dk er retsgrundlaget vores legitime interesse i
        at besvare henvendelser (samt samtykke, hvor det kræves). For
        kundeleverancer behandler vi data efter databehandleraftalen og kundens
        instruks. Vi opbevarer kun oplysninger, så længe det er nødvendigt for
        formålet eller kræves af lovgivningen (fx bogføringsloven).
      </p>

      <h2>Dine rettigheder</h2>
      <p>
        Du har ret til indsigt, berigtigelse, sletning, begrænsning og
        indsigelse samt dataportabilitet. Er du kunde hos en af vores kunder,
        retter du henvendelsen til den pågældende dataansvarlige, som vi bistår.
        Skriv til michael@spaike.dk. Du kan klage til Datatilsynet (
        <a
          href="https://www.datatilsynet.dk"
          target="_blank"
          rel="noopener noreferrer"
        >
          datatilsynet.dk
        </a>
        ).
      </p>
    </LegalPage>
  );
}

// Engangs-preview: renderer brief-mailen med det berigede vurderingslag.
import { renderBriefEmail } from "../lib/email.ts";
import { writeFileSync } from "node:fs";

const brief = {
  virksomhed: "Testfirma, handelsvirksomhed med webshop og B2B-salg",
  deltagere_forslag: ["Kundeservicechef", "Salgschef", "En sælger", "En kundeservicemedarbejder"],
  cases: [
    {
      titel: "Gentagne kundeservice-mails kategoriseres og besvares manuelt",
      problem: "Kundeservice bruger halvdelen af dagen på at kategorisere og besvare de samme spørgsmål om levering, returnering og fakturaer i den fælles indbakke.",
      hvorfor_godt_fit: "Konkret, aktuel smerte der rammer 4-6 medarbejdere dagligt, og gentagne spørgsmål er præcis det, AI løser bedst.",
      mulig_loesning: "En assistent der kategoriserer indkommende mails og laver svar-udkast til de gentagne spørgsmål.",
      datakrav_niveau: "mellem",
      datakrav: "Adgang til den fælles indbakke og historik over tidligere mails og svar.",
      faldgrube: "Det er fristende at få systemet til at besvare ALLE mails selv, men det vigtige er at tage de 70 pct. mest gentagne spørgsmål hurtigt og lade mennesker håndtere resten.",
      kategori: "effektivisere",
    },
    {
      titel: "Tilbud bygges manuelt hver gang fra Word-skabeloner og Excel-prisliste",
      problem: "Sælgerne bygger hvert tilbud i hånden ud fra gamle tilbud og en prisliste i Excel. Det tager tid og giver fejl i priserne.",
      hvorfor_godt_fit: "Gentaget manuelt arbejde med et tydeligt før/efter, og demo-bart på en enkelt dag.",
      mulig_loesning: "En tilbudsbygger der henter priser automatisk og udfylder jeres skabelon.",
      datakrav_niveau: "mellem",
      datakrav: "Adgang til prislisten i Excel og jeres tilbudsskabelon.",
      faldgrube: "Man kan blive fristet til at integrere med hele ERP-systemet fra dag ét. Start med at spare 20 minutter pr. tilbud ved at fjerne copy-paste og manuelt prisopslag.",
      kategori: "effektivisere",
    },
  ],
  samlet_anbefaling: "Start med kundeservice-indbakken: størst daglig smerte, flest berørte medarbejdere, og resultatet kan mærkes fra første uge.",
} as const;

const { html } = renderBriefEmail(brief as never);
writeFileSync("docs/reviews/brief-mail-preview.html", html);
console.log("skrevet: docs/reviews/brief-mail-preview.html");

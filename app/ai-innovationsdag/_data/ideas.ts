/**
 * Idékatalog til AI-innovationsdag, fokus på det kommercielle (Go-to-Market).
 * Konkrete, vibe-code-bare cases der inspirerer "hvad kan vi egentlig bygge?".
 *
 * Grundlag: markedsresearch juni 2026 på hvad folk reelt har vibe-coded i
 * kommercielle funktioner (SaaStr, Lovable/Bolt/Replit-cases, CS/onboarding-
 * benchmarks). Udbytte + byggetid er typiske størrelsesordener, ikke garantier
 * (én dag giver en demo-bar prototype af én feature). Rediger frit.
 *
 * TODO Michael: kuratér listen (tilføj/fjern), så den matcher dine egne cases.
 */

export const IDEA_CATEGORIES = [
  "Salg",
  "RevOps",
  "Marketing",
  "Customer Success",
  "Onboarding",
  "Internt & data",
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

export interface Idea {
  kategori: IdeaCategory;
  titel: string;
  beskrivelse: string;
  udbytte: string;
  byggetid: string;
}

export const IDEAS: Idea[] = [
  // ── Salg ──────────────────────────────────────────────
  {
    kategori: "Salg",
    titel: "Lead- og konto-prioritering",
    beskrivelse:
      "En app der scorer og sorterer jeres leads eller konti efter et par signaler (branche, størrelse, aktivitet), så sælgerne ved hvem de skal tage fat i først.",
    udbytte: "Slut med 'hvem ringer jeg til?'. Tid brugt på de rigtige konti.",
    byggetid: "½ dag",
  },
  {
    kategori: "Salg",
    titel: "Møde-forberedelse på ét klik",
    beskrivelse:
      "Indtast en konto, og få et 1-siders pre-call brief der samler offentlig info og jeres egne noter ét sted.",
    udbytte: "Bedre møder, mindre manuel forberedelse før hvert opkald.",
    byggetid: "½ til 1 dag",
  },
  {
    kategori: "Salg",
    titel: "Tilbuds- og pris-bygger",
    beskrivelse:
      "En formular der ud fra få input genererer et konsistent tilbud eller en PDF i jeres skabelon.",
    udbytte: "Hurtigere, ensartede tilbud uden copy-paste-fejl.",
    byggetid: "½ dag",
  },

  // ── RevOps ────────────────────────────────────────────
  {
    kategori: "RevOps",
    titel: "Pipeline-hygiejne-dashboard",
    beskrivelse:
      "Et overblik der viser deals uden næste skridt eller deals der er gået i stå, så I kan rydde op før forecast.",
    udbytte: "Renere pipeline og et forecast I kan stole på.",
    byggetid: "½ dag",
  },
  {
    kategori: "RevOps",
    titel: "Provisions-beregner",
    beskrivelse:
      "Et værktøj der regner sælgernes provision ud fra lukkede deals i stedet for et skrøbeligt regneark.",
    udbytte: "Gennemsigtighed for sælgerne, mindre manuelt bøvl for ops.",
    byggetid: "½ til 1 dag",
  },
  {
    kategori: "RevOps",
    titel: "To systemer der taler sammen",
    beskrivelse:
      "En lille automatisering (webhook) der flytter data mellem fx jeres CRM og et regneark eller Slack, når noget sker.",
    udbytte: "Ingen manuel kopiering mellem systemer mere.",
    byggetid: "½ dag",
  },

  // ── Marketing ─────────────────────────────────────────
  {
    kategori: "Marketing",
    titel: "Kampagne-overblik",
    beskrivelse:
      "Et dashboard der samler tal fra et par kilder til ét billede af hvad der virker lige nu.",
    udbytte: "Beslutninger på data, ikke mavefornemmelse, uden at vente på en rapport.",
    byggetid: "½ dag",
  },
  {
    kategori: "Marketing",
    titel: "Content-genbrug",
    beskrivelse:
      "Indsæt en tekst og få varianter til LinkedIn, nyhedsbrev eller annoncer i jeres egen tone.",
    udbytte: "Mere content ud af det samme stof, hurtigere.",
    byggetid: "½ dag",
  },
  {
    kategori: "Marketing",
    titel: "Interaktiv lead-magnet",
    beskrivelse:
      "En lille quiz eller selector der kvalificerer besøgende og giver dem et brugbart svar (præcis som dette discovery-tool).",
    udbytte: "Varme leads der ankommer med kontekst.",
    byggetid: "1 dag",
  },

  // ── Customer Success ──────────────────────────────────
  {
    kategori: "Customer Success",
    titel: "Kunde-health-score",
    beskrivelse:
      "Et dashboard der scorer kunder ud fra brug og aktivitet og flagger churn-risiko tidligt.",
    udbytte: "Proaktiv CS. Lignende teams håndterer 3x flere konti uden at hyre.",
    byggetid: "½ til 1 dag",
  },
  {
    kategori: "Customer Success",
    titel: "QBR-generator",
    beskrivelse:
      "Træk en kundes tal og milepæle sammen til et færdigt QBR-oplæg på minutter.",
    udbytte: "Mindre forberedelse, mere ensartede kundemøder.",
    byggetid: "½ dag",
  },

  // ── Onboarding ────────────────────────────────────────
  {
    kategori: "Onboarding",
    titel: "Kunde-onboarding-portal",
    beskrivelse:
      "En portal hvor kunden ser sin egen fremdrift i onboarding i realtid.",
    udbytte: "Færre 'hvor langt er vi?'-mails. Support-henvendelser falder markant.",
    byggetid: "1 dag",
  },
  {
    kategori: "Onboarding",
    titel: "Intern onboarding-checkliste",
    beskrivelse:
      "En app der guider nye medarbejdere gennem deres første uger med opgaver, links og ejere.",
    udbytte: "Hurtigere produktive nyansatte, mindre håndholdning.",
    byggetid: "½ til 1 dag",
  },

  // ── Internt & data ────────────────────────────────────
  {
    kategori: "Internt & data",
    titel: "Spørg vores dokumenter",
    beskrivelse:
      "En intern søgning der svarer på spørgsmål ud fra jeres egne politikker, FAQ og processer.",
    udbytte: "Folk finder svar selv i stedet for at spørge en kollega.",
    byggetid: "1 dag",
  },
  {
    kategori: "Internt & data",
    titel: "Den manuelle rapport, automatiseret",
    beskrivelse:
      "Erstat en tilbagevendende rapport, der samles i hånden, med en der genereres automatisk.",
    udbytte: "Typisk flere timer sparet hver uge, uden manuelle fejl.",
    byggetid: "½ dag",
  },
  {
    kategori: "Internt & data",
    titel: "Data-oprydning i hånden, væk",
    beskrivelse:
      "Et lille værktøj der renser, matcher eller beriger et rodet datasæt (fx dubletter i CRM).",
    udbytte: "Pålidelige data uden timevis af manuelt klik.",
    byggetid: "½ dag",
  },
];

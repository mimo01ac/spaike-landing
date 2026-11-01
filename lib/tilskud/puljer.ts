/**
 * Puljekalender for SMV:Digital (datalaget til /tilskud).
 *
 * Kilde: smvdigital.dk "Puljer" + Virksomhedsguiden, verificeret 2026-11-01.
 * Datoer er dansk tid. Opdatér her når en ny pulje annonceres; alt andet
 * (nedtælling, "næste pulje", agentens faktagrundlag) læser herfra.
 */

export type PuljeType = "raadgivning" | "robot";

export interface Pulje {
  id: string;
  navn: string;
  type: PuljeType;
  /** ISO-tidspunkt for åbning af ansøgningsvinduet. */
  aabner: string;
  /** ISO-tidspunkt for lukning. Udeladt = ikke offentliggjort endnu. */
  lukker?: string;
  maksTilskudKr: number;
  minTilskudKr?: number;
  /** Tilskudsprocent af de støtteberettigede udgifter. */
  procent: number;
  medfinansiering: string;
  maalgruppe: string;
  /** Korte forbehold der skal med i enhver omtale. */
  forbehold: string[];
  url: string;
}

export const PULJER: Pulje[] = [
  {
    id: "digitalisering-2026-11",
    navn: "Digitalisering (rådgivertilskud)",
    type: "raadgivning",
    aabner: "2026-11-09T09:00:00+01:00",
    lukker: "2026-11-16T23:55:00+01:00",
    maksTilskudKr: 150_000,
    minTilskudKr: 50_000,
    procent: 50,
    medfinansiering: "1:1 kontant (egne timer tæller ikke)",
    maalgruppe:
      "Virksomheder der allerede har digitaliseret flere funktioner og vil i gang med et større projekt, fx systemintegration på tværs af forretningsområder, automatisering eller AI.",
    forbehold: [
      "Pointscoret: 0-5 for digitaliseringspotentiale/business case, 0-5 for kapacitet, minus op til 3 for tidligere tilskud. Tilsagn fra 7 point.",
      "Cybersikkerhed, digital marketing og simple ERP-projekter er begrænset til 50.000 kr.",
      "Ét forløb pr. CVR-nummer pr. spor ad gangen. Projektperiode 8 måneder.",
      "Udbetales bagud som refusion efter afrapportering.",
    ],
    url: "https://virksomhedsguiden.dk/content/ydelser/digitalisering-raadgivertilskud/00f2ddc0-76bb-4cb8-b15c-989ed1228c3d/",
  },
  {
    id: "cyber-digitalisering-2027-03",
    navn: "Cybersecurity og digitalisering (rådgivertilskud)",
    type: "raadgivning",
    aabner: "2027-03-01T09:00:00+01:00",
    maksTilskudKr: 50_000,
    procent: 50,
    medfinansiering: "1:1 kontant",
    maalgruppe:
      "Cybersikkerhed prioriteres (risikoanalyse og handlingsplan), men andre digitaliseringsprojekter kan også søge.",
    forbehold: ["Mindre billet: maks. 50.000 kr. i tilskud.", "Lukkedato er ikke offentliggjort endnu."],
    url: "https://virksomhedsguiden.dk/content/ydelser/cybersecurity-og-digitalisering-raadgivertilskud/d0dc757e-7ff0-4a7b-ab26-8d023a80656e/",
  },
  {
    id: "robot-2026-10",
    navn: "Lån og afprøv en robot",
    type: "robot",
    aabner: "2026-10-26T09:00:00+01:00",
    maksTilskudKr: 125_000,
    procent: 100,
    medfinansiering: "Ingen",
    maalgruppe: "Produktionsvirksomheder der vil afprøve en fysisk robot før investering. Kræver godkendt systemintegrator.",
    forbehold: ["Ikke rådgivning om software/AI; kun fysiske robotter."],
    url: "https://virksomhedsguiden.dk/content/ydelser/tilskud-laan-og-afproev-en-robot/3bddc30c-1d44-4da0-a57f-f689ba972c7b/",
  },
];

export type PuljeStatus = "aaben" | "kommende" | "lukket";

export function puljeStatus(p: Pulje, now: Date = new Date()): PuljeStatus {
  const t = now.getTime();
  if (t < Date.parse(p.aabner)) return "kommende";
  if (p.lukker && t > Date.parse(p.lukker)) return "lukket";
  return "aaben";
}

/** Den rådgivningspulje der er åben nu, ellers den næste der åbner. */
export function naesteRaadgivningspulje(now: Date = new Date()): Pulje | null {
  const kandidater = PULJER.filter((p) => p.type === "raadgivning").filter(
    (p) => puljeStatus(p, now) !== "lukket",
  );
  kandidater.sort((a, b) => Date.parse(a.aabner) - Date.parse(b.aabner));
  return kandidater[0] ?? null;
}

export function formaterDato(iso: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Copenhagen",
  }).format(new Date(iso));
}

/** Kompakt tekstblok til agentens system-prompt (stabil, så den kan caches). */
export function puljerSomTekst(): string {
  return PULJER.map((p) => {
    const vindue = p.lukker
      ? `${formaterDato(p.aabner)} til ${formaterDato(p.lukker)}`
      : `åbner ${formaterDato(p.aabner)} (lukkedato ikke offentliggjort)`;
    return [
      `- ${p.navn} [id: ${p.id}] · ${p.type === "robot" ? "robot" : "rådgivning"} · ${p.procent} % op til ${p.maksTilskudKr.toLocaleString("da-DK")} kr.` +
        (p.minTilskudKr ? ` (min. ${p.minTilskudKr.toLocaleString("da-DK")} kr.)` : ""),
      `  Vindue: ${vindue}. Medfinansiering: ${p.medfinansiering}.`,
      `  Målgruppe: ${p.maalgruppe}`,
      ...p.forbehold.map((f) => `  Forbehold: ${f}`),
    ].join("\n");
  }).join("\n");
}

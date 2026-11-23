/**
 * SpAIke Snapshot (/tjek): spørgsmål, validering og den deterministiske
 * beregning. Kilde: vault "01 SpAIke/tidsroever-tjek.html" (prototype) og
 * "Pakning og value proposition - SpAIke-metoden (sep 2026).md" §3.3
 * (modenhed 0-3 og de seks moduler).
 *
 * Rent modul uden imports: bruges af siden (klient), af /api/kontakt
 * (action "snapshot", serveren regner selv igen) og af scripts/snapshot-cli.mjs
 * (Node type-stripping). Brug derfor ingen enums, path-aliaser eller andet,
 * Node ikke kan strippe.
 *
 * Regnestykket: timer pr. uge (interval fra svaret) × 52 uger × timeløn × 1,25
 * (pension, ferie og andre lønomkostninger) = kroner om året. Timer om måneden
 * = timer pr. uge × 52 / 12. Alt vises som afrundet interval, fordi svarene er
 * intervaller og et skøn. Ingen benchmark: designnoten har ingen kilde til den.
 */

export const OVERHEAD = 1.25;
export const UGER_PR_AAR = 52;
export const MAKS_PROCESSER = 3;

export type ProcesId = "mail" | "data" | "followup" | "report" | "knowledge" | "keyperson" | "andet";
export type TimerId = "0-2" | "3-5" | "6-10" | "11-20" | "20+";
export type LoenId = "under-200" | "200-300" | "300-450" | "450+";
export type StoerrelseId = "1-5" | "6-20" | "21-50" | "50+";
export type ModenhedSvarId = "manuelt" | "spredt" | "gaaet-i-staa" | "en-koerer" | "flere-koerer";

export const BRANCHER = [
  "Klinik og sundhed",
  "Rådgivning og professionel service",
  "Handel og e-handel",
  "Håndværk, byggeri og anlæg",
  "Produktion og industri",
  "Transport og logistik",
  "Ejendom og administration",
  "Andet",
] as const;

export const STOERRELSER: { id: StoerrelseId; tekst: string }[] = [
  { id: "1-5", tekst: "1-5" },
  { id: "6-20", tekst: "6-20" },
  { id: "21-50", tekst: "21-50" },
  { id: "50+", tekst: "Over 50" },
];

export const ROLLER = ["Ejer eller direktør", "Leder", "Medarbejder"] as const;

type ModulRef = { id: string; navn: string; goer: string };

/** Modulerne svarer til modul-kataloget på /ydelser (ankrene er modul-id'erne). */
const MODULER: Record<string, ModulRef> = {
  henvendelser: {
    id: "henvendelser",
    navn: "Henvendelses-modul",
    goer: "Sorterer mails, skriver svarkladder og fører reklamationer igennem. En medarbejder godkender svaret.",
  },
  sager: {
    id: "sager",
    navn: "Sags- og dokument-modul",
    goer: "Gør en formular eller en mail til færdige sager og dokumenter i jeres egne systemer.",
  },
  opfoelgning: {
    id: "opfoelgning",
    navn: "Opfølgnings-modul",
    goer: "Forberedelse før mødet, opfølgning bagefter, en ringeliste og et CRM, der holder sig selv opdateret.",
  },
  overblik: {
    id: "overblik",
    navn: "Overbliks-modul",
    goer: "Henter tallene fra jeres systemer og samler dem i en ugentlig status til ledelsen.",
  },
  viden: {
    id: "viden",
    navn: "Videns-modul",
    goer: "Samler virksomhedens viden, så medarbejderne kan finde den i jeres egen Claude eller Copilot.",
  },
  kundedialog: {
    id: "kundedialog",
    navn: "Kunde-dialog-modul",
    goer: "En chatbot eller en stemmeagent, der svarer kunderne døgnet rundt ud fra jeres egen viden.",
  },
};

export const PROCESSER: Record<
  Exclude<ProcesId, "andet">,
  { label: string; modul: string; forslag: string[] }
> = {
  mail: {
    label: "Besvare indgående mails og henvendelser",
    modul: "henvendelser",
    forslag: [
      "Henvendelserne sorteres automatisk, og de hyppigste spørgsmål får et svarudkast med det samme.",
      "Kunden får straks besked om, hvornår der kommer svar, også uden for åbningstid.",
      "Resten får et færdigt udkast i jeres egen tone, som en medarbejder godkender med ét klik.",
    ],
  },
  data: {
    label: "Flytte data mellem systemer",
    modul: "sager",
    forslag: [
      "Data flyttes automatisk mellem jeres systemer, så I kun taster tingene ind én gang.",
      "Fejl bliver fanget, før de breder sig til flere systemer.",
      "Overførslerne kører af sig selv om natten.",
    ],
  },
  followup: {
    label: "Følge op på leads og kunder",
    modul: "opfoelgning",
    forslag: [
      "Leads, der er gået i stå, får automatisk en opfølgning på mail.",
      "I får besked, når nogen ikke har svaret i et bestemt antal dage, så intet bliver glemt.",
      "Opfølgningen skrives som et personligt udkast ud fra historikken, og en sælger godkender.",
    ],
  },
  report: {
    label: "Lave rapporter og opgørelser",
    modul: "overblik",
    forslag: [
      "Rapporterne laves automatisk ud fra kilderne i stedet for manuel indtastning.",
      "Et overblik, der altid er opdateret, i stedet for et regneark, der samles hver måned.",
      "Et kort skriftligt resumé til ledelsen oven på tallene.",
    ],
  },
  knowledge: {
    label: "Finde viden, der ligger spredt",
    modul: "viden",
    forslag: [
      "Medarbejderne kan søge i jeres dokumenter og få svar med henvisning til kilden.",
      "Svar på sekunder i stedet for at lede i mapper eller spørge kolleger.",
      "Nye medarbejdere får svar på de spørgsmål, de altid stiller, uden at forstyrre andre.",
    ],
  },
  keyperson: {
    label: "Opgaver, som kun én bestemt person kan løse",
    modul: "kundedialog",
    forslag: [
      "Arbejdsgangen bliver beskrevet, så en kollega eller et system kan udføre den.",
      "Forretningen går ikke i stå, når personen er syg eller på ferie.",
      "Kunderne kan få svar på de faste spørgsmål døgnet rundt, uden at det går gennem én person.",
    ],
  },
};

export const PROCES_RAEKKEFOELGE: ProcesId[] = ["mail", "data", "followup", "report", "knowledge", "keyperson", "andet"];

export const TIMER: { id: TimerId; tekst: string; lav: number; hoej: number | null; mid: number }[] = [
  { id: "0-2", tekst: "0-2 timer", lav: 0, hoej: 2, mid: 1 },
  { id: "3-5", tekst: "3-5 timer", lav: 3, hoej: 5, mid: 4 },
  { id: "6-10", tekst: "6-10 timer", lav: 6, hoej: 10, mid: 8 },
  { id: "11-20", tekst: "11-20 timer", lav: 11, hoej: 20, mid: 15 },
  { id: "20+", tekst: "Over 20 timer", lav: 20, hoej: null, mid: 25 },
];

/** Standard-timeløn pr. svar (midten af intervallet). Kan rettes på resultatet. */
export const LOEN: { id: LoenId; tekst: string; kr: number }[] = [
  { id: "under-200", tekst: "Under 200 kr.", kr: 180 },
  { id: "200-300", tekst: "200-300 kr.", kr: 250 },
  { id: "300-450", tekst: "300-450 kr.", kr: 375 },
  { id: "450+", tekst: "Over 450 kr.", kr: 525 },
];

export const MODENHED_NIVEAUER = [
  { n: 0, navn: "Alt manuelt", tekst: "AI bruges ikke, eller kun privat." },
  { n: 1, navn: "Spredt brug", tekst: "Nogle bruger ChatGPT eller Copilot, men intet kører af sig selv." },
  { n: 2, navn: "Første modul i drift", tekst: "Én tidsrøver kører af sig selv, og en medarbejder godkender." },
  { n: 3, navn: "Flere moduler", tekst: "Flere arbejdsgange kører, systemet kender virksomheden, og ledelsen styrer." },
] as const;

export const MODENHED_SVAR: { id: ModenhedSvarId; tekst: string; niveau: 0 | 1 | 2 | 3 }[] = [
  { id: "manuelt", tekst: "Nej, det meste foregår manuelt", niveau: 0 },
  { id: "spredt", tekst: "Nogle bruger ChatGPT eller Copilot på egen hånd", niveau: 1 },
  { id: "gaaet-i-staa", tekst: "Vi har prøvet at automatisere noget, men det gik i stå", niveau: 1 },
  { id: "en-koerer", tekst: "Én opgave kører af sig selv", niveau: 2 },
  { id: "flere-koerer", tekst: "Flere opgaver kører af sig selv", niveau: 3 },
];

const NAESTE_SKRIDT: Record<number, string> = {
  0: "Næste skridt er at få én tidsrøver til at køre af sig selv, med en medarbejder der godkender.",
  1: "Næste skridt er at gå fra spredt brug til én arbejdsgang, der kører af sig selv.",
  2: "Næste skridt er den næste tidsrøver, så I får flere arbejdsgange i drift.",
  3: "Næste skridt er at holde det kørende og finde den næste tidsrøver.",
};

export type Svar = {
  branche: string;
  brancheAndet?: string;
  stoerrelse: StoerrelseId;
  rolle: string;
  processer: ProcesId[];
  procesAndet?: string;
  timer: Partial<Record<ProcesId, TimerId>>;
  timeloen: LoenId;
  modenhed: ModenhedSvarId;
};

export type Interval = { lav: number; hoej: number | null };

export type ProcesResultat = {
  id: ProcesId;
  label: string;
  timerUge: TimerId;
  timerUgeMid: number;
  /** Afrundet interval. hoej = null betyder "mindst lav". */
  timerMd: Interval;
  krAar: Interval;
};

export type Resultat = {
  top: ProcesResultat;
  processer: ProcesResultat[];
  samlet: { timerMd: Interval; krAar: Interval };
  niveau: 0 | 1 | 2 | 3;
  niveauNavn: string;
  niveauTekst: string;
  naesteSkridt: string;
  modul: { id: string; navn: string; goer: string; href: string };
  forslag: string[] | null;
  antagelser: {
    timeloenKr: number;
    timeloenErStandard: boolean;
    overhead: number;
    ugerPrAar: number;
    stoerrelse: StoerrelseId;
  };
};

export function procesLabel(id: ProcesId, procesAndet?: string): string {
  if (id === "andet") return (procesAndet ?? "").trim() || "En anden manuel opgave";
  return PROCESSER[id].label;
}

export function brancheLabel(svar: Pick<Svar, "branche" | "brancheAndet">): string {
  return svar.branche === "Andet" ? (svar.brancheAndet ?? "").trim() || "Andet" : svar.branche;
}

function nedTil(n: number, trin: number) {
  return Math.floor(n / trin) * trin;
}
function opTil(n: number, trin: number) {
  return Math.ceil(n / trin) * trin;
}
function timerTrin(n: number) {
  return n < 20 ? 1 : 5;
}
function krTrin(n: number) {
  return n < 100_000 ? 5_000 : 10_000;
}

/** Interval i timer om måneden, afrundet udad (5-timers trin over 20). */
export function timerPrMd(lavUge: number, hoejUge: number | null): Interval {
  const lav = (lavUge * UGER_PR_AAR) / 12;
  const hoej = hoejUge === null ? null : (hoejUge * UGER_PR_AAR) / 12;
  return {
    lav: nedTil(lav, timerTrin(lav)),
    hoej: hoej === null ? null : opTil(hoej, timerTrin(hoej)),
  };
}

/** Interval i kroner om året, afrundet udad (5.000 kr. under 100.000, ellers 10.000). */
export function kronerPrAar(lavUge: number, hoejUge: number | null, timeloenKr: number): Interval {
  const f = UGER_PR_AAR * timeloenKr * OVERHEAD;
  const lav = lavUge * f;
  const hoej = hoejUge === null ? null : hoejUge * f;
  return {
    lav: nedTil(lav, krTrin(lav)),
    hoej: hoej === null ? null : opTil(hoej, krTrin(hoej)),
  };
}

export function formatTal(n: number): string {
  // Fast dansk tusindtalsseparator uden Intl, så server, klient og CLI giver samme streng.
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** "ca. 25-45 timer", "op til 10 timer", "mindst 85 timer". */
export function formatInterval(iv: Interval, enhed: string): string {
  if (iv.hoej === null) return `mindst ${formatTal(iv.lav)} ${enhed}`;
  if (iv.lav <= 0) return `op til ${formatTal(iv.hoej)} ${enhed}`;
  if (iv.lav === iv.hoej) return `ca. ${formatTal(iv.lav)} ${enhed}`;
  return `ca. ${formatTal(iv.lav)}-${formatTal(iv.hoej)} ${enhed}`;
}

export function standardTimeloen(id: LoenId): number {
  return LOEN.find((l) => l.id === id)?.kr ?? 250;
}

export function beregn(svar: Svar, timeloenKr?: number): Resultat {
  const standard = standardTimeloen(svar.timeloen);
  const loen = timeloenKr && timeloenKr > 0 ? Math.round(timeloenKr) : standard;

  const rows: ProcesResultat[] = svar.processer.map((id) => {
    const t = TIMER.find((x) => x.id === svar.timer[id]) ?? TIMER[0];
    return {
      id,
      label: procesLabel(id, svar.procesAndet),
      timerUge: t.id,
      timerUgeMid: t.mid,
      timerMd: timerPrMd(t.lav, t.hoej),
      krAar: kronerPrAar(t.lav, t.hoej, loen),
    };
  });
  // Største tidsrøver = flest timer om ugen (midten af intervallet). Ved lighed
  // vinder den, brugeren valgte først (stabil sortering).
  const sorteret = [...rows].sort((a, b) => b.timerUgeMid - a.timerUgeMid);
  const top = sorteret[0];

  const lavSum = svar.processer.reduce((s, id) => s + (TIMER.find((x) => x.id === svar.timer[id])?.lav ?? 0), 0);
  const aabent = svar.processer.some((id) => svar.timer[id] === "20+");
  const hoejSum = aabent
    ? null
    : svar.processer.reduce((s, id) => s + (TIMER.find((x) => x.id === svar.timer[id])?.hoej ?? 0), 0);

  const m = MODENHED_SVAR.find((x) => x.id === svar.modenhed) ?? MODENHED_SVAR[0];
  const niv = MODENHED_NIVEAUER[m.niveau];

  const modul =
    top.id === "andet"
      ? {
          id: "diagnose",
          navn: "Diagnose (Forstå)",
          goer: "Opgaven er jeres egen, så den passer ikke ind i et standardmodul. En diagnose finder ud af, hvad der kan fjernes, og hvad det giver.",
          href: "/ydelser#trin",
        }
      : { ...MODULER[PROCESSER[top.id].modul], href: `/ydelser#${PROCESSER[top.id].modul}` };

  return {
    top,
    processer: sorteret,
    samlet: { timerMd: timerPrMd(lavSum, hoejSum), krAar: kronerPrAar(lavSum, hoejSum, loen) },
    niveau: m.niveau,
    niveauNavn: niv.navn,
    niveauTekst: niv.tekst,
    naesteSkridt: NAESTE_SKRIDT[m.niveau],
    modul,
    forslag: top.id === "andet" ? null : PROCESSER[top.id].forslag,
    antagelser: {
      timeloenKr: loen,
      timeloenErStandard: loen === standard,
      overhead: OVERHEAD,
      ugerPrAar: UGER_PR_AAR,
      stoerrelse: svar.stoerrelse,
    },
  };
}

/** Regnestykket for én proces i klartekst (bruges i detaljerne, mailen og CLI'en). */
export function regnestykke(row: ProcesResultat, timeloenKr: number): string {
  const t = TIMER.find((x) => x.id === row.timerUge)!;
  const uge = t.hoej === null ? `mindst ${t.lav}` : `${t.lav}-${t.hoej}`;
  return `${uge} timer om ugen × ${UGER_PR_AAR} uger × ${formatTal(timeloenKr)} kr. × 1,25 = ${formatInterval(row.krAar, "kr. om året")}`;
}

/** Tjek og rens svar fra klienten/CLI. Returnerer en fejltekst ved ugyldige svar. */
export function validerSvar(input: unknown): { ok: true; svar: Svar } | { ok: false; fejl: string } {
  if (!input || typeof input !== "object") return { ok: false, fejl: "Svar mangler." };
  const s = input as Record<string, unknown>;
  const str = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const branche = str(s.branche);
  if (!(BRANCHER as readonly string[]).includes(branche)) return { ok: false, fejl: "Ukendt branche." };
  const stoerrelse = str(s.stoerrelse) as StoerrelseId;
  if (!STOERRELSER.some((x) => x.id === stoerrelse)) return { ok: false, fejl: "Ukendt størrelse." };
  const rolle = str(s.rolle);
  if (!(ROLLER as readonly string[]).includes(rolle)) return { ok: false, fejl: "Ukendt rolle." };

  const raa = Array.isArray(s.processer) ? s.processer : [];
  const processer = PROCES_RAEKKEFOELGE.filter((p) => raa.includes(p));
  // Bevar brugerens rækkefølge (betyder noget ved lighed).
  const ordnet = (raa as unknown[]).filter((p): p is ProcesId => processer.includes(p as ProcesId));
  const unikke = Array.from(new Set(ordnet));
  if (unikke.length === 0 || unikke.length > MAKS_PROCESSER) {
    return { ok: false, fejl: `Vælg 1-${MAKS_PROCESSER} opgaver.` };
  }
  const timerRaa = (s.timer && typeof s.timer === "object" ? s.timer : {}) as Record<string, unknown>;
  const timer: Partial<Record<ProcesId, TimerId>> = {};
  for (const p of unikke) {
    const t = str(timerRaa[p]) as TimerId;
    if (!TIMER.some((x) => x.id === t)) return { ok: false, fejl: `Timer mangler for ${p}.` };
    timer[p] = t;
  }
  const timeloen = str(s.timeloen) as LoenId;
  if (!LOEN.some((x) => x.id === timeloen)) return { ok: false, fejl: "Ukendt timeløn." };
  const modenhed = str(s.modenhed) as ModenhedSvarId;
  if (!MODENHED_SVAR.some((x) => x.id === modenhed)) return { ok: false, fejl: "Ukendt modenhed." };

  const brancheAndet = branche === "Andet" ? str(s.brancheAndet) : undefined;
  const procesAndet = unikke.includes("andet") ? str(s.procesAndet) : undefined;
  if (branche === "Andet" && !brancheAndet) return { ok: false, fejl: "Skriv jeres branche." };
  if (unikke.includes("andet") && !procesAndet) return { ok: false, fejl: "Skriv den anden opgave." };

  return {
    ok: true,
    svar: { branche, brancheAndet, stoerrelse, rolle, processer: unikke, procesAndet, timer, timeloen, modenhed },
  };
}

/**
 * CVR-opslag (adapter). Eneste sted der kender leverandøren.
 *
 * v1: cvrapi.dk (gratis, kræver User-Agent med kontaktinfo). Fejler blødt:
 * returnerer null, og flowet falder tilbage til manuel indtastning. Skift til
 * Virk/Erhvervsstyrelsens Elasticsearch kræver kun ændringer i denne fil
 * (se DEPENDENCIES.md).
 */

export interface Virksomhed {
  cvr: string;
  navn: string;
  adresse?: string;
  postnr?: string;
  by?: string;
  startdato?: string; // ISO-dato
  ophoert: boolean;
  ansatte?: number | null;
  ansatteInterval?: string | null;
  branchekode?: number;
  branche?: string;
  selskabsform?: string;
}

/** Deterministisk forhåndstjek af de krav CVR-data kan belyse. */
export interface Forhaandstjek {
  alderAar: number | null;
  aktiv: boolean;
  smv: "ja" | "nej" | "ukendt";
  aarsvaerk: "ja" | "nej" | "ukendt";
  regnskab: "sandsynligt" | "tvivlsomt" | "ukendt";
  primaererhverv: boolean;
  bemaerkninger: string[];
}

const CVRAPI = "https://cvrapi.dk/api";
const UA = "SpAIke - tilskudstjek (spaike.dk/tilskud) - michael@spaike.dk";

export function normaliserCvr(input: string): string | null {
  const digits = (input ?? "").replace(/\D/g, "");
  return /^\d{8}$/.test(digits) ? digits : null;
}

interface CvrApiSvar {
  vat?: number;
  name?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  startdate?: string; // "28/11 - 2017"
  enddate?: string | null;
  employees?: number | string | null;
  industrycode?: number;
  industrydesc?: string;
  companydesc?: string;
  error?: string;
}

function parseDanskDato(s?: string): string | undefined {
  if (!s) return undefined;
  const m = s.match(/(\d{1,2})\/(\d{1,2})\s*-\s*(\d{4})/);
  if (!m) return undefined;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function parseAnsatte(v: number | string | null | undefined): {
  ansatte: number | null;
  interval: string | null;
} {
  if (typeof v === "number") return { ansatte: v, interval: null };
  if (typeof v === "string" && v.trim()) {
    const m = v.match(/(\d+)\s*-\s*(\d+)/);
    if (m) return { ansatte: Number(m[1]), interval: v.trim() };
    const n = Number(v.replace(/\D/g, ""));
    return Number.isFinite(n) && n > 0 ? { ansatte: n, interval: v.trim() } : { ansatte: null, interval: v.trim() };
  }
  return { ansatte: null, interval: null };
}

// Kort in-memory cache pr. serverless-instans: chat-routen genopbygger
// konteksten ved hver tur, og CVR-data ændrer sig ikke i løbet af en samtale.
const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { v: Virksomhed; exp: number }>();

export async function slaaCvrOp(cvrInput: string): Promise<Virksomhed | null> {
  const cvr = normaliserCvr(cvrInput);
  if (!cvr) return null;
  const hit = cache.get(cvr);
  if (hit && hit.exp > Date.now()) return hit.v;
  const v = await hentFraCvrApi(cvr);
  if (v) cache.set(cvr, { v, exp: Date.now() + CACHE_TTL_MS });
  return v;
}

async function hentFraCvrApi(cvr: string): Promise<Virksomhed | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${CVRAPI}?search=${cvr}&country=dk`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as CvrApiSvar;
    if (!data || data.error || !data.name) return null;
    const { ansatte, interval } = parseAnsatte(data.employees);
    return {
      cvr,
      navn: data.name,
      adresse: data.address,
      postnr: data.zipcode,
      by: data.city,
      startdato: parseDanskDato(data.startdate),
      ophoert: !!data.enddate,
      ansatte,
      ansatteInterval: interval,
      branchekode: data.industrycode,
      branche: data.industrydesc,
      selskabsform: data.companydesc,
    };
  } catch (e) {
    console.warn("CVR-opslag fejlede:", (e as Error).message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function forhaandstjek(v: Virksomhed, now: Date = new Date()): Forhaandstjek {
  const bem: string[] = [];
  let alderAar: number | null = null;
  if (v.startdato) {
    alderAar = Math.floor((now.getTime() - Date.parse(v.startdato)) / (365.25 * 24 * 3600 * 1000));
  }

  const aktiv = !v.ophoert;
  if (!aktiv) bem.push("CVR-nummeret står som ophørt.");

  let smv: Forhaandstjek["smv"] = "ukendt";
  if (typeof v.ansatte === "number") smv = v.ansatte < 250 ? "ja" : "nej";
  if (smv === "nej") bem.push("250 ansatte eller flere falder uden for EU's SMV-definition.");

  let aarsvaerk: Forhaandstjek["aarsvaerk"] = "ukendt";
  if (typeof v.ansatte === "number") aarsvaerk = v.ansatte >= 2 ? "ja" : "nej";
  if (aarsvaerk === "nej") bem.push("Kravet er mindst to årsværk på ansøgningstidspunktet.");
  if (aarsvaerk === "ukendt") bem.push("Antal ansatte er ikke oplyst i CVR; spørg om årsværk.");

  let regnskab: Forhaandstjek["regnskab"] = "ukendt";
  if (alderAar !== null) regnskab = alderAar >= 2 ? "sandsynligt" : alderAar >= 1 ? "tvivlsomt" : "tvivlsomt";
  if (regnskab === "tvivlsomt") bem.push("Virksomheden er ung; der kræves mindst ét aflagt årsregnskab.");

  // Primærerhverv (landbrug, skovbrug, fiskeri: DB07 hovedgruppe 01-03) er undtaget.
  const primaererhverv = typeof v.branchekode === "number" && v.branchekode < 40000 && v.branchekode >= 10000;
  if (primaererhverv) bem.push("Branchekoden ligger i primærerhverv, som puljen ikke dækker.");

  return { alderAar, aktiv, smv, aarsvaerk, regnskab, primaererhverv, bemaerkninger: bem };
}

/** Kort tekst til agentens kontekst. */
export function virksomhedSomTekst(v: Virksomhed, t: Forhaandstjek): string {
  const linjer = [
    `Navn: ${v.navn} (CVR ${v.cvr})`,
    v.selskabsform ? `Selskabsform: ${v.selskabsform}` : null,
    v.branche ? `Branche: ${v.branche}${v.branchekode ? ` (${v.branchekode})` : ""}` : null,
    v.by ? `By: ${v.postnr ?? ""} ${v.by}`.trim() : null,
    v.startdato ? `Startdato: ${v.startdato}${t.alderAar !== null ? ` (ca. ${t.alderAar} år)` : ""}` : null,
    `Ansatte iflg. CVR: ${v.ansatteInterval ?? (typeof v.ansatte === "number" ? String(v.ansatte) : "ikke oplyst")}`,
    `Forhåndstjek: aktiv=${t.aktiv ? "ja" : "nej"}, SMV=${t.smv}, min. 2 årsværk=${t.aarsvaerk}, årsregnskab=${t.regnskab}, primærerhverv=${t.primaererhverv ? "ja" : "nej"}`,
    t.bemaerkninger.length ? `Bemærkninger: ${t.bemaerkninger.join(" ")}` : null,
  ].filter(Boolean);
  return linjer.join("\n");
}

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
  /** Årsværk (kun fra CVR-ES); puljekravet er "mindst 2 årsværk". */
  aarsvaerk?: number | null;
  aarsvaerkInterval?: string | null;
  branchekode?: number;
  branche?: string;
  selskabsform?: string;
  /** Reklamebeskyttet i CVR: data må kun bruges til brugerens egen afklaring, aldrig outreach. */
  reklamebeskyttet?: boolean;
  kilde?: "cvr-es" | "cvrapi" | "klient";
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

import { hentVirksomhedFraEs } from "./cvr-es";

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

/**
 * Mapper cvrapi.dk's rå svar til vores Virksomhed. Bruges både server-side og
 * når klienten har slået op direkte (fallback, se nedenfor). Returnerer null
 * hvis svaret ikke matcher det forventede CVR.
 */
export function mapCvrApiSvar(data: unknown, forventetCvr: string): Virksomhed | null {
  const d = (data && typeof data === "object" ? data : {}) as CvrApiSvar;
  if (!d.name || d.error) return null;
  if (d.vat !== undefined && String(d.vat) !== forventetCvr) return null;
  const { ansatte, interval } = parseAnsatte(d.employees);
  return {
    cvr: forventetCvr,
    navn: String(d.name).slice(0, 200),
    adresse: d.address ? String(d.address).slice(0, 200) : undefined,
    postnr: d.zipcode ? String(d.zipcode).slice(0, 10) : undefined,
    by: d.city ? String(d.city).slice(0, 80) : undefined,
    startdato: parseDanskDato(d.startdate),
    ophoert: !!d.enddate,
    ansatte,
    ansatteInterval: interval,
    branchekode: typeof d.industrycode === "number" ? d.industrycode : undefined,
    branche: d.industrydesc ? String(d.industrydesc).slice(0, 200) : undefined,
    selskabsform: d.companydesc ? String(d.companydesc).slice(0, 80) : undefined,
    kilde: "cvrapi",
  };
}

// Kort in-memory cache pr. serverless-instans: chat-routen genopbygger
// konteksten ved hver tur, og CVR-data ændrer sig ikke i løbet af en samtale.
const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { v: Virksomhed; exp: number }>();

/**
 * Læg en virksomhed i cachen udefra. Baggrund (fundet i preview 2026-11-01):
 * cvrapi.dk's gratis-kvote er pr. IP, og Vercels delte egress-IP'er svarer
 * "403 QUOTA_EXCEEDED". Klienten slår derfor op direkte (CORS er åben, kvoten
 * følger den besøgendes IP) og sender resultatet med; serveren mapper det
 * gennem mapCvrApiSvar og cacher det her.
 */
export function saetCvrCache(v: Virksomhed): void {
  cache.set(v.cvr, { v, exp: Date.now() + CACHE_TTL_MS });
}

export function hentFraCvrCache(cvr: string): Virksomhed | null {
  const hit = cache.get(cvr);
  return hit && hit.exp > Date.now() ? hit.v : null;
}

/**
 * Opslag pr. CVR: cache -> CVR-ES (primær, ingen IP-kvote) -> cvrapi.dk (fallback).
 */
export async function slaaCvrOp(cvrInput: string): Promise<Virksomhed | null> {
  const cvr = normaliserCvr(cvrInput);
  if (!cvr) return null;
  const hit = cache.get(cvr);
  if (hit && hit.exp > Date.now()) return hit.v;
  const v = (await hentVirksomhedFraEs(cvr)) ?? (await hentFraCvrApi(cvr));
  if (v) cache.set(cvr, { v, exp: Date.now() + CACHE_TTL_MS });
  return v;
}

/** Seneste fejlårsag (diagnose til start-svar og logs; ingen persondata). */
export let sidsteCvrFejl: string | null = null;

async function hentFraCvrApi(cvr: string): Promise<Virksomhed | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  sidsteCvrFejl = null;
  try {
    const res = await fetch(`${CVRAPI}?search=${cvr}&country=dk`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
      cache: "no-store",
    });
    const raw = await res.text();
    if (!res.ok) {
      sidsteCvrFejl = `HTTP ${res.status}: ${raw.slice(0, 120)}`;
      console.warn("CVR-opslag fejlede:", sidsteCvrFejl);
      return null;
    }
    let data: CvrApiSvar;
    try {
      data = JSON.parse(raw) as CvrApiSvar;
    } catch {
      sidsteCvrFejl = `Ikke-JSON svar: ${raw.slice(0, 120)}`;
      console.warn("CVR-opslag fejlede:", sidsteCvrFejl);
      return null;
    }
    const v = mapCvrApiSvar(data, cvr);
    if (!v) {
      sidsteCvrFejl = `Tomt/fejl-svar: ${JSON.stringify(data).slice(0, 120)}`;
      return null;
    }
    return v;
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

  // EU-definitionen regner i årsværk; CVR-ES har ofte kun årsværk-intervallet for store selskaber.
  const stoerrelse = typeof v.aarsvaerk === "number" ? v.aarsvaerk : typeof v.ansatte === "number" ? v.ansatte : null;
  let smv: Forhaandstjek["smv"] = "ukendt";
  if (stoerrelse !== null) smv = stoerrelse < 250 ? "ja" : "nej";
  if (smv === "nej") bem.push("250 ansatte eller flere falder uden for EU's SMV-definition.");

  // Puljekravet er årsværk; CVR-ES har et årsværk-interval, ellers bruges ansatte som proxy.
  let aarsvaerk: Forhaandstjek["aarsvaerk"] = "ukendt";
  if (typeof v.aarsvaerk === "number") aarsvaerk = v.aarsvaerk >= 2 ? "ja" : "nej";
  else if (typeof v.ansatte === "number") aarsvaerk = v.ansatte >= 2 ? "ja" : "nej";
  if (aarsvaerk === "nej") bem.push("Kravet er mindst to årsværk på ansøgningstidspunktet.");
  if (aarsvaerk === "ukendt") bem.push("Antal ansatte/årsværk er ikke oplyst i CVR; spørg om årsværk.");

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
    `Ansatte iflg. CVR: ${v.ansatteInterval ?? (typeof v.ansatte === "number" ? String(v.ansatte) : "ikke oplyst")}` +
      (v.aarsvaerkInterval ? ` (årsværk: ${v.aarsvaerkInterval})` : ""),
    `Forhåndstjek: aktiv=${t.aktiv ? "ja" : "nej"}, SMV=${t.smv}, min. 2 årsværk=${t.aarsvaerk}, årsregnskab=${t.regnskab}, primærerhverv=${t.primaererhverv ? "ja" : "nej"}`,
    t.bemaerkninger.length ? `Bemærkninger: ${t.bemaerkninger.join(" ")}` : null,
  ].filter(Boolean);
  return linjer.join("\n");
}

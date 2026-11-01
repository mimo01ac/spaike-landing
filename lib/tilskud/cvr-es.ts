/**
 * CVR System-til-System (Erhvervsstyrelsens Elasticsearch, distribution.virk.dk).
 *
 * Primær CVR-kilde for /tilskud siden 2026-11-01: ingen IP-kvote (modsat
 * cvrapi.dk fra Vercel), og den kan søge på NAVN og returnere en liste, så
 * folk der ikke kan huske deres CVR-nummer kan vælge virksomheden.
 *
 * Adgang: Basic auth med env CVR_USER / CVR_PASS (samme adgang som
 * spaike-pa-outreach på VM'en; reklamebeskyttelses-erklæring underskrevet,
 * så reklamebeskyttede virksomheder må IKKE bruges til markedsføring: vi
 * markerer dem og bruger kun data til brugerens egen afklaring). Tjenesten
 * svarer kun på http (ikke https); det er Erhvervsstyrelsens opsætning.
 * Verificeret 2026-11-01: HTTP 200 fra både VM og lokal IP (ingen whitelist).
 */

import type { Virksomhed } from "./cvr";

const ES_URL = "http://distribution.virk.dk/cvr-permanent/virksomhed/_search";
const META = "Vrvirksomhed.virksomhedMetadata";
const SOURCE = [
  "Vrvirksomhed.cvrNummer",
  "Vrvirksomhed.reklamebeskyttet",
  `${META}.nyesteNavn.navn`,
  `${META}.sammensatStatus`,
  `${META}.nyesteBeliggenhedsadresse.vejnavn`,
  `${META}.nyesteBeliggenhedsadresse.husnummerFra`,
  `${META}.nyesteBeliggenhedsadresse.postnummer`,
  `${META}.nyesteBeliggenhedsadresse.postdistrikt`,
  `${META}.nyesteAntalAnsatte.intervalKodeAntalAnsatte`,
  `${META}.nyesteAarsbeskaeftigelse.intervalKodeAntalAarsvaerk`,
  `${META}.nyesteHovedbranche.branchekode`,
  `${META}.nyesteHovedbranche.branchetekst`,
  `${META}.nyesteVirksomhedsform.langBeskrivelse`,
  `${META}.stiftelsesDato`,
];

/** Status-værdier der betyder "aktiv virksomhed" i CVR. */
const AKTIVE_STATUS = ["NORMAL", "Aktiv", "AKTIV"];

export interface Soegeresultat {
  cvr: string;
  navn: string;
  postnr?: string;
  by?: string;
  selskabsform?: string;
  branche?: string;
  ansatteInterval?: string | null;
}

export function esKonfigureret(): boolean {
  return !!(process.env.CVR_USER && process.env.CVR_PASS);
}

function authHeader(): string {
  return "Basic " + Buffer.from(`${process.env.CVR_USER}:${process.env.CVR_PASS}`).toString("base64");
}

interface EsHit {
  _source: {
    Vrvirksomhed: {
      cvrNummer: number;
      reklamebeskyttet?: boolean;
      virksomhedMetadata?: {
        nyesteNavn?: { navn?: string };
        sammensatStatus?: string;
        nyesteBeliggenhedsadresse?: { vejnavn?: string; husnummerFra?: number; postnummer?: number; postdistrikt?: string };
        nyesteAntalAnsatte?: { intervalKodeAntalAnsatte?: string };
        nyesteAarsbeskaeftigelse?: { intervalKodeAntalAarsvaerk?: string };
        nyesteHovedbranche?: { branchekode?: string; branchetekst?: string };
        nyesteVirksomhedsform?: { langBeskrivelse?: string };
        stiftelsesDato?: string;
      };
    };
  };
}

async function esSearch(body: unknown, timeoutMs = 8000): Promise<EsHit[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(ES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader() },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("CVR-ES fejlede:", res.status, (await res.text()).slice(0, 120));
      return [];
    }
    const data = (await res.json()) as { hits?: { hits?: EsHit[] } };
    return data.hits?.hits ?? [];
  } catch (e) {
    console.warn("CVR-ES exception:", (e as Error).message);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/** "ANTAL_10_19" -> { interval: "10-19", lav: 10 }; "ANTAL_1000_999999" -> "1000+". */
export function parseIntervalKode(kode?: string | null): { interval: string | null; lav: number | null } {
  if (!kode) return { interval: null, lav: null };
  const m = kode.match(/ANTAL_(\d+)_(\d+)/);
  if (!m) return { interval: kode, lav: null };
  const lav = Number(m[1]);
  const hoej = Number(m[2]);
  return { interval: hoej >= 999999 ? `${lav}+` : `${lav}-${hoej}`, lav };
}

function hitTilVirksomhed(h: EsHit): Virksomhed | null {
  const v = h._source.Vrvirksomhed;
  const m = v.virksomhedMetadata ?? {};
  const navn = m.nyesteNavn?.navn;
  if (!navn || !v.cvrNummer) return null;
  const adr = m.nyesteBeliggenhedsadresse ?? {};
  const ansatte = parseIntervalKode(m.nyesteAntalAnsatte?.intervalKodeAntalAnsatte);
  const aarsvaerk = parseIntervalKode(m.nyesteAarsbeskaeftigelse?.intervalKodeAntalAarsvaerk);
  const branchekode = m.nyesteHovedbranche?.branchekode ? Number(m.nyesteHovedbranche.branchekode) : undefined;
  return {
    cvr: String(v.cvrNummer).padStart(8, "0"),
    navn,
    adresse: adr.vejnavn ? `${adr.vejnavn}${adr.husnummerFra ? ` ${adr.husnummerFra}` : ""}` : undefined,
    postnr: adr.postnummer ? String(adr.postnummer) : undefined,
    by: adr.postdistrikt,
    startdato: m.stiftelsesDato,
    ophoert: !!m.sammensatStatus && !AKTIVE_STATUS.includes(m.sammensatStatus),
    ansatte: ansatte.lav,
    ansatteInterval: ansatte.interval,
    aarsvaerk: aarsvaerk.lav,
    aarsvaerkInterval: aarsvaerk.interval,
    branchekode: Number.isFinite(branchekode) ? branchekode : undefined,
    branche: m.nyesteHovedbranche?.branchetekst,
    selskabsform: m.nyesteVirksomhedsform?.langBeskrivelse,
    reklamebeskyttet: !!v.reklamebeskyttet,
    kilde: "cvr-es",
  };
}

/** Ét CVR-nummer -> Virksomhed (null hvis ukendt eller ES ikke konfigureret/fejler). */
export async function hentVirksomhedFraEs(cvr: string): Promise<Virksomhed | null> {
  if (!esKonfigureret()) return null;
  const hits = await esSearch({
    size: 1,
    _source: SOURCE,
    query: { term: { "Vrvirksomhed.cvrNummer": Number(cvr) } },
  });
  return hits[0] ? hitTilVirksomhed(hits[0]) : null;
}

/** Navnesøgning (prefix pr. ord) blandt aktive virksomheder -> liste til at vælge fra. */
export async function soegVirksomheder(term: string, size = 8): Promise<Soegeresultat[]> {
  const q = term.trim().slice(0, 80);
  if (!esKonfigureret() || q.length < 2) return [];
  const hits = await esSearch({
    size,
    _source: SOURCE,
    query: {
      bool: {
        // max_expansions højt: "novo nord" skal kunne ramme "nordisk" selvom
        // "nord*" udvider til hundredvis af termer (default 50 gav 0 hits).
        // Binavne med: mange søger på brandet (fx "SpAIke" = binavn for Mimoco ApS).
        must: [
          {
            bool: {
              should: [
                { match_phrase_prefix: { [`${META}.nyesteNavn.navn`]: { query: q, max_expansions: 500, boost: 2 } } },
                { match_phrase_prefix: { "Vrvirksomhed.binavne.navn": { query: q, max_expansions: 500 } } },
              ],
              minimum_should_match: 1,
            },
          },
        ],
        // sammensatStatus er et analyseret tekstfelt: brug match (analyseres),
        // ikke terms (rå tokens), ellers matcher "NORMAL" aldrig tokenet "normal".
        filter: [{ match: { [`${META}.sammensatStatus`]: "NORMAL" } }],
      },
    },
  });
  return hits
    .map(hitTilVirksomhed)
    .filter((v): v is Virksomhed => !!v)
    .map((v) => ({
      cvr: v.cvr,
      navn: v.navn,
      postnr: v.postnr,
      by: v.by,
      selskabsform: v.selskabsform,
      branche: v.branche,
      ansatteInterval: v.ansatteInterval ?? null,
    }));
}

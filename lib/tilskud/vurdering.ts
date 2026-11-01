/**
 * Normalisering af vurderingen fra agentens tool-kald.
 *
 * Baggrund (fundet 2026-11-01 i CLI-testen): rammer modellen max_tokens midt
 * i tool-input'et, leverer SDK'ens tolerante parser et ufuldstændigt objekt.
 * Alt der viser, gemmer eller mailer en vurdering går derfor gennem denne
 * funktion, så manglende felter bliver tomme værdier i stedet for crashes.
 */

import type { Vurdering } from "./types";

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

export function normaliserVurdering(raw: unknown): Vurdering {
  const r = obj(raw);
  const e = obj(r.egnethed);
  const p = obj(r.pulje);
  const pr = obj(r.projekt);
  const pt = obj(r.point);
  const an = obj(r.projektgrundlag);
  const status = e.status === "groen" || e.status === "gul" || e.status === "roed" ? e.status : "gul";

  return {
    egnethed: {
      status,
      opsummering: str(e.opsummering),
      begrundelse: strArr(e.begrundelse),
      stoppere: strArr(e.stoppere),
    },
    pulje: { id: str(p.id), navn: str(p.navn), hvorfor: str(p.hvorfor) },
    projekt: {
      titel: str(pr.titel),
      formaal: str(pr.formaal),
      udgangspunkt: str(pr.udgangspunkt),
      omfang: str(pr.omfang),
      analysespoergsmaal: strArr(pr.analysespoergsmaal),
      forventet_effekt: strArr(pr.forventet_effekt),
      forankring: str(pr.forankring),
      kandidater: (Array.isArray(pr.kandidater) ? pr.kandidater : []).map((k) => {
        const o = obj(k);
        return { titel: str(o.titel), problem: str(o.problem), gevinst: str(o.gevinst), teknologi: str(o.teknologi) };
      }),
      forloeb: (Array.isArray(pr.forloeb) ? pr.forloeb : []).map((f) => {
        const o = obj(f);
        return { leverance: str(o.leverance), beskrivelse: str(o.beskrivelse) };
      }),
      estimeret_timer: num(pr.estimeret_timer),
      estimeret_pris_kr: num(pr.estimeret_pris_kr),
      tilskud_kr: num(pr.tilskud_kr),
      egenbetaling_kr: num(pr.egenbetaling_kr),
    },
    point: {
      potentiale: Math.max(0, Math.min(5, num(pt.potentiale))),
      potentiale_begrundelse: str(pt.potentiale_begrundelse),
      kapacitet: Math.max(0, Math.min(5, num(pt.kapacitet))),
      kapacitet_begrundelse: str(pt.kapacitet_begrundelse),
      samlet_indikation: str(pt.samlet_indikation),
    },
    projektgrundlag: {
      f_vaekstambition_kort: str(an.f_vaekstambition_kort),
      f_vaekstambition_lang: str(an.f_vaekstambition_lang),
      g_digitale_barrierer: str(an.g_digitale_barrierer),
      p_titel: str(an.p_titel),
      p_beskrivelse: str(an.p_beskrivelse),
      p_nyhedsvaerdi: str(an.p_nyhedsvaerdi),
      p_afkrydsning: strArr(an.p_afkrydsning),
      p_raadgiveropgaver: str(an.p_raadgiveropgaver),
      p_oekonomisk_forankring: str(an.p_oekonomisk_forankring),
      p_organisatorisk_forankring: str(an.p_organisatorisk_forankring),
      p_effekter: (Array.isArray(an.p_effekter) ? an.p_effekter : []).map((e) => {
        const o = obj(e);
        return { effekt: str(o.effekt), horisont: str(o.horisont) };
      }),
    },
    naeste_skridt: strArr(r.naeste_skridt),
  };
}

/** Sandt når de felter brugeren faktisk får værdi af, er til stede. */
export function erKomplet(v: Vurdering): boolean {
  return !!(
    v.egnethed.opsummering &&
    v.projekt.titel &&
    v.projekt.kandidater.length &&
    v.projektgrundlag.p_beskrivelse &&
    v.naeste_skridt.length
  );
}

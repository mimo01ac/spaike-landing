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
  const au = obj(r.ansoegningsudkast);
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
    ansoegningsudkast: {
      projektbeskrivelse: str(au.projektbeskrivelse),
      business_case: str(au.business_case),
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
    v.ansoegningsudkast.projektbeskrivelse &&
    v.naeste_skridt.length
  );
}

/**
 * Normalisering af vurderingen fra agentens tool-kald.
 *
 * Baggrund (fundet 2026-11-01 i CLI-testen): rammer modellen max_tokens midt
 * i tool-input'et, leverer SDK'ens tolerante parser et ufuldstændigt objekt.
 * Alt der viser, gemmer eller mailer en vurdering går derfor gennem denne
 * funktion, så manglende felter bliver tomme værdier i stedet for crashes.
 */

import type { Kvalificering, Vurdering } from "./types";

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

export function normaliserKvalificering(raw: unknown): Kvalificering {
  const r = obj(raw);
  const p = obj(r.pulje);
  const status = r.status === "groen" || r.status === "gul" || r.status === "roed" ? r.status : "gul";
  return {
    status,
    opsummering: str(r.opsummering),
    begrundelse: strArr(r.begrundelse),
    stoppere: strArr(r.stoppere),
    pulje: { id: str(p.id), navn: str(p.navn), hvorfor: str(p.hvorfor) },
    idee: str(r.idee),
    naeste: str(r.naeste),
  };
}

/**
 * Felter der mangler i en vurdering (til logning). Fundet 2026-11-01: et enkelt
 * tomt felt må ikke blokere hele resultatet, så kun de bærende felter er krav.
 */
export function manglendeFelter(v: Vurdering): string[] {
  const m: string[] = [];
  if (!v.egnethed.opsummering) m.push("egnethed.opsummering");
  if (!v.projekt.titel) m.push("projekt.titel");
  if (!v.projekt.kandidater.length) m.push("projekt.kandidater");
  if (!v.projekt.forloeb.length) m.push("projekt.forloeb");
  if (!v.projekt.omfang) m.push("projekt.omfang");
  if (!v.projekt.forventet_effekt.length) m.push("projekt.forventet_effekt");
  if (!v.projektgrundlag.p_beskrivelse) m.push("projektgrundlag.p_beskrivelse");
  if (!v.projektgrundlag.g_digitale_barrierer) m.push("projektgrundlag.g_digitale_barrierer");
  if (!v.naeste_skridt.length) m.push("naeste_skridt");
  return m;
}

/**
 * Standard-næste-skridt, hvis modellen udelader dem (set 2026-11-01). Holdes i
 * kode, så brugeren aldrig står uden en vej videre.
 */
export function standardNaesteSkridt(v: Vurdering): string[] {
  const roed = v.egnethed.status === "roed";
  const vindue = v.pulje.id === "digitalisering-2026-11" ? "9. november 2026 kl. 09.00 til 16. november kl. 23.55" : "når puljen åbner";
  if (roed) {
    return [
      "Som det ser ud nu, kan I ikke søge. Start med det, der står under 'det der skal afklares', og tjek igen før næste pulje.",
      "Projektbeskrivelsen kan I stadig bruge som grundlag for et forløb uden tilskud, eller til næste pulje.",
      "Husk, at intet arbejde må være påbegyndt før et eventuelt tilsagn, hvis I vil søge senere.",
    ];
  }
  return [
    "Opret kladden online på puljeaabning.vudk.dk nu, for systemet er åbent før vinduet. Projektbeskrivelsen er ikke tekst til ansøgningen, men grundlaget med de informationer, I skal bruge: skriv selv ansøgningen med egne ord ud fra den. I bekræfter i ansøgningen, at den er udarbejdet af jer.",
    "Udfyld [udfyld]-markørerne med jeres egne tal (omsætning, vækstmål, ansatte, kapital). Konkrete tal styrker business casen og pointene.",
    "Indhent 2 til 3 tilbud fra rådgivere i SMV:Digitals rådgiverdatabase og dokumentér, hvordan I har sammenlignet dem på pris og kvalitet. SpAIke (Michael Mortensen) er godkendt rådgiver og kan være ét af tilbuddene; valget er jeres.",
    `Vær klar, når vinduet åbner: ${vindue}. Det er pointene, der afgør, ikke hvem der kommer først.`,
    "De tre forbehold: jeres halvdel betales kontant (1:1, egne timer tæller ikke), tilskuddet kommer bagud som refusion, og intet arbejde må gå i gang før tilsagn.",
  ];
}

/** Sandt når de bærende felter er til stede (resten vises blot tomt). */
export function erKomplet(v: Vurdering): boolean {
  return !!(v.egnethed.opsummering && v.projekt.titel);
}

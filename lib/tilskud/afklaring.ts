/**
 * Tjeklisten i stemme-tilstanden (Michael 2026-11-01): det brugeren ser i
 * stedet for et transskript. Agenten afkrydser punkterne undervejs via client
 * tool'et `noter_afklaring`; CVR-kendte punkter er afkrydset fra start, så
 * agenten ved præcis hvad den mangler at spørge om.
 *
 * Ingen runtime-afhængigheder: importeres både af klienten og af agent-konfigen.
 */

import type { Forhaandstjek, Virksomhed } from "./cvr";

export type AfklaringStatus = "ok" | "nej" | "usikker";
export type Fase = "kvalificering" | "forberedelse";

export interface Afklaringspunkt {
  id: string;
  fase: Fase;
  /** Vises på skærmen. */
  label: string;
}

export const AFKLARINGSPUNKTER: Afklaringspunkt[] = [
  { id: "idee", fase: "kvalificering", label: "Hvad det skal hjælpe med" },
  { id: "smv", fase: "kvalificering", label: "SMV: ansatte og omsætning" },
  { id: "aarsvaerk", fase: "kvalificering", label: "Mindst to årsværk" },
  { id: "regnskab", fase: "kvalificering", label: "Mindst ét aflagt årsregnskab" },
  { id: "medfinansiering", fase: "kvalificering", label: "Egen halvdel kontant, lagt ud" },
  { id: "tidligere_tilskud", fase: "kvalificering", label: "Offentlige tilskud de seneste tre år" },
  { id: "ejerskab", fase: "kvalificering", label: "Ikke ejet 25 % af en stor virksomhed" },
  { id: "omraade", fase: "forberedelse", label: "Område analysen skal dække" },
  { id: "effekt", fase: "forberedelse", label: "Forventet effekt og ambition" },
  { id: "forankring", fase: "forberedelse", label: "Hvem driver projektet" },
];

export const PUNKT_IDER = AFKLARINGSPUNKTER.map((p) => p.id);

export interface Afklaring {
  status: AfklaringStatus;
  note: string;
  /** "cvr" = forudfyldt fra CVR-opslaget, "samtale" = noteret af agenten. */
  kilde: "cvr" | "samtale";
}

export type Afklaringer = Record<string, Afklaring>;

/** Punkter CVR-opslaget afgør sikkert. SMV afgøres ikke af CVR alene (omsætningen mangler). */
export function afklaretFraCvr(v: Virksomhed | null, t: Forhaandstjek | null): Afklaringer {
  const ud: Afklaringer = {};
  if (!v || !t) return ud;
  if (t.aarsvaerk !== "ukendt") {
    const tal = v.aarsvaerkInterval ? `${v.aarsvaerkInterval} årsværk` : v.ansatteInterval ? `${v.ansatteInterval} ansatte` : "";
    ud.aarsvaerk = { status: t.aarsvaerk === "ja" ? "ok" : "nej", note: tal ? `CVR: ${tal}` : "CVR", kilde: "cvr" };
  }
  if (t.regnskab === "sandsynligt") {
    ud.regnskab = { status: "ok", note: t.alderAar !== null ? `CVR: stiftet for ${t.alderAar} år siden` : "CVR", kilde: "cvr" };
  }
  return ud;
}

/** Sætning til agentens dynamiske variabel: hvad der allerede er afgjort, så den ikke spørger igen. */
export function afklaretSomTekst(a: Afklaringer): string {
  const linjer = Object.entries(a).map(([id, x]) => `${id}: ${x.status} (${x.note})`);
  return linjer.length ? linjer.join("; ") : "intet endnu";
}

/** Rensning af det agenten sender i noter_afklaring (kommer fra en LLM, så stol ikke blindt på det). */
export function normaliserNote(raw: unknown): { id: string; afklaring: Afklaring } | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = String(r.punkt ?? "").trim();
  if (!PUNKT_IDER.includes(id)) return null;
  const s = String(r.status ?? "");
  const status: AfklaringStatus = s === "ok" || s === "nej" ? s : "usikker";
  return { id, afklaring: { status, note: String(r.note ?? "").slice(0, 140), kilde: "samtale" } };
}

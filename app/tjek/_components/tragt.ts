/**
 * Tragt-måling for /tjek (SpAIke Snapshot), samme mønster som /tilskud.
 * Kun anonyme tællere, aldrig persondata.
 *
 * Events: snapshot_start → snapshot_spoergsmaal_<n> → snapshot_resultat →
 * snapshot_mail_sendt, plus snapshot_book_click og snapshot_forladt {trin, sekunder}.
 * <n> er en fast plads, så tragten kan sammenlignes på tværs af besøgende:
 * 1 branche · 2 størrelse · 3 rolle · 4 opgaver · 5-7 timer for opgave 1-3 ·
 * 8 timeløn · 9 modenhed. Vælger man én opgave, springes 6 og 7 over.
 */

import { trackEvent } from "../../components/track";

let begyndt: number | null = null;
let trin = "side";
let faerdig = false;
let lytter = false;
const sendt = new Set<string>();

export function sekunder(): number {
  return begyndt ? Math.round((Date.now() - begyndt) / 1000) : 0;
}

function lyt() {
  if (lytter || typeof window === "undefined") return;
  lytter = true;
  window.addEventListener("pagehide", () => {
    if (begyndt !== null && !faerdig) trackEvent("snapshot_forladt", { trin, sekunder: sekunder() });
  });
}

export function start() {
  if (begyndt !== null) return;
  begyndt = Date.now();
  trin = "start";
  lyt();
  trackEvent("snapshot_start");
}

/** Spørgsmål på plads n er besvaret (sendes kun første gang). */
export function besvaret(n: number) {
  trin = `spoergsmaal_${n}`;
  const navn = `snapshot_spoergsmaal_${n}`;
  if (sendt.has(navn)) return;
  sendt.add(navn);
  trackEvent(navn, { sekunder: sekunder() });
}

export function resultat(data: { niveau: number; top: string }) {
  trin = "resultat";
  if (sendt.has("resultat")) return;
  sendt.add("resultat");
  trackEvent("snapshot_resultat", { sekunder: sekunder(), niveau: data.niveau, top: data.top });
}

export function mailSendt() {
  trin = "mail";
  faerdig = true;
  trackEvent("snapshot_mail_sendt", { sekunder: sekunder() });
}

export function bookKlik(placering: string) {
  trackEvent("snapshot_book_click", { placering, sekunder: sekunder() });
}

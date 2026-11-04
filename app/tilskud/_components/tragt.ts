/**
 * Tragt-måling for /tilskud: hvilket trin den besøgende er nået til, og hvor
 * lang tid der er gået siden de begyndte på formularen. Forlader de siden
 * midt i flowet, sendes `tilskud_forladt` med trin og sekunder (best effort
 * via pagehide). Kun anonyme tællere, aldrig persondata.
 */

import { trackEvent } from "../../components/track";

export type Trin =
  | "side"
  | "formular"
  | "start"
  | "kanal"
  | "samtale"
  | "kvalificering"
  | "forberedelse"
  | "vurdering"
  | "faerdig";

const RAEKKEFOELGE: Trin[] = ["side", "formular", "start", "kanal", "samtale", "kvalificering", "forberedelse", "vurdering", "faerdig"];

let trin: Trin = "side";
let begyndt: number | null = null;
let lytter = false;

/** Sekunder siden formularen blev påbegyndt (0 hvis ikke begyndt). */
export function sekunder(): number {
  return begyndt ? Math.round((Date.now() - begyndt) / 1000) : 0;
}

/** Ryk tragten frem (aldrig tilbage) og installér forlad-lytteren første gang. */
export function naaetTrin(nyt: Trin) {
  if (RAEKKEFOELGE.indexOf(nyt) <= RAEKKEFOELGE.indexOf(trin)) return;
  trin = nyt;
  if (begyndt === null) begyndt = Date.now();
  // Fælles trin for chat og stemme, så tragten har ét skridt for "samtalen er i gang".
  if (nyt === "samtale") trackEvent("tilskud_samtale_begyndt", { sekunder: sekunder() });
  if (!lytter && typeof window !== "undefined") {
    lytter = true;
    window.addEventListener("pagehide", () => {
      if (trin !== "side" && trin !== "faerdig") trackEvent("tilskud_forladt", { trin, sekunder: sekunder() });
    });
  }
}

/** Første interaktion med formularen. */
export function formularBegyndt() {
  if (trin !== "side") return;
  naaetTrin("formular");
  trackEvent("tilskud_formular_begyndt");
}

/**
 * Delte typer for /tilskud (server + klient). Ingen runtime-afhængigheder,
 * så filen kan importeres fra klient-komponenter.
 */

import type { Forhaandstjek, Virksomhed } from "./cvr";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type Egnethed = "groen" | "gul" | "roed";

/** Fase 1: hurtig kvalificering. Brugeren vælger derefter om de vil videre til forberedelsen. */
export interface Kvalificering {
  status: Egnethed;
  opsummering: string;
  begrundelse: string[];
  stoppere: string[];
  pulje: { id: string; navn: string; hvorfor: string };
  /** Den overordnede idé/smerte som brugeren selv formulerede den. */
  idee: string;
  /** Hvad fase 2 vil afklare, i én sætning (vises som "sådan fortsætter vi"). */
  naeste: string;
}

export interface Vurdering {
  egnethed: {
    status: Egnethed;
    opsummering: string;
    begrundelse: string[];
    stoppere: string[];
  };
  pulje: {
    id: string;
    navn: string;
    hvorfor: string;
  };
  projekt: {
    titel: string;
    formaal: string;
    /** Den konkrete smerte brugeren selv nævnte; ankeret for hele projektet. */
    udgangspunkt: string;
    /** Hvilket flow/område analysen dækker (fra hvor til hvor, systemer, afdelinger). */
    omfang: string;
    /** De spørgsmål analysen skal svare på. */
    analysespoergsmaal: string[];
    /** Forventede effekter i ansøgningens sprog (business case). */
    forventet_effekt: string[];
    /** Hvem driver projektet internt + digital erfaring (kapacitets-kriteriet). */
    forankring: string;
    /** Hypoteser analysen tester (ikke besluttede løsninger). */
    kandidater: {
      titel: string;
      problem: string;
      gevinst: string;
      teknologi: string;
    }[];
    forloeb: { leverance: string; beskrivelse: string }[];
    estimeret_timer: number;
    estimeret_pris_kr: number;
    tilskud_kr: number;
    egenbetaling_kr: number;
  };
  point: {
    potentiale: number;
    potentiale_begrundelse: string;
    kapacitet: number;
    kapacitet_begrundelse: string;
    samlet_indikation: string;
  };
  /**
   * Projektbeskrivelse som grundlag for virksomhedens EGEN ansøgning,
   * struktureret efter SMV:Digitals skabelon (nøgler = skabelonens afsnit).
   * Ansøgeren bekræfter selv at have udarbejdet ansøgningen, og en rådgiver
   * må ikke skrive den; derfor neutral tredje person + [udfyld]-markører.
   */
  projektgrundlag: {
    f_vaekstambition_kort: string;
    f_vaekstambition_lang: string;
    g_digitale_barrierer: string;
    p_titel: string;
    p_beskrivelse: string;
    p_nyhedsvaerdi: string;
    p_afkrydsning: string[];
    p_raadgiveropgaver: string;
    p_oekonomisk_forankring: string;
    p_organisatorisk_forankring: string;
    p_effekter: { effekt: string; horisont: string }[];
  };
  naeste_skridt: string[];
}

export interface StartSvar {
  token: string;
  virksomhed: Virksomhed | null;
  forhaandstjek: Forhaandstjek | null;
  pulje: { id: string; navn: string; aabner: string; lukker?: string; maksTilskudKr: number } | null;
  /** Kun sat når et CVR blev indtastet og opslaget fejlede (teknisk årsag, ingen persondata). */
  cvrFejl?: string;
}

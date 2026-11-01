/**
 * Delte typer for /tilskud (server + klient). Ingen runtime-afhængigheder,
 * så filen kan importeres fra klient-komponenter.
 */

import type { Forhaandstjek, Virksomhed } from "./cvr";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type Egnethed = "groen" | "gul" | "roed";

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
  ansoegningsudkast: {
    projektbeskrivelse: string;
    business_case: string;
  };
  naeste_skridt: string[];
}

export interface StartSvar {
  token: string;
  virksomhed: Virksomhed | null;
  forhaandstjek: Forhaandstjek | null;
  pulje: { id: string; navn: string; aabner: string; lukker?: string; maksTilskudKr: number } | null;
}

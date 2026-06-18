/** Delte typer for discovery-toolet (klient + server). */

export interface FitScore {
  kritisk_masse: number;
  konkret: number;
  dag_scope: number;
  vibe_code: number;
  ejer: number;
  data: number;
}

export interface CaseItem {
  titel: string;
  problemformulering: string;
  hvem_paavirkes: string;
  succeskriterie: string;
  mvp_scope: string;
  data_kontekst_behov: string;
  data_skitse: string;
  vej_til_drift: string;
  anbefalet_team: string;
  fit_score: FitScore;
  fit_kommentar: string;
}

export interface CaseBriefData {
  virksomhed: string;
  stoerrelse: string;
  deltagere_forslag: string[];
  parathed: {
    kritisk_masse: boolean;
    ejer_bagefter: boolean;
    tool_api_adgang: boolean;
  };
  cases: CaseItem[];
  samlet_anbefaling: string;
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export interface GateInfo {
  name: string;
  email: string;
  company: string;
  token: string;
  recordId: string | null;
}

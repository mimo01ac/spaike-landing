/** Delte typer for discovery-toolet (klient + server). */

export interface CaseItem {
  titel: string;
  problem: string;
  hvorfor_godt_fit: string;
  mulig_loesning: string;
}

export interface CaseBriefData {
  virksomhed: string;
  deltagere_forslag?: string[];
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

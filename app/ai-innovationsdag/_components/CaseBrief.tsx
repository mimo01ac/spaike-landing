"use client";

import type { CaseBriefData, CaseItem, FitScore } from "../_types";

const FIT_LABELS: Record<keyof FitScore, string> = {
  kritisk_masse: "Kritisk masse",
  konkret: "Konkret",
  dag_scope: "Dag-scope",
  vibe_code: "Vibe-code",
  ejer: "Ejer",
  data: "Data",
};

const PARATHED_LABELS: Record<string, string> = {
  kritisk_masse: "Kan samle 3-5 personer",
  ejer_bagefter: "Ejer løsningen bagefter",
  tool_api_adgang: "Vil give tool-/API-adgang",
};

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] tracking-wider uppercase text-muted w-24 shrink-0">
        {label}
      </span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-5 rounded-sm ${i < score ? "bg-amber-dark" : "bg-rule"}`}
          />
        ))}
      </span>
    </div>
  );
}

function CaseBlock({ c, index }: { c: CaseItem; index: number }) {
  return (
    <div className="border border-rule rounded bg-cream p-5 md:p-6">
      <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-1.5">
        Case {index + 1}
      </p>
      <h4 className="font-serif text-xl text-ink leading-snug mb-3">{c.titel}</h4>

      <Field label="Problem (SMART)">{c.problemformulering}</Field>
      <Field label="Hvem påvirkes">{c.hvem_paavirkes}</Field>
      <Field label="Succeskriterie">{c.succeskriterie}</Field>
      <Field label="MVP på dagen">{c.mvp_scope}</Field>
      <Field label="Data / kontekst">{c.data_kontekst_behov}</Field>
      <Field label="Data-skitse (til syntetisk data)">{c.data_skitse}</Field>
      <Field label="Vej til drift">{c.vej_til_drift}</Field>
      <Field label="Anbefalet team">{c.anbefalet_team}</Field>

      <div className="mt-4 pt-4 border-t border-rule">
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-2.5">
          Fit-vurdering
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {(Object.keys(FIT_LABELS) as (keyof FitScore)[]).map((k) => (
            <ScoreRow key={k} label={FIT_LABELS[k]} score={c.fit_score?.[k] ?? 0} />
          ))}
        </div>
        {c.fit_kommentar && (
          <p className="text-[13px] text-ink-soft leading-relaxed mt-3 italic">
            {c.fit_kommentar}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <span className="font-mono text-[10px] tracking-wider uppercase text-muted">{label}: </span>
      <span className="text-[14px] text-ink leading-relaxed">{children}</span>
    </div>
  );
}

export default function CaseBrief({ brief }: { brief: CaseBriefData }) {
  return (
    <div className="brief-print max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-1.5">
            Case-brief · AI-innovationsdag
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-ink leading-tight">
            {brief.virksomhed}
          </h3>
          {brief.stoerrelse && (
            <p className="text-ink-soft text-[14px] mt-1">{brief.stoerrelse}</p>
          )}
        </div>
        <button
          onClick={() => window.print()}
          className="no-print shrink-0 border border-rule rounded px-4 py-2 font-mono text-[11px] tracking-wider uppercase text-ink hover:border-amber-dark hover:text-amber-dark transition-colors"
        >
          Download / print
        </button>
      </div>

      {brief.deltagere_forslag?.length > 0 && (
        <div className="mb-5">
          <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
            Forslag til deltagere:{" "}
          </span>
          <span className="text-[14px] text-ink">{brief.deltagere_forslag.join(", ")}</span>
        </div>
      )}

      <div className="mb-7 flex flex-wrap gap-2">
        {Object.entries(brief.parathed ?? {}).map(([k, v]) => (
          <span
            key={k}
            className={`font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border ${
              v ? "border-amber-dark text-amber-dark" : "border-rule text-muted"
            }`}
          >
            {v ? "✓" : "○"} {PARATHED_LABELS[k] ?? k}
          </span>
        ))}
      </div>

      <div className="space-y-5">
        {brief.cases?.map((c, i) => (
          <CaseBlock key={i} c={c} index={i} />
        ))}
      </div>

      {brief.samlet_anbefaling && (
        <div className="mt-7 border-l-2 border-amber-dark pl-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-1.5">
            Min anbefaling
          </p>
          <p className="font-serif text-[16px] text-ink leading-relaxed italic">
            {brief.samlet_anbefaling}
          </p>
        </div>
      )}
    </div>
  );
}

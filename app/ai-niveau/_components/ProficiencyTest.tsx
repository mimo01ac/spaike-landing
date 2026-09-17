"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trackEvent } from "../../components/track";
import {
  QUESTIONS,
  MAX_SCORE,
  ENV_LABEL,
  scoreAnswers,
  type EnvKey,
  type ScoreResult,
} from "../_data/proficiency";

const ENV_OPTIONS: { value: EnvKey; label: string }[] = [
  { value: "copilot", label: "Låst til Microsoft Copilot" },
  { value: "aaben", label: "Fri stak (ChatGPT/Claude/Zapier/n8n ...)" },
  { value: "begge", label: "Begge / ved ikke" },
];

const ENV_PILL: Record<string, string> = {
  begge: "Begge",
  copilot: "Copilot",
  aaben: "Åben stak",
};

/** ASCII-saner til jsPDF's standard-font (mangler æ/ø/å og →). */
function san(s: string): string {
  return String(s)
    .replace(/→/g, "til")
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .replace(/Æ/g, "Ae").replace(/Ø/g, "Oe").replace(/Å/g, "Aa")
    .replace(/é/g, "e").replace(/[“”"]/g, "");
}

export default function ProficiencyTest() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(QUESTIONS.length).fill(null),
  );
  const [env, setEnv] = useState<EnvKey | "">("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  // Trin 2 (interview)
  const [ivOpen, setIvOpen] = useState(false);
  const [iv, setIv] = useState({ role: "", tasks: "", aiToday: "", case: "" });
  const [planBusy, setPlanBusy] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  // Email opt-in
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [optinState, setOptinState] = useState<"idle" | "sent" | "error">("idle");

  function pick(qi: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = value;
      return next;
    });
  }

  function submit() {
    const missing = answers.findIndex((a) => a === null);
    if (missing !== -1) {
      setError("Svar venligst på alle 12 spørgsmål.");
      document.getElementById(`q-${missing}`)?.scrollIntoView({ block: "center" });
      return;
    }
    if (!env) {
      setError("Vælg hvad du har adgang til på arbejdet.");
      document.getElementById("env-select")?.scrollIntoView({ block: "center" });
      return;
    }
    setError(null);
    const res = scoreAnswers(answers as number[], env);
    setResult(res);
    trackEvent("ai_niveau_resultat", { niveau: res.levelNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setEnv("");
    setGoal("");
    setResult(null);
    setIvOpen(false);
    setIv({ role: "", tasks: "", aiToday: "", case: "" });
    setPlan(null);
    setPlanError(null);
    setEmail("");
    setConsent(false);
    setOptinState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadPdf() {
    if (!result) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFillColor(15, 26, 46);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(212, 168, 87);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SPAIKE", 18, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AI Proficiency Snapshot", 18, 33);
    doc.setTextColor(184, 143, 63);
    doc.setFontSize(12);
    doc.text("NIVEAU " + result.levelNo + " AF 4", 18, 62);
    doc.setTextColor(15, 26, 46);
    doc.setFontSize(24);
    doc.text(san(result.level.name), 18, 73);
    doc.setTextColor(107, 102, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(san(result.level.snap), 174), 18, 83);
    doc.setTextColor(15, 26, 46);
    doc.setFontSize(11);
    doc.text("Score " + result.total + " af " + MAX_SCORE, 18, 101);
    doc.setFillColor(216, 211, 199);
    doc.roundedRect(18, 105, 174, 5, 2, 2, "F");
    doc.setFillColor(212, 168, 87);
    doc.roundedRect(18, 105, Math.max(4, (174 * result.total) / MAX_SCORE), 5, 2, 2, "F");
    doc.setTextColor(184, 143, 63);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Svageste omraade: " + san(result.weakName), 18, 123);
    doc.setTextColor(15, 26, 46);
    doc.setFontSize(14);
    doc.text("Mine naeste skridt", 18, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    let y = 149;
    result.blocks.slice(0, 4).forEach((b) => {
      doc.text("-  " + san(b.n), 20, y);
      y += 8;
    });
    doc.setDrawColor(216, 211, 199);
    doc.line(18, 272, 192, 272);
    doc.setTextColor(107, 102, 80);
    doc.setFontSize(10);
    doc.text("spaike.dk  -  Commercial impact, powered by AI", 18, 280);
    doc.save("AI-Proficiency-Snapshot.pdf");
    trackEvent("ai_niveau_pdf");
  }

  async function buildPlan() {
    if (!result || planBusy) return;
    setPlanBusy(true);
    setPlanError(null);
    setPlan(null);
    trackEvent("ai_niveau_plan_bygget", { niveau: result.levelNo });
    try {
      const res = await fetch("/api/ai-niveau/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: result.levelNo,
          levelName: result.level.name,
          env,
          weak: result.weakName,
          role: iv.role,
          tasks: iv.tasks,
          aiToday: iv.aiToday,
          case: iv.case,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.plan) {
        setPlanError(data.error ?? "Kunne ikke bygge planen. Prøv igen.");
      } else {
        setPlan(data.plan);
      }
    } catch {
      setPlanError("Kunne ikke oprette forbindelse. Prøv igen.");
    }
    setPlanBusy(false);
  }

  async function submitOptin() {
    if (!result) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setOptinState("error");
      return;
    }
    if (!consent) {
      setOptinState("error");
      return;
    }
    try {
      const res = await fetch("/api/ai-niveau/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent,
          level: result.levelNo,
          levelName: result.level.name,
          weak: result.weakName,
          env,
        }),
      });
      if (res.ok) {
        setOptinState("sent");
        trackEvent("ai_niveau_optin");
      } else {
        setOptinState("error");
      }
    } catch {
      setOptinState("error");
    }
  }

  // ---- Resultat-visning ----
  if (result) {
    const envtxt = env ? ENV_LABEL[env] : "dit miljø";
    return (
      <div className="max-w-2xl">
        <div className="bg-ink text-cream rounded-lg p-6 md:p-8">
          <p className="font-mono text-[11px] tracking-wider uppercase text-amber">
            Niveau {result.levelNo} af 4
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mt-1">{result.level.name}</h2>
          <p className="font-sans text-[14px] text-cream/70 mt-2">{result.level.snap}</p>
          <div className="h-2 bg-rule-dark rounded mt-5 overflow-hidden">
            <div
              className="h-full bg-amber"
              style={{ width: Math.round((result.total / MAX_SCORE) * 100) + "%" }}
            />
          </div>
          <p className="font-sans text-[13px] text-cream/60 mt-1.5">
            Score {result.total} af {MAX_SCORE}
          </p>
        </div>

        <div className="border border-amber-dark/40 bg-amber-soft/15 rounded-lg px-4 py-3.5 mt-4 text-[14.5px] text-ink">
          <b>Dit svageste område:</b> {result.weakName}. Det er der du får mest ud af at
          sætte ind først.
        </div>

        {goal.trim() && (
          <p className="font-sans text-[13.5px] text-muted mt-3">
            <b>Du skrev:</b> &laquo;{goal.trim()}&raquo; — planen herunder tager
            udgangspunkt i netop det.
          </p>
        )}

        <button
          onClick={downloadPdf}
          className="mt-4 bg-ink text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors rounded"
        >
          Download dit snapshot (PDF)
        </button>

        <h3 className="font-serif text-2xl mt-8">Din plan: kom et trin op</h3>
        <p className="font-sans text-[13.5px] text-muted mt-1">
          Tilpasset {envtxt}. Tag én ad gangen, start med den der rammer dit svageste
          område. Prøv gerne hvert eksempel på noget du selv sidder med.
        </p>

        <div className="mt-4 space-y-4">
          {result.blocks.map((b) => (
            <div key={b.n} className="border border-rule rounded-lg p-4 md:p-5 bg-white/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-lg font-medium">{b.n}</span>
                <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-cream-deep text-muted">
                  {ENV_PILL[b.env]}
                </span>
              </div>
              <p className="font-sans text-[13.5px] text-muted mt-1">{b.job}</p>
              <p className="font-mono text-[10px] tracking-wider uppercase text-ink mt-3">
                Sådan gør du
              </p>
              <ol className="list-decimal pl-5 mt-1 space-y-1 text-[14.5px]">
                {b.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <div className="bg-cream-deep border border-rule rounded px-3 py-2.5 mt-3 text-[14px]">
                <b className="text-ink">Eksempel at prøve:</b> {b.ex}
              </div>
              <p className="text-[14px] mt-2.5">
                <b className="text-ink">Team-løft:</b> {b.team}
              </p>
            </div>
          ))}
        </div>

        {/* Trin 2: skræddersyet plan */}
        <div className="bg-ink text-cream rounded-lg p-5 md:p-6 mt-6">
          <p className="font-serif text-xl">Vil du have en plan på præcis DIN hverdag?</p>
          <p className="font-sans text-[14px] text-cream/70 mt-2">
            Det her er den generelle vej. Svar på fire hurtige spørgsmål, så bygger AI&apos;en
            en helt skræddersyet plan på dine egne cases, dine systemer og det du har adgang
            til, ikke et generelt eksempel.
          </p>

          {!ivOpen && !plan && (
            <button
              onClick={() => {
                setIvOpen(true);
                trackEvent("ai_niveau_interview_klik");
              }}
              className="mt-4 bg-amber text-ink px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-amber-dark transition-colors rounded"
            >
              Start AI-interviewet
            </button>
          )}

          {ivOpen && (
            <div className="mt-4 space-y-2.5">
              {(
                [
                  ["role", "Hvad arbejder du med? (rolle / branche)"],
                  ["tasks", "Dine tungeste eller mest gentagne opgaver?"],
                  ["aiToday", "Hvordan bruger du AI på det i dag?"],
                  ["case", "Beskriv én konkret opgave der æder din tid"],
                ] as const
              ).map(([key, ph]) => (
                <textarea
                  key={key}
                  value={iv[key]}
                  onChange={(e) => setIv((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={ph}
                  rows={2}
                  className="w-full rounded px-3 py-2.5 text-ink text-[14px] border-0 resize-y"
                />
              ))}
              <button
                onClick={buildPlan}
                disabled={planBusy}
                className="bg-amber text-ink px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-amber-dark transition-colors rounded disabled:opacity-60"
              >
                {planBusy ? "Bygger din plan … (ca. 10 sek.)" : "Byg min skræddersyede plan"}
              </button>
              {planError && <p className="text-amber-soft text-[13px]">{planError}</p>}
            </div>
          )}

          {plan && (
            <div className="bg-cream text-ink rounded-lg px-4 py-4 md:px-5 mt-4 text-[14.5px] markdown-plan">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h4 className="font-serif text-lg mt-3 mb-1">{children}</h4>,
                  h2: ({ children }) => <h4 className="font-serif text-lg mt-3 mb-1">{children}</h4>,
                  h3: ({ children }) => <h4 className="font-serif text-base mt-3 mb-1">{children}</h4>,
                  h4: ({ children }) => <h5 className="font-serif text-base mt-3 mb-1">{children}</h5>,
                  ul: ({ children }) => <ul className="list-disc pl-5 my-1.5 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 my-1.5 space-y-1">{children}</ol>,
                  p: ({ children }) => <p className="my-2">{children}</p>,
                }}
              >
                {plan}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Blød email-opt-in */}
        <div className="border border-rule bg-cream-deep/40 rounded-lg px-4 py-4 mt-5">
          {optinState === "sent" ? (
            <p className="font-sans text-[14px] text-ink">
              Tak. Jeg sender dig lidt mere på {email.trim()}.
            </p>
          ) : (
            <>
              <p className="font-serif text-lg">
                Vil du have hele guiden + et par konkrete tips ind imellem?
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@mail.dk"
                className="w-full bg-cream border border-rule rounded px-3 py-2.5 text-ink text-[14px] mt-2 focus:border-amber-dark focus:outline-none"
              />
              <label className="flex items-start gap-2 mt-2 text-[12.5px] text-muted">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-amber-dark"
                />
                <span>
                  Jeg accepterer at SpAIke må sende mig guiden og et par tips på e-mail.
                  Helt valgfrit, du har allerede din plan ovenfor.
                </span>
              </label>
              {optinState === "error" && (
                <p className="text-red-700 text-[13px] mt-1.5">
                  Skriv en gyldig e-mail og accepter behandlingen.
                </p>
              )}
              <button
                onClick={submitOptin}
                className="mt-3 bg-ink text-cream px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors rounded"
              >
                Send mig mere
              </button>
            </>
          )}
        </div>

        <div className="border border-amber-dark/40 bg-amber-soft/15 rounded-lg px-4 py-3.5 mt-4 font-sans text-[14px] text-ink">
          Vil du have det bygget rigtigt for dig eller dit team? Så tager jeg gerne en snak.
          Michael, SpAIke.
        </div>

        <button
          onClick={restart}
          className="mt-5 border border-rule text-ink px-5 py-2.5 font-sans text-[13px] rounded hover:bg-cream-deep/50 transition-colors"
        >
          Tag testen igen
        </button>
      </div>
    );
  }

  // ---- Test-visning ----
  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        {QUESTIONS.map((q, qi) => (
          <div
            key={qi}
            id={`q-${qi}`}
            className="border border-rule rounded-lg p-4 md:p-5 bg-white/50"
          >
            <p className="font-mono text-[10px] tracking-wider uppercase text-amber-dark">
              Spørgsmål {qi + 1} af {QUESTIONS.length}
            </p>
            <p className="font-serif text-lg font-medium mt-1 mb-2.5">{q.t}</p>
            <div className="space-y-1.5">
              {q.o.map((opt, oi) => {
                const value = oi + 1;
                const selected = answers[qi] === value;
                return (
                  <label
                    key={oi}
                    className={`flex items-start gap-2.5 px-3 py-2.5 rounded border cursor-pointer text-[14.5px] transition-colors ${
                      selected
                        ? "border-amber-dark bg-amber-soft/25"
                        : "border-rule hover:bg-cream-deep/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${qi}`}
                      checked={selected}
                      onChange={() => pick(qi, value)}
                      className="mt-0.5 accent-amber-dark"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-rule rounded-lg p-4 md:p-5 bg-white/50 mt-4">
        <label htmlFor="env-select" className="font-serif text-lg font-medium block mb-2">
          Hvad har du adgang til på arbejdet?
        </label>
        <select
          id="env-select"
          value={env}
          onChange={(e) => setEnv(e.target.value as EnvKey)}
          className="w-full bg-cream border border-rule rounded px-3 py-2.5 text-ink text-[14.5px] focus:border-amber-dark focus:outline-none"
        >
          <option value="">Vælg ...</option>
          {ENV_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-rule rounded-lg p-4 md:p-5 bg-white/50 mt-4">
        <label htmlFor="goal" className="font-serif text-lg font-medium block mb-2">
          Hvad vil du gerne opnå, eller hvor sidder du fast? (valgfrit)
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
          placeholder="Fx: jeg bruger for lang tid på at samle data og skrive rapporter ..."
          className="w-full bg-cream border border-rule rounded px-3 py-2.5 text-ink text-[14.5px] focus:border-amber-dark focus:outline-none resize-y"
        />
      </div>

      <button
        onClick={submit}
        data-track-event="ai_niveau_se_resultat_klik"
        className="mt-5 w-full bg-ink text-cream px-7 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors rounded"
      >
        Se mit resultat →
      </button>
      {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
    </div>
  );
}

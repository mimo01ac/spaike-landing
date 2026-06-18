"use client";

import { useState } from "react";
import type { CaseBriefData, ChatMsg } from "../_types";

interface Props {
  token: string;
  brief: CaseBriefData;
  transcript: ChatMsg[];
  onDone: (wantHelp: boolean) => void;
}

export default function EndStep({ token, brief, transcript, onDone }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(brief.virksomhed || "");
  const [wantHelp, setWantHelp] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Du skal acceptere behandlingen af dine oplysninger.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/innovationsdag/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name,
          email,
          company,
          consent,
          want_help: wantHelp,
          case_brief: brief,
          transcript,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setBusy(false);
        return;
      }
      window.umami?.track(wantHelp ? "innovationsdag_lead_help" : "innovationsdag_lead_guide");
      onDone(wantHelp);
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          required
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Navn"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
        <input
          type="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
      </div>
      <input
        type="text"
        maxLength={120}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Virksomhed (valgfrit)"
        className="w-full bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
      />

      <label className="flex items-start gap-3 text-[14px] text-ink leading-relaxed">
        <input
          type="checkbox"
          checked={wantHelp}
          onChange={(e) => setWantHelp(e.target.checked)}
          className="mt-1 accent-amber-dark"
        />
        <span>
          Jeg vil gerne høre om hjælp til at køre en innovationsdag (jeg søger 1-2
          pilotvirksomheder, gratis).
        </span>
      </label>

      <label className="flex items-start gap-3 text-[13px] text-ink-soft leading-relaxed">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-amber-dark"
        />
        <span>
          Jeg accepterer, at SpAIke gemmer mine oplysninger, samtalen og case-briefen for at sende
          mig materialet og hjælpe mig videre. Se{" "}
          <a href="#privatliv" className="text-amber-dark underline">
            privatlivsnoten
          </a>
          .
        </span>
      </label>

      {error && <p className="text-[13px] text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="bg-ink text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors disabled:opacity-60"
      >
        {busy ? "Sender …" : "Send mig brief + guide →"}
      </button>
    </form>
  );
}

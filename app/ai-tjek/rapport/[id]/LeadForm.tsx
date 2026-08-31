"use client";

import { useState } from "react";

export default function LeadForm({ scanId }: { scanId: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/ai-tjek/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId, email, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="font-serif text-lg text-ink">
        Tak! Jeg kører panelet og sender din rapport pr. mail inden for 1-2 hverdage.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          placeholder="din@arbejdsmail.dk"
          className="flex-1 bg-cream border border-rule rounded px-4 py-3 text-ink focus:border-amber-dark focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !consent}
          data-track-event="ai_tjek_panel_lead"
          className="bg-amber text-ink px-6 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber-dark hover:text-cream transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? "Sender …" : "Få det fulde panel →"}
        </button>
      </div>
      <label className="flex items-start gap-2.5 text-[13px] text-ink-soft leading-relaxed">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-amber-dark"
        />
        <span>
          Jeg accepterer, at SpAIke gemmer min e-mail og dette scan-resultat for at sende mig
          panel-rapporten og følge op på den.
        </span>
      </label>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </form>
  );
}

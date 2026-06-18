"use client";

import { useState } from "react";
import type { CaseBriefData, GateInfo } from "../_types";

interface Props {
  gate: GateInfo;
  brief: CaseBriefData;
  onSubmitted: () => void;
}

export default function ApplicationForm({ gate, brief, onSubmitted }: Props) {
  const [name, setName] = useState(gate.name);
  const [email, setEmail] = useState(gate.email);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(gate.company || brief.virksomhed || "");
  const [notes, setNotes] = useState("");
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
      const res = await fetch("/api/innovationsdag/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: gate.token,
          recordId: gate.recordId,
          name,
          email,
          phone,
          company,
          notes,
          consent,
          case_brief: brief,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kunne ikke sende. Prøv igen.");
        setBusy(false);
        return;
      }
      onSubmitted();
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-[13px] text-ink-soft leading-relaxed">
        Din case-brief vedhæftes automatisk, så jeg kender jeres problem inden vi taler sammen.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Navn"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon (valgfrit)"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Virksomhed"
          className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Andet jeg bør vide? (valgfrit)"
        rows={3}
        className="w-full bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
      />
      <label className="flex items-start gap-3 text-[13px] text-ink-soft leading-relaxed">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-amber-dark"
        />
        <span>
          Jeg accepterer, at SpAIke gemmer mine oplysninger og case-briefen for at behandle min
          ansøgning.
        </span>
      </label>
      {error && <p className="text-[13px] text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="bg-ink text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors disabled:opacity-60"
      >
        {busy ? "Sender …" : "Send ansøgning →"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";

export default function TjekForm() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !url.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/ai-tjek/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setBusy(false);
        return;
      }
      // Fuld navigation (ikke klient-router): rapporten er server-renderet med
      // egen metadata, og en frisk dokument-hentning er mest robust.
      window.location.assign(`/ai-tjek/rapport/${data.id}`);
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="text"
        inputMode="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={busy}
        placeholder="jeres-domæne.dk"
        aria-label="Jeres website-adresse"
        className="flex-1 bg-cream border border-rule rounded px-4 py-3.5 text-ink text-base focus:border-amber-dark focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={busy || !url.trim()}
        data-track-event="ai_tjek_scan_klik"
        className="bg-ink text-cream px-7 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {busy ? "Tjekker … (5-10 sek.)" : "Tjek mit site →"}
      </button>
      {error && <p className="text-red-700 text-sm sm:col-span-2 self-center">{error}</p>}
    </form>
  );
}

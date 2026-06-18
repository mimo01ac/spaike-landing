"use client";

import { useEffect, useRef, useState } from "react";
import type { GateInfo } from "../_types";

interface Props {
  onPass: (info: GateInfo) => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void },
      ) => string;
    };
  }
}

export default function Gate({ onPass }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Indlæs + render Turnstile-widget hvis site-key er konfigureret.
  useEffect(() => {
    if (!SITE_KEY || !widgetRef.current) return;
    const render = () => {
      if (window.turnstile && widgetRef.current && !widgetRef.current.hasChildNodes()) {
        window.turnstile.render(widgetRef.current, {
          sitekey: SITE_KEY,
          callback: (t) => setTurnstileToken(t),
          "expired-callback": () => setTurnstileToken(null),
        });
      }
    };
    if (window.turnstile) {
      render();
    } else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Du skal acceptere behandlingen af dine oplysninger.");
      return;
    }
    if (SITE_KEY && !turnstileToken) {
      setError("Vent et øjeblik på bot-tjekket, og prøv igen.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/innovationsdag/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, consent, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setSubmitting(false);
        return;
      }
      onPass({ name, email, company, token: data.token, recordId: data.recordId ?? null });
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
        Innovationsdag-guiden
      </p>
      <h3 className="font-serif text-2xl md:text-3xl text-ink leading-tight mb-3">
        Find en god case fra jeres egen hverdag
      </h3>
      <p className="text-ink-soft leading-relaxed mb-7">
        Skriv dit navn og din mail, så går vi i gang. Du går fra det med en konkret,
        brugbar case-brief, du kan beholde uanset hvad du vælger bagefter.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="font-mono text-[11px] tracking-wider uppercase text-muted">Navn</span>
            <input
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] tracking-wider uppercase text-muted">E-mail</span>
            <input
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
            />
          </label>
        </div>
        <label className="block">
          <span className="font-mono text-[11px] tracking-wider uppercase text-muted">
            Virksomhed <span className="normal-case tracking-normal">(valgfrit)</span>
          </span>
          <input
            type="text"
            maxLength={120}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1.5 w-full bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none"
          />
        </label>

        <label className="flex items-start gap-3 text-[13px] text-ink-soft leading-relaxed">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-amber-dark"
          />
          <span>
            Jeg accepterer, at SpAIke gemmer mit navn, min mail og samtalen for at hjælpe mig
            videre. Se{" "}
            <a href="#privatliv" className="text-amber-dark underline">
              privatlivsnoten
            </a>
            .
          </span>
        </label>

        {SITE_KEY && <div ref={widgetRef} className="min-h-[65px]" />}

        {error && <p className="text-[13px] text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors disabled:opacity-60"
        >
          {submitting ? "Et øjeblik …" : "Start →"}
        </button>
      </form>
    </div>
  );
}

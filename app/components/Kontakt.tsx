"use client";

import { useState } from "react";
import { SectionLabel, DoubleRule } from "./EditorialUI";

export default function Kontakt() {
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [besked, setBesked] = useState("");
  const [consent, setConsent] = useState(false);
  const [felde, setFelde] = useState(""); // honeypot: mennesker ser/udfylder den aldrig
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navn, email, besked, consent, felde }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Kunne ikke oprette forbindelse. Prøv igen, eller skriv direkte til michael@spaike.dk.");
      setBusy(false);
    }
  }

  return (
    <section id="kontakt">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 px-6 md:px-14 pt-16 pb-16">
        <div>
          <SectionLabel>Kontakt</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl font-normal leading-none tracking-tight mt-2">
            Skriv, hvad I går og <em className="italic text-amber-dark">bøvler med.</em>
          </h2>
          <p className="font-serif text-base md:text-lg text-ink-soft mt-5 leading-relaxed max-w-md">
            Ikke klar til et møde endnu? Helt fint. Send et par linjer om jeres
            situation, så svarer jeg personligt inden for en hverdag.
          </p>
          <p className="font-sans text-[13px] text-muted mt-6">
            Foretrækker du mail eller kalender direkte:{" "}
            <a
              href="mailto:michael@spaike.dk"
              data-track-event="email_click"
              data-track-location="kontakt-sektion"
              className="text-amber-dark underline"
            >
              michael@spaike.dk
            </a>{" "}
            ·{" "}
            <a
              href="https://calendly.com/michael-spaike/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="book_moede_click"
              data-umami-event-location="kontakt-sektion"
              className="text-amber-dark underline"
            >
              book 20 minutter
            </a>
          </p>
        </div>

        <div>
          {done ? (
            <div className="border border-amber-dark rounded bg-cream-deep p-6">
              <p className="font-serif text-2xl text-ink mb-1.5">Tak for din besked.</p>
              <p className="text-ink-soft leading-relaxed">
                Jeg vender tilbage inden for en hverdag på den mail, du har skrevet.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={navn}
                  onChange={(e) => setNavn(e.target.value)}
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
              <textarea
                required
                maxLength={4000}
                rows={5}
                value={besked}
                onChange={(e) => setBesked(e.target.value)}
                placeholder="Hej Michael, jeg er interesseret i at høre mere om …"
                className="bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none resize-y"
              />
              {/* Honeypot: skjult for mennesker, bots udfylder den */}
              <input
                type="text"
                value={felde}
                onChange={(e) => setFelde(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                name="firma_web"
              />
              <label className="flex items-start gap-3 text-[13px] text-ink-soft leading-relaxed">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-amber-dark"
                />
                <span>
                  Jeg accepterer, at SpAIke gemmer min besked og e-mail for at kunne svare mig.
                </span>
              </label>
              {error && <p className="text-[13px] text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={busy || !consent}
                data-track-event="kontakt_besked_sendt"
                className="self-start bg-ink text-cream px-7 py-3.5 font-sans text-[13px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors disabled:opacity-50"
              >
                {busy ? "Sender …" : "Send besked →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

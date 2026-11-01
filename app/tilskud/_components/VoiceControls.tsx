"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../../components/track";

/**
 * Voice-tilstand for Tilskudstjekket (v1, Michael 2026-11-01).
 *
 * Samme agent som chatten: brugerens tale -> tekst (browserens
 * talegenkendelse, da-DK) -> den almindelige chat-besked; agentens svar ->
 * tale via /api/tilskud action=tts (ElevenLabs, dansk stemme). Kortene
 * (kvalificering, vurdering, lead) er uændrede.
 *
 * Bevidste v1-grænser (se DEFERRED.md): Web Speech API (bedst i Chrome),
 * ingen barge-in (brugeren trykker for at afbryde), ingen mikrofon-måler.
 */

type Status = "klar" | "lytter" | "taenker" | "taler" | "fejl" | "ikke-understoettet";

interface Props {
  token: string;
  /** Sender en bruger-besked ind i chatten. */
  onSend: (text: string) => void;
  /** Sidste færdige assistent-svar (markdown) der skal læses op; ændres pr. svar. */
  sidsteSvar: { id: number; text: string } | null;
  busy: boolean;
  done: boolean;
}

type SR = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function hentRecognition(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function VoiceControls({ token, onSend, sidsteSvar, busy, done }: Props) {
  const [status, setStatus] = useState<Status>("klar");
  const [interim, setInterim] = useState("");
  const [fejl, setFejl] = useState<string | null>(null);
  const [autoLyt, setAutoLyt] = useState(true);
  const recRef = useRef<SR | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spokenId = useRef<number>(0);
  const aktiv = useRef(false);
  // onend læser interim via ref, fordi closure'en ellers ser en forældet værdi.
  const interimRef = useRef("");
  useEffect(() => {
    interimRef.current = interim;
  }, [interim]);

  useEffect(() => {
    if (!hentRecognition()) setStatus("ikke-understoettet");
    return () => {
      aktiv.current = false;
      recRef.current?.abort();
      audioRef.current?.pause();
    };
  }, []);

  // Læs nye assistent-svar op, og lyt derefter automatisk igen.
  useEffect(() => {
    if (!sidsteSvar || sidsteSvar.id === spokenId.current || !aktiv.current) return;
    spokenId.current = sidsteSvar.id;
    void tal(sidsteSvar.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidsteSvar]);

  useEffect(() => {
    if (busy && aktiv.current) setStatus("taenker");
  }, [busy]);

  async function tal(text: string) {
    try {
      setStatus("taler");
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tts", token, text }),
      });
      if (!res.ok) throw new Error(`tts ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current?.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        void audio.play().catch(() => resolve());
      });
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("tale fejlede", (e as Error).message);
    } finally {
      if (aktiv.current && !done && autoLyt) lyt();
      else if (aktiv.current) setStatus("klar");
    }
  }

  function lyt() {
    const Rec = hentRecognition();
    if (!Rec || done) return;
    audioRef.current?.pause();
    try {
      recRef.current?.abort();
    } catch {
      /* ignore */
    }
    const rec = new Rec();
    rec.lang = "da-DK";
    rec.interimResults = true;
    rec.continuous = false;
    let endelig = "";
    rec.onresult = (e) => {
      let tekst = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        tekst += r[0].transcript;
        if (r.isFinal) endelig = tekst;
      }
      setInterim(tekst);
    };
    rec.onerror = (e) => {
      setInterim("");
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setFejl("Browseren fik ikke adgang til mikrofonen. Tillad mikrofon i adresselinjen, og prøv igen.");
        setStatus("fejl");
        aktiv.current = false;
      } else if (e.error === "no-speech") {
        setStatus("klar");
      } else {
        setFejl(`Talegenkendelse fejlede (${e.error}). Prøv igen, eller skift til chatten.`);
        setStatus("fejl");
      }
    };
    rec.onend = () => {
      const t = (endelig || interimRef.current).trim();
      setInterim("");
      if (t && aktiv.current) {
        setStatus("taenker");
        onSend(t);
      } else if (aktiv.current && status !== "fejl") {
        setStatus("klar");
      }
    };
    recRef.current = rec;
    setFejl(null);
    setStatus("lytter");
    try {
      rec.start();
    } catch {
      setStatus("klar");
    }
  }

  function startSamtale() {
    aktiv.current = true;
    trackEvent("tilskud_voice_start");
    // Første gang: læs det seneste assistent-svar op, så samtalen starter med stemmen.
    if (sidsteSvar && sidsteSvar.id !== spokenId.current) {
      spokenId.current = sidsteSvar.id;
      void tal(sidsteSvar.text);
    } else {
      lyt();
    }
  }

  function stop() {
    aktiv.current = false;
    recRef.current?.abort();
    audioRef.current?.pause();
    setInterim("");
    setStatus("klar");
  }

  if (status === "ikke-understoettet") {
    return (
      <div className="border-t border-rule px-4 py-3 bg-cream-deep font-sans text-[13px] text-ink-soft">
        Din browser understøtter ikke talegenkendelse. Brug Chrome (Mac/Windows/Android), eller fortsæt i chatten.
      </div>
    );
  }

  const label =
    status === "lytter" ? "Lytter … tal nu" : status === "taenker" ? "Tænker …" : status === "taler" ? "Taler … (tryk for at afbryde)" : "Tal";

  return (
    <div className="border-t border-rule px-4 py-3 bg-cream-deep">
      <div className="flex flex-wrap items-center gap-3">
        {!aktiv.current ? (
          <button type="button" onClick={startSamtale} disabled={done} className="bg-ink text-cream px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber hover:text-ink transition-colors disabled:opacity-50">
            Start samtalen med stemmen
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => (status === "taler" || status === "klar" ? lyt() : status === "lytter" ? recRef.current?.stop() : undefined)}
              disabled={done || status === "taenker"}
              className={`px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase transition-colors disabled:opacity-50 ${
                status === "lytter" ? "bg-amber text-ink animate-pulse" : "bg-ink text-cream hover:bg-amber hover:text-ink"
              }`}
            >
              {label}
            </button>
            <button type="button" onClick={stop} className="font-sans text-[12px] text-muted underline underline-offset-2 hover:text-ink">
              Stop
            </button>
            <label className="flex items-center gap-1.5 font-sans text-[12px] text-muted ml-auto">
              <input type="checkbox" checked={autoLyt} onChange={(e) => setAutoLyt(e.target.checked)} />
              Lyt automatisk efter hvert svar
            </label>
          </>
        )}
      </div>
      {interim && <p className="font-sans text-[13px] text-ink-soft mt-2 italic">{interim}</p>}
      {fejl && <p className="font-sans text-[13px] text-red-700 mt-2">{fejl}</p>}
      {!aktiv.current && !fejl && (
        <p className="font-sans text-[12px] text-muted mt-2">
          Virker bedst i Chrome med headset. Du kan altid skrive i feltet ovenfor i stedet.
        </p>
      )}
    </div>
  );
}

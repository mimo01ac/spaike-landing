"use client";

import { useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Check, CircleDashed, HelpCircle, Loader2, Mic, X } from "lucide-react";
import { trackEvent } from "../../components/track";
import { naaetTrin, sekunder as tragtSekunder } from "./tragt";
import { AFKLARINGSPUNKTER, afklaretFraCvr, normaliserNote, type Afklaringer } from "@/lib/tilskud/afklaring";
import type { ChatMsg, Kvalificering, StartSvar, Vurdering } from "@/lib/tilskud/types";

/**
 * Stemme-tilstanden (Michael 2026-11-01): et selvstændigt samtale-flow med en
 * coach-agent på ElevenLabs Agents (WebRTC). Ingen chat og intet transskript
 * på skærmen; kun tjeklisten over det der er afklaret, som agenten selv
 * afkrydser via client tool'et `noter_afklaring`. Når samtalen slutter,
 * laver serveren samme kvalificering/vurdering som chatten.
 */

type Fase = "klar" | "forbinder" | "aktiv" | "samler" | "faerdig";

interface Props {
  token: string;
  /** Brugerens navn fra startformularen (agenten hilser med fornavnet). */
  navn: string;
  /** Gemte svar fra en påbegyndt session (fortsæt hvor du slap). */
  tidligere?: { transcript: ChatMsg[]; afklaringer: Record<string, unknown> };
  cvr: string;
  virksomhed: StartSvar["virksomhed"];
  forhaandstjek: StartSvar["forhaandstjek"];
  onKvalificering: (k: Kvalificering, transcript: ChatMsg[]) => void;
  onVurdering: (v: Vurdering, transcript: ChatMsg[]) => void;
}

export default function VoiceSamtale(props: Props) {
  return (
    <ConversationProvider>
      <Samtale {...props} />
    </ConversationProvider>
  );
}

const FORELOEBIG: Record<string, { label: string; cls: string }> = {
  groen: { label: "Foreløbigt: I kan sandsynligvis søge", cls: "border-green-700 text-green-800" },
  gul: { label: "Foreløbigt: muligvis, med forbehold", cls: "border-amber-dark text-amber-dark" },
  roed: { label: "Foreløbigt: ikke som det ser ud nu", cls: "border-red-700 text-red-700" },
};

function Samtale({ token, navn, tidligere, cvr, virksomhed, forhaandstjek, onKvalificering, onVurdering }: Props) {
  const [fase, setFase] = useState<Fase>("klar");
  const [fejl, setFejl] = useState<string | null>(null);
  const [afklaringer, setAfklaringer] = useState<Afklaringer>(() => {
    const gemte = Object.entries(tidligere?.afklaringer ?? {})
      .map(([punkt, x]) => normaliserNote({ punkt, ...(x && typeof x === "object" ? x : {}) }))
      .filter((x): x is NonNullable<typeof x> => !!x);
    return { ...afklaretFraCvr(virksomhed, forhaandstjek), ...Object.fromEntries(gemte.map((x) => [x.id, x.afklaring])) };
  });
  const [foreloebig, setForeloebig] = useState<{ status: string; tekst: string } | null>(null);
  const [sekunder, setSekunder] = useState(0);
  // Mikrofon-tjek før start (vault: "Voice-app mikrofon-tjek + dansk stemme"): valgt enhed + om den har hørt lyd.
  const [enhed, setEnhed] = useState<string | null>(null);
  const [mikOk, setMikOk] = useState(false);
  const udskrift = useRef<ChatMsg[]>(tidligere?.transcript ?? []);
  const gemTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conversationId = useRef<string | null>(null);
  const opkaldStart = useRef<number | null>(null);
  const afklaringerRef = useRef(afklaringer);
  const samlet = useRef(false);
  const orb = useRef<HTMLDivElement>(null);
  afklaringerRef.current = afklaringer;

  const conversation = useConversation({
    clientTools: {
      noter_afklaring: (p: Record<string, unknown>) => {
        const n = normaliserNote(p);
        if (n) {
          setAfklaringer((a) => {
            const ny = { ...a, [n.id]: n.afklaring };
            afklaringerRef.current = ny;
            return ny;
          });
          gemSnart();
        }
        return "ok";
      },
      vis_foreloebig_vurdering: (p: Record<string, unknown>) => {
        const status = String(p.status ?? "");
        if (FORELOEBIG[status]) setForeloebig({ status, tekst: String(p.tekst ?? "").slice(0, 240) });
        return "ok";
      },
    },
    onConnect: () => {
      setFase("aktiv");
      opkaldStart.current = Date.now();
      naaetTrin("samtale");
      trackEvent("tilskud_voice_forbundet", { sekunder: tragtSekunder() });
    },
    onMessage: (m) => {
      if (m.message?.trim()) {
        udskrift.current.push({ role: m.role === "user" ? "user" : "assistant", content: m.message });
        gemSnart();
      }
    },
    onDisconnect: () => {
      if (opkaldStart.current) {
        trackEvent("tilskud_voice_slut", { opkald_sekunder: Math.round((Date.now() - opkaldStart.current) / 1000) });
        opkaldStart.current = null;
      }
      void samlResultat();
    },
    onError: (msg) => {
      console.warn("tilskud voice:", msg);
    },
  });
  /** Gem løbende (samme sid), så samtalen kan genoptages, hvis noget går ned. */
  function gemSnart() {
    if (gemTimer.current) clearTimeout(gemTimer.current);
    gemTimer.current = setTimeout(() => {
      void fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gem", token, kanal: "stemme", udskrift: udskrift.current, afklaringer: afklaringerRef.current }),
        keepalive: true,
      }).catch(() => undefined);
    }, 3000);
  }

  const convRef = useRef(conversation);
  convRef.current = conversation;

  // Afslut samtalen, hvis brugeren skifter til chatten eller forlader siden.
  useEffect(() => {
    return () => {
      try {
        convRef.current.endSession();
      } catch {
        /* ikke startet */
      }
    };
  }, []);

  // Tid + en orb der følger lydniveauet (agentens stemme, ellers mikrofonen).
  useEffect(() => {
    if (fase !== "aktiv") return;
    const start = Date.now();
    const ur = setInterval(() => setSekunder(Math.floor((Date.now() - start) / 1000)), 1000);
    let raf = 0;
    const tik = () => {
      const c = convRef.current;
      let v = 0;
      try {
        v = c.isSpeaking ? c.getOutputVolume() : c.getInputVolume();
      } catch {
        v = 0;
      }
      if (orb.current) orb.current.style.transform = `scale(${1 + Math.min(v, 1) * 0.35})`;
      raf = requestAnimationFrame(tik);
    };
    raf = requestAnimationFrame(tik);
    return () => {
      clearInterval(ur);
      cancelAnimationFrame(raf);
    };
  }, [fase]);

  async function start() {
    setFejl(null);
    setFase("forbinder");
    trackEvent("tilskud_voice_start");
    try {
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "voice-start", token, cvr, virksomhed, navn }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        conversationToken?: string;
        conversationId?: string | null;
        dynamicVariables?: Record<string, string>;
        error?: string;
      };
      if (!res.ok || !data.conversationToken) {
        setFejl(data.error ?? "Stemmen kunne ikke starte lige nu. Prøv igen, eller skriv i chatten.");
        setFase("klar");
        return;
      }
      conversationId.current = data.conversationId ?? null;
      udskrift.current = [...(tidligere?.transcript ?? [])];
      samlet.current = false;
      conversation.startSession({
        conversationToken: data.conversationToken,
        connectionType: "webrtc",
        dynamicVariables: data.dynamicVariables,
        ...(enhed ? { inputDeviceId: enhed } : {}),
      });
    } catch {
      setFejl("Forbindelsen fejlede. Prøv igen, eller skriv i chatten.");
      setFase("klar");
    }
  }

  async function samlResultat() {
    if (samlet.current) return;
    samlet.current = true;
    const harTalt = udskrift.current.some((m) => m.role === "user");
    if (!harTalt) {
      setFejl("Samtalen sluttede, før vi nåede at tale sammen. Start igen, når du er klar.");
      setFase("klar");
      return;
    }
    setFase("samler");
    try {
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "voice-resultat",
          token,
          cvr,
          virksomhed,
          conversationId: conversationId.current,
          udskrift: udskrift.current,
          afklaringer: afklaringerRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        kvalificering?: Kvalificering | null;
        vurdering?: Vurdering | null;
        transcript?: ChatMsg[];
        tom?: boolean;
        error?: string;
      };
      const t = data.transcript ?? udskrift.current;
      if (data.vurdering) {
        onVurdering(data.vurdering, t);
        setFase("faerdig");
      } else if (data.kvalificering) {
        onKvalificering(data.kvalificering, t);
        setFase("faerdig");
      } else {
        setFejl(data.error ?? "Vurderingen kunne ikke samles. Prøv igen.");
        setFase("klar");
        samlet.current = false;
      }
    } catch {
      setFejl("Forbindelsen fejlede, mens vurderingen blev samlet. Prøv igen.");
      setFase("klar");
      samlet.current = false;
    }
  }

  const taler = fase === "aktiv" && conversation.isSpeaking;
  const statusTekst =
    fase === "forbinder"
      ? "Forbinder …"
      : fase === "aktiv"
        ? taler
          ? "Agenten taler"
          : "Lytter, tal bare"
        : fase === "samler"
          ? "Samler vurderingen …"
          : fase === "faerdig"
            ? "Samtalen er slut"
            : "Klar når du er";
  const tid = `${Math.floor(sekunder / 60)}:${String(sekunder % 60).padStart(2, "0")}`;

  return (
    <div className="border border-rule rounded bg-cream overflow-hidden">
      <div className="grid md:grid-cols-[1fr_1.15fr]">
        <div className="px-6 py-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-rule min-h-[320px]">
          <div className="relative h-32 w-32 flex items-center justify-center">
            {fase === "aktiv" && (
              <span className={`absolute inset-0 rounded-full ${taler ? "bg-amber/25" : "bg-ink/10"} animate-ping`} style={{ animationDuration: "2.2s" }} />
            )}
            <div
              ref={orb}
              className={`relative h-28 w-28 rounded-full flex items-center justify-center transition-colors duration-300 ${
                fase === "aktiv" ? (taler ? "bg-amber text-ink" : "bg-ink text-cream") : fase === "faerdig" ? "bg-cream-deep text-muted border border-rule" : "bg-ink text-cream"
              }`}
              style={{ transition: "transform 80ms linear, background-color 300ms" }}
            >
              {fase === "forbinder" || fase === "samler" ? <Loader2 className="h-9 w-9 animate-spin" /> : <Mic className="h-9 w-9" />}
            </div>
          </div>
          <p className="font-serif text-xl mt-5" aria-live="polite">
            {statusTekst}
          </p>
          {fase === "aktiv" && <p className="font-mono text-[11px] text-muted mt-1">{tid}</p>}
          {fase === "samler" && (
            <p className="font-sans text-[13px] text-ink-soft mt-2 max-w-xs">
              Jeg samler vurderingen og projektbeskrivelsen ud fra samtalen. Det tager typisk et halvt minut.
            </p>
          )}

          {fase === "klar" && (
            <>
              <MikrofonTjek
                onEnhed={setEnhed}
                onOk={() => setMikOk(true)}
                onFejl={(f) => setFejl(f)}
              />
              <button
                type="button"
                onClick={() => void start()}
                disabled={!mikOk}
                className="mt-4 bg-ink text-cream px-6 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber hover:text-ink transition-colors disabled:opacity-40 disabled:hover:bg-ink disabled:hover:text-cream"
              >
                Start samtalen
              </button>
              <p className="font-sans text-[12.5px] text-muted mt-3 max-w-xs">
                Brug gerne headset eller AirPods, så agenten ikke hører sig selv. Samtalen tager fem til ti minutter, og du
                kan afbryde agenten, når som helst.
              </p>
            </>
          )}
          {fase === "aktiv" && (
            <button
              type="button"
              onClick={() => conversation.endSession()}
              className="mt-5 border border-ink text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors"
            >
              Afslut samtalen
            </button>
          )}
          {fejl && <p className="font-sans text-[13px] text-red-700 mt-3 max-w-xs">{fejl}</p>}
        </div>

        <div className="px-6 py-6">
          <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Det har vi afklaret</p>
          <Punkter titel="Kan I søge?" fase="kvalificering" afklaringer={afklaringer} />
          <Punkter titel="Forberedelse" fase="forberedelse" afklaringer={afklaringer} />
          {foreloebig && (
            <div className={`mt-5 border px-3.5 py-2.5 ${FORELOEBIG[foreloebig.status].cls}`}>
              <p className="font-mono text-[10.5px] tracking-wider uppercase">{FORELOEBIG[foreloebig.status].label}</p>
              {foreloebig.tekst && <p className="font-sans text-[13px] text-ink-soft mt-1">{foreloebig.tekst}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Punkter({ titel, fase, afklaringer }: { titel: string; fase: "kvalificering" | "forberedelse"; afklaringer: Afklaringer }) {
  return (
    <div className="mt-4">
      <p className="font-sans text-[12.5px] font-medium text-ink">{titel}</p>
      <ul className="mt-1.5 space-y-2">
        {AFKLARINGSPUNKTER.filter((p) => p.fase === fase).map((p) => {
          const a = afklaringer[p.id];
          const ikon = !a ? (
            <CircleDashed className="h-4 w-4 text-muted" />
          ) : a.status === "ok" ? (
            <Check className="h-4 w-4 text-green-700" />
          ) : a.status === "nej" ? (
            <X className="h-4 w-4 text-red-700" />
          ) : (
            <HelpCircle className="h-4 w-4 text-amber-dark" />
          );
          return (
            <li key={p.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">{ikon}</span>
              <span className="font-sans text-[13.5px] leading-snug">
                <span className={a ? "text-ink" : "text-muted"}>{p.label}</span>
                {a?.note && <span className="block text-[12.5px] text-ink-soft">{a.note}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Mikrofon-tjek før samtalen: enhedsvælger + levende niveau-måler, og
 * "Start samtalen" låses op først, når mikrofonen har hørt rigtig lyd.
 * Mønster fra vault-noten "Voice-app mikrofon-tjek + dansk stemme (best practice)".
 */
function MikrofonTjek({ onEnhed, onOk, onFejl }: { onEnhed: (id: string | null) => void; onOk: () => void; onFejl: (f: string | null) => void }) {
  const [aktiv, setAktiv] = useState(false);
  const [enheder, setEnheder] = useState<MediaDeviceInfo[]>([]);
  const [valgt, setValgt] = useState<string>("");
  const [niveau, setNiveau] = useState(0);
  const [hoert, setHoert] = useState(false);
  const stop = useRef<() => void>(() => undefined);

  useEffect(() => () => stop.current(), []);

  async function maal(deviceId?: string) {
    stop.current();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { ...(deviceId ? { deviceId: { exact: deviceId } } : {}), echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const alle = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
      setEnheder(alle);
      const brugt = stream.getAudioTracks()[0]?.getSettings().deviceId ?? deviceId ?? "";
      setValgt(brugt);
      onEnhed(brugt || null);
      const ctx = new AudioContext();
      const kilde = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      kilde.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let raf = 0;
      const tik = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const pct = Math.min(100, Math.round(Math.sqrt(sum / data.length) * 320));
        setNiveau(pct);
        if (pct > 12) {
          setHoert(true);
          onOk();
        }
        raf = requestAnimationFrame(tik);
      };
      raf = requestAnimationFrame(tik);
      stop.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
      };
      setAktiv(true);
      onFejl(null);
    } catch {
      onFejl("Browseren fik ikke adgang til mikrofonen. Tillad mikrofonen i adresselinjen, og prøv igen, eller skriv i chatten.");
    }
  }

  if (!aktiv) {
    return (
      <button
        type="button"
        onClick={() => void maal()}
        className="mt-5 border border-ink text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors"
      >
        Tjek mikrofonen
      </button>
    );
  }
  return (
    <div className="mt-5 w-full max-w-xs text-left">
      {enheder.length > 1 && (
        <select
          value={valgt}
          onChange={(e) => {
            setHoert(false);
            void maal(e.target.value);
          }}
          aria-label="Mikrofon"
          className="w-full bg-cream border border-rule rounded px-2.5 py-1.5 font-sans text-[12.5px] text-ink"
        >
          {enheder.map((d, i) => (
            <option key={d.deviceId || i} value={d.deviceId}>
              {d.label || `Mikrofon ${i + 1}`}
            </option>
          ))}
        </select>
      )}
      <div className="mt-2 h-2 rounded bg-cream-deep border border-rule overflow-hidden" aria-hidden="true">
        <div className={`h-full transition-[width] duration-75 ${hoert ? "bg-green-700" : "bg-amber"}`} style={{ width: `${niveau}%` }} />
      </div>
      <p className={`font-sans text-[12.5px] mt-1.5 ${hoert ? "text-green-800" : "text-red-700"}`} aria-live="polite">
        {hoert ? "Mikrofonen virker." : "Sig noget, så bjælken bevæger sig."}
      </p>
    </div>
  );
}

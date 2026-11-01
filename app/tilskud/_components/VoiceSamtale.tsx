"use client";

import { useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Check, CircleDashed, HelpCircle, Loader2, Mic, X } from "lucide-react";
import { trackEvent } from "../../components/track";
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

function Samtale({ token, cvr, virksomhed, forhaandstjek, onKvalificering, onVurdering }: Props) {
  const [fase, setFase] = useState<Fase>("klar");
  const [fejl, setFejl] = useState<string | null>(null);
  const [afklaringer, setAfklaringer] = useState<Afklaringer>(() => afklaretFraCvr(virksomhed, forhaandstjek));
  const [foreloebig, setForeloebig] = useState<{ status: string; tekst: string } | null>(null);
  const [sekunder, setSekunder] = useState(0);
  const udskrift = useRef<ChatMsg[]>([]);
  const conversationId = useRef<string | null>(null);
  const afklaringerRef = useRef(afklaringer);
  const samlet = useRef(false);
  const orb = useRef<HTMLDivElement>(null);
  afklaringerRef.current = afklaringer;

  const conversation = useConversation({
    clientTools: {
      noter_afklaring: (p: Record<string, unknown>) => {
        const n = normaliserNote(p);
        if (n) setAfklaringer((a) => ({ ...a, [n.id]: n.afklaring }));
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
      trackEvent("tilskud_voice_forbundet");
    },
    onMessage: (m) => {
      if (m.message?.trim()) udskrift.current.push({ role: m.role === "user" ? "user" : "assistant", content: m.message });
    },
    onDisconnect: () => {
      void samlResultat();
    },
    onError: (msg) => {
      console.warn("tilskud voice:", msg);
    },
  });
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setFejl("Browseren fik ikke adgang til mikrofonen. Tillad mikrofonen i adresselinjen, og prøv igen, eller skriv i chatten.");
      setFase("klar");
      return;
    }
    try {
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "voice-start", token, cvr, virksomhed }),
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
      udskrift.current = [];
      samlet.current = false;
      conversation.startSession({
        conversationToken: data.conversationToken,
        connectionType: "webrtc",
        dynamicVariables: data.dynamicVariables,
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
              <button
                type="button"
                onClick={() => void start()}
                className="mt-5 bg-ink text-cream px-6 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber hover:text-ink transition-colors"
              >
                Start samtalen
              </button>
              <p className="font-sans text-[12.5px] text-muted mt-3 max-w-xs">
                Tillad mikrofonen, når browseren spørger. Brug gerne headset. Samtalen tager fem til ti minutter, og du kan
                afbryde agenten, når som helst.
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

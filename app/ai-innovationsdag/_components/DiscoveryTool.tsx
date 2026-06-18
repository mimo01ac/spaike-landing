"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseBriefData, ChatMsg } from "../_types";
import Chat from "./Chat";
import CaseBrief from "./CaseBrief";
import EndStep from "./EndStep";

// DIY-guiden (best practices til at køre din egen innovationsdag).
const DIY_PLAYBOOK_URL = "/ai-innovationsdag/guide";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; size?: string },
      ) => string;
    };
  }
}

type Stage = "loading" | "chat" | "brief";

// Gem igangværende samtale i browseren, så reload/refresh/genstart ikke taber
// den. Det er brugerens egne data på egen maskine (ikke server-side), så ingen
// samtykke-krav; ryddes når leadet sendes eller man starter forfra.
const STORE_KEY = "spaike_innovationsdag_v1";

interface Store {
  messages?: ChatMsg[];
  brief?: CaseBriefData;
  transcript?: ChatMsg[];
}

function loadStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStore(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* localStorage utilgængelig (privat-tilstand e.l.) */
  }
}

function clearStore() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}

export default function DiscoveryTool() {
  const [restored] = useState<Store>(() => loadStore());
  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [brief, setBrief] = useState<CaseBriefData | null>(restored.brief ?? null);
  const [transcript, setTranscript] = useState<ChatMsg[]>(restored.transcript ?? []);
  const [done, setDone] = useState<null | { wantHelp: boolean }>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  function resetAll() {
    clearStore();
    window.location.reload();
  }

  async function start(turnstileToken?: string) {
    try {
      const res = await fetch("/api/innovationsdag/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStartError(data.error ?? "Kunne ikke starte. Genindlæs siden.");
        return;
      }
      setToken(data.token);
      // Genskab brief-stadiet hvis der lå en færdig brief i localStorage.
      setStage(restored.brief ? "brief" : "chat");
    } catch {
      setStartError("Kunne ikke oprette forbindelse. Genindlæs siden.");
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!SITE_KEY) {
      void start();
      return;
    }
    // Turnstile konfigureret: render usynligt og start når vi har et token.
    const render = () => {
      if (window.turnstile && widgetRef.current && !widgetRef.current.hasChildNodes()) {
        window.turnstile.render(widgetRef.current, {
          sitekey: SITE_KEY,
          size: "flexible",
          callback: (t) => void start(t),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialUserMessage =
    "Hej! Jeg vil gerne finde en god case fra vores hverdag til en AI-innovationsdag.";

  return (
    <div>
      {stage === "loading" && (
        <div className="max-w-2xl mx-auto text-center py-10">
          {startError ? (
            <p className="text-red-700 text-sm">{startError}</p>
          ) : (
            <p className="text-muted text-sm italic">Starter Innovationsdag-guiden …</p>
          )}
          {SITE_KEY && <div ref={widgetRef} className="mt-4 flex justify-center" />}
        </div>
      )}

      {stage === "chat" && token && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-2">
              Innovationsdag-guiden
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-ink leading-tight mb-2">
              Find jeres egen AI-case
            </h3>
            <p className="text-ink-soft leading-relaxed">
              Svar på et par spørgsmål om jeres hverdag, så hjælper jeg jer med at finde 1-3
              konkrete cases. I går fra det med en færdig brief.
            </p>
          </div>
          <Chat
            token={token}
            initialUserMessage={initialUserMessage}
            restoredMessages={restored.messages}
            onMessagesChange={(m) => saveStore({ messages: m })}
            onBrief={(b, t) => {
              saveStore({ brief: b, transcript: t });
              setBrief(b);
              setTranscript(t);
              setStage("brief");
            }}
          />
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={resetAll}
              className="font-mono text-[11px] tracking-wider uppercase text-muted hover:text-amber-dark transition-colors"
            >
              Start forfra
            </button>
          </div>
        </div>
      )}

      {stage === "brief" && brief && token && (
        <div className="space-y-12">
          <CaseBrief brief={brief} />

          <div className="no-print max-w-2xl mx-auto border-t border-rule pt-10">
            {/* DIY-guide som det centrale værdi-tilbud */}
            <div className="border border-amber-dark rounded bg-cream-deep p-6 mb-8">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-2">
                Kør den selv
              </p>
              <h3 className="font-serif text-xl text-ink leading-snug mb-2">
                Få min guide til at køre din egen innovationsdag
              </h3>
              <p className="text-[15px] text-ink-soft leading-relaxed mb-4">
                Jeg har samlet mine best practices i en praktisk guide, så I kan køre dagen selv,
                trin for trin (mange kalder det et hackathon). Sammen med jeres case-brief har I så
                både et godt udgangspunkt og en opskrift. I får begge dele tilsendt.
              </p>
              <a
                href={DIY_PLAYBOOK_URL}
                className="inline-block border border-ink text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors"
              >
                Læs guiden →
              </a>
            </div>

            {!done ? (
              <>
                <h3 className="font-serif text-2xl text-ink leading-tight mb-2">
                  Vil du have det hele tilsendt?
                </h3>
                <p className="text-ink-soft mb-6 leading-relaxed">
                  Skriv din mail, så sender jeg din case-brief og min guide til dig. Kryds af hvis du
                  også vil høre om hjælp til at køre dagen.
                </p>
                <EndStep
                  token={token}
                  brief={brief}
                  transcript={transcript}
                  onDone={(wantHelp) => {
                    clearStore();
                    setDone({ wantHelp });
                  }}
                />
              </>
            ) : (
              <div className="border border-amber-dark rounded bg-cream-deep p-6 text-center">
                <p className="font-serif text-xl text-ink mb-1.5">Tak, det er på vej.</p>
                <p className="text-ink-soft text-[14px]">
                  {done.wantHelp
                    ? "Du får din brief og guide, og jeg vender tilbage om en mulig innovationsdag."
                    : "Du får din case-brief og min guide til at køre dagen selv."}
                  {DIY_PLAYBOOK_URL && (
                    <>
                      {" "}
                      <a
                        href={DIY_PLAYBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-dark underline"
                      >
                        Hent guiden nu
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

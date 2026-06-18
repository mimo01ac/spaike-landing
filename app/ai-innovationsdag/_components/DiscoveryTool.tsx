"use client";

import { useState } from "react";
import type { CaseBriefData, ChatMsg, GateInfo } from "../_types";
import Gate from "./Gate";
import Chat from "./Chat";
import CaseBrief from "./CaseBrief";
import ApplicationForm from "./ApplicationForm";

// TODO Michael: indsæt linket til den gratis DIY-playbook her, når den er klar.
const DIY_PLAYBOOK_URL = "";

type Stage = "gate" | "chat" | "brief";

async function persistSession(payload: Record<string, unknown>) {
  try {
    await fetch("/api/innovationsdag/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* persistering må ikke vælte UI'et */
  }
}

export default function DiscoveryTool() {
  const [stage, setStage] = useState<Stage>("gate");
  const [gate, setGate] = useState<GateInfo | null>(null);
  const [brief, setBrief] = useState<CaseBriefData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [diyChosen, setDiyChosen] = useState(false);

  function onGatePass(info: GateInfo) {
    setGate(info);
    setStage("chat");
  }

  function onBrief(b: CaseBriefData, transcript: ChatMsg[]) {
    setBrief(b);
    setStage("brief");
    if (gate) {
      void persistSession({
        token: gate.token,
        recordId: gate.recordId,
        transcript,
        case_brief: b,
        company: b.virksomhed,
        size: b.stoerrelse,
      });
    }
  }

  function chooseDiy() {
    setDiyChosen(true);
    if (gate) {
      void persistSession({ token: gate.token, recordId: gate.recordId, path_chosen: "diy" });
    }
    window.umami?.track("innovationsdag_path_diy");
  }

  const initialUserMessage = gate
    ? `Hej! Jeg hedder ${gate.name}${gate.company ? ` fra ${gate.company}` : ""}. Jeg vil gerne finde en god case til en AI-innovationsdag.`
    : "";

  return (
    <div>
      {stage === "gate" && <Gate onPass={onGatePass} />}

      {stage === "chat" && gate && (
        <Chat token={gate.token} initialUserMessage={initialUserMessage} onBrief={onBrief} />
      )}

      {stage === "brief" && brief && gate && (
        <div className="space-y-12">
          <CaseBrief brief={brief} />

          <div className="no-print max-w-2xl mx-auto border-t border-rule pt-10">
            <h3 className="font-serif text-2xl text-ink leading-tight mb-2 text-center">
              To veje herfra
            </h3>
            <p className="text-ink-soft text-center mb-8 leading-relaxed">
              Din brief er din uanset hvad. Vælg den vej der passer jer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gør det selv */}
              <div className="border border-rule rounded bg-cream p-6 flex flex-col">
                <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-2">
                  Gør det selv
                </p>
                <p className="text-[14px] text-ink-soft leading-relaxed flex-1">
                  Tag briefen og kør jeres egen innovationsdag. Jeg har lavet en gratis playbook,
                  der tager jer gennem dagen, trin for trin. I kan få værdi helt uden mig.
                </p>
                {DIY_PLAYBOOK_URL ? (
                  <a
                    href={DIY_PLAYBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={chooseDiy}
                    className="mt-5 inline-block border border-ink text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors text-center"
                  >
                    Hent playbook →
                  </a>
                ) : (
                  <button
                    onClick={chooseDiy}
                    className="mt-5 border border-ink text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors"
                  >
                    {diyChosen ? "Playbook kommer snart, jeg sender den" : "Jeg vil gøre det selv"}
                  </button>
                )}
              </div>

              {/* Søg om gratis innovationsdag */}
              <div className="border border-amber-dark rounded bg-cream-deep p-6 flex flex-col">
                <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-2">
                  Søg om en gratis innovationsdag
                </p>
                <p className="text-[14px] text-ink-soft leading-relaxed flex-1">
                  Jeg søger 1-2 pilotvirksomheder for at finpudse processen og bygge rigtige cases.
                  Ansøger du, kommer du med et defineret problem og jeg kender allerede jeres
                  forretning.
                </p>
                {!showForm && !applied && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      window.umami?.track("innovationsdag_path_apply");
                    }}
                    className="mt-5 bg-ink text-cream px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
                  >
                    Søg om pilot →
                  </button>
                )}
              </div>
            </div>

            {showForm && !applied && (
              <div className="mt-8 border border-rule rounded bg-cream p-6">
                <ApplicationForm gate={gate} brief={brief} onSubmitted={() => setApplied(true)} />
              </div>
            )}

            {applied && (
              <div className="mt-8 border border-amber-dark rounded bg-cream-deep p-6 text-center">
                <p className="font-serif text-xl text-ink mb-1.5">Tak, jeg har modtaget din ansøgning.</p>
                <p className="text-ink-soft text-[14px]">
                  Jeg vender tilbage på {gate.email} hurtigst muligt.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

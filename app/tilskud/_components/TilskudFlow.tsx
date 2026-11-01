"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { trackEvent } from "../../components/track";
import type { ChatMsg, Kvalificering, StartSvar, Vurdering } from "@/lib/tilskud/types";

const CALENDLY = "https://calendly.com/michael-spaike/new-meeting";
const INTRO = "Hej. Jeg vil gerne tjekke, om vi kan søge tilskud til et projekt om AI og automatisering.";
const FORTSAET = "Ja, lad os fortsætte til forberedelsen.";
/** Lægges i historikken når fase 1 er afgivet, så modellen ved det (den ser ikke sine egne tool-kald igen). */
const KVAL_MARKOER = (status: string) => `\n\n[Kvalificering afgivet: ${status}]`;

const md: Components = {
  p: ({ node: _n, ...props }) => <p className="mb-2.5 last:mb-0" {...props} />,
  strong: ({ node: _n, ...props }) => <strong className="font-semibold" {...props} />,
  ul: ({ node: _n, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2.5 last:mb-0" {...props} />,
  ol: ({ node: _n, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2.5 last:mb-0" {...props} />,
};

const inputCls =
  "bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none disabled:opacity-60";
const btnPrimary =
  "bg-ink text-cream px-6 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber hover:text-ink transition-colors disabled:opacity-50";
const btnAmber =
  "bg-amber text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber-dark hover:text-cream transition-colors disabled:opacity-50";

export default function TilskudFlow() {
  const [start, setStart] = useState<StartSvar | null>(null);
  const [cvrInput, setCvrInput] = useState("");
  const [cvrBrugt, setCvrBrugt] = useState("");
  const [starter, setStarter] = useState(false);
  const [startFejl, setStartFejl] = useState<string | null>(null);
  const [vurdering, setVurdering] = useState<Vurdering | null>(null);
  const [kvalificering, setKvalificering] = useState<Kvalificering | null>(null);
  const [stopEfterKval, setStopEfterKval] = useState(false);
  const [inject, setInject] = useState<{ id: number; text: string } | null>(null);
  const [transcript, setTranscript] = useState<ChatMsg[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const kvalRef = useRef<HTMLDivElement>(null);

  async function kaldStart(cvr: string, cvrFallback?: unknown) {
    const res = await fetch("/api/tilskud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", cvr, cvrFallback }),
    });
    return { res, data: (await res.json()) as StartSvar & { error?: string } };
  }

  // Fallback når serverens CVR-opslag afvises (cvrapi.dk's gratis-kvote er pr.
  // IP, og Vercels delte IP'er er opbrugt): browseren slår selv op; kvoten
  // følger så den besøgendes egen IP. Serveren validerer svaret mod CVR'et.
  async function slaaOpFraBrowser(cvr: string): Promise<unknown | null> {
    try {
      const r = await fetch(`https://cvrapi.dk/api?search=${cvr}&country=dk`, { headers: { Accept: "application/json" } });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  async function startTjek(cvr: string) {
    setStarter(true);
    setStartFejl(null);
    try {
      let { res, data } = await kaldStart(cvr);
      if (res.ok && data.token && cvr && !data.virksomhed && data.cvrFejl) {
        const fallback = await slaaOpFraBrowser(cvr);
        if (fallback) ({ res, data } = await kaldStart(cvr, fallback));
      }
      if (!res.ok || !data.token) {
        setStartFejl(data.error ?? "Noget gik galt. Prøv igen.");
        return;
      }
      setCvrBrugt(cvr);
      setStart(data);
      trackEvent("tilskud_start", { cvr_fundet: data.virksomhed ? "ja" : "nej" });
    } catch {
      setStartFejl("Forbindelsen fejlede. Prøv igen.");
    } finally {
      setStarter(false);
    }
  }

  useEffect(() => {
    if (vurdering) {
      trackEvent("tilskud_vurdering_klar", { status: vurdering.egnethed.status });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [vurdering]);

  useEffect(() => {
    if (kvalificering) {
      trackEvent("tilskud_kvalificering_klar", { status: kvalificering.status });
      setTimeout(() => kvalRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
    }
  }, [kvalificering]);

  if (!start) {
    return (
      <VirksomhedsSoegning
        value={cvrInput}
        onChange={setCvrInput}
        busy={starter}
        fejl={startFejl}
        setFejl={setStartFejl}
        onVaelg={(cvr) => void startTjek(cvr)}
        onSpringOver={() => void startTjek("")}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Virksomhedskort start={start} />
      <Chat
        token={start.token}
        cvr={cvrBrugt}
        virksomhed={start.virksomhed}
        inject={inject}
        onKvalificering={(k, t) => {
          setKvalificering(k);
          setTranscript(t);
        }}
        onVurdering={(v, t) => {
          setVurdering(v);
          setTranscript(t);
        }}
      />
      {kvalificering && !vurdering && (
        <div ref={kvalRef} className="scroll-mt-24">
          <KvalificeringKort
            k={kvalificering}
            stoppet={stopEfterKval}
            onFortsaet={() => {
              setStopEfterKval(false);
              trackEvent("tilskud_fortsaet_forberedelse", { status: kvalificering.status });
              setInject({ id: Date.now(), text: FORTSAET });
            }}
            onStop={() => {
              setStopEfterKval(true);
              trackEvent("tilskud_stop_efter_kvalificering", { status: kvalificering.status });
            }}
          />
          {stopEfterKval && (
            <div className="border border-rule border-t-0 rounded-b bg-cream-deep">
              <LeadForm
                token={start.token}
                cvr={cvrBrugt}
                virksomhed={start.virksomhed?.navn ?? ""}
                vurdering={null}
                kvalificering={kvalificering}
                transcript={transcript}
              />
            </div>
          )}
        </div>
      )}
      {vurdering && (
        <div ref={resultRef} className="scroll-mt-24">
          <Resultat
            vurdering={vurdering}
            token={start.token}
            cvr={cvrBrugt}
            virksomhed={start.virksomhed?.navn ?? ""}
            transcript={transcript}
          />
        </div>
      )}
    </div>
  );
}

type Soegehit = {
  cvr: string;
  navn: string;
  postnr?: string;
  by?: string;
  selskabsform?: string;
  branche?: string;
  ansatteInterval?: string | null;
};

/**
 * Ét felt til både CVR-nummer og virksomhedsnavn. Skriver man bogstaver,
 * søges der i CVR efter 350 ms, og man vælger virksomheden på listen (for
 * dem der ikke lige husker CVR-nummeret). 8 cifre starter direkte.
 */
function VirksomhedsSoegning({
  value,
  onChange,
  busy,
  fejl,
  setFejl,
  onVaelg,
  onSpringOver,
}: {
  value: string;
  onChange: (v: string) => void;
  busy: boolean;
  fejl: string | null;
  setFejl: (f: string | null) => void;
  onVaelg: (cvr: string) => void;
  onSpringOver: () => void;
}) {
  const [hits, setHits] = useState<Soegehit[]>([]);
  const [soeger, setSoeger] = useState(false);
  const [soegt, setSoegt] = useState(false);
  const [utilgaengelig, setUtilgaengelig] = useState(false);
  const digits = value.replace(/\D/g, "");
  const erCvr = /^\d{8}$/.test(digits) && !/[a-zA-ZæøåÆØÅ]/.test(value);
  const erNavn = value.trim().length >= 3 && /[a-zA-ZæøåÆØÅ]/.test(value);

  useEffect(() => {
    if (!erNavn) {
      setHits([]);
      setSoegt(false);
      return;
    }
    const term = value.trim();
    const t = setTimeout(async () => {
      setSoeger(true);
      try {
        const res = await fetch("/api/tilskud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "soeg", term }),
        });
        const data = (await res.json()) as { resultater?: Soegehit[]; utilgaengelig?: boolean };
        setHits(data.resultater ?? []);
        setUtilgaengelig(!!data.utilgaengelig);
        setSoegt(true);
        trackEvent("tilskud_navnesoegning", { hits: String(data.resultater?.length ?? 0) });
      } catch {
        setHits([]);
      } finally {
        setSoeger(false);
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFejl(null);
          if (erCvr) return onVaelg(digits);
          if (hits[0]) return onVaelg(hits[0].cvr);
          setFejl(erNavn ? "Vælg virksomheden på listen, eller skriv CVR-nummeret (8 cifre)." : "Skriv et CVR-nummer (8 cifre) eller virksomhedens navn.");
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="CVR-nummer eller virksomhedsnavn"
          aria-label="CVR-nummer eller virksomhedsnavn"
          aria-autocomplete="list"
          disabled={busy}
          className={`${inputCls} flex-1 text-lg`}
        />
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Slår op …" : "Start tjekket"}
        </button>
      </form>

      {erNavn && (soeger || soegt) && (
        <div className="mt-2 border border-rule rounded bg-cream-deep overflow-hidden" role="listbox" aria-label="Virksomheder">
          {soeger && hits.length === 0 && <p className="px-4 py-3 font-sans text-[13px] text-muted">Søger i CVR …</p>}
          {!soeger && soegt && hits.length === 0 && (
            <p className="px-4 py-3 font-sans text-[13px] text-muted">
              {utilgaengelig
                ? "Navnesøgningen er ikke tilgængelig lige nu. Skriv CVR-nummeret i stedet."
                : "Ingen aktive virksomheder matcher. Prøv en kortere del af navnet, eller skriv CVR-nummeret."}
            </p>
          )}
          {hits.map((h) => (
            <button
              key={h.cvr}
              type="button"
              role="option"
              aria-selected={false}
              disabled={busy}
              onClick={() => onVaelg(h.cvr)}
              className="w-full text-left px-4 py-2.5 border-b border-rule last:border-b-0 hover:bg-cream transition-colors disabled:opacity-60"
            >
              <span className="font-serif text-[16px]">{h.navn}</span>
              <span className="font-mono text-[10.5px] text-muted ml-2">CVR {h.cvr}</span>
              <span className="block font-sans text-[12.5px] text-ink-soft">
                {[h.selskabsform, [h.postnr, h.by].filter(Boolean).join(" "), h.ansatteInterval ? `${h.ansatteInterval} ansatte` : null, h.branche]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-2.5">
        {fejl && <p className="text-[13px] text-red-700">{fejl}</p>}
        <button
          type="button"
          onClick={onSpringOver}
          disabled={busy}
          className="font-sans text-[12.5px] text-muted underline underline-offset-2 hover:text-ink"
        >
          Spring CVR over og svar selv
        </button>
      </div>
    </div>
  );
}

function Virksomhedskort({ start }: { start: StartSvar }) {
  const v = start.virksomhed;
  const t = start.forhaandstjek;
  const p = start.pulje;
  const chip = (label: string, ok: "ja" | "nej" | "ukendt") => (
    <span
      key={label}
      className={`font-mono text-[10.5px] tracking-wider uppercase px-2 py-0.5 border ${
        ok === "ja" ? "border-green-700 text-green-800" : ok === "nej" ? "border-red-700 text-red-700" : "border-rule text-muted"
      }`}
    >
      {label}: {ok === "ja" ? "ok" : ok === "nej" ? "nej" : "?"}
    </span>
  );
  return (
    <div className="border border-rule rounded bg-cream-deep px-5 py-4">
      {v ? (
        <>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-xl font-medium">{v.navn}</span>
            <span className="font-mono text-[11px] text-muted">CVR {v.cvr}</span>
          </div>
          <p className="font-sans text-[13.5px] text-ink-soft mt-1">
            {[
              v.branche,
              v.selskabsform,
              v.by,
              v.ansatteInterval ? `${v.ansatteInterval} ansatte` : null,
              v.aarsvaerkInterval ? `${v.aarsvaerkInterval} årsværk` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {t && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {chip("Aktiv", t.aktiv ? "ja" : "nej")}
              {chip("SMV", t.smv)}
              {chip("2+ årsværk", t.aarsvaerk)}
              {chip("Årsregnskab", t.regnskab === "sandsynligt" ? "ja" : t.regnskab === "tvivlsomt" ? "nej" : "ukendt")}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="font-sans text-[13.5px] text-ink-soft">
            {start.cvrFejl
              ? "CVR-opslaget svarede ikke lige nu. Jeg spørger i stedet om det, jeg skal bruge."
              : "Intet CVR-opslag. Jeg spørger i stedet om det, jeg skal bruge."}
          </p>
          {start.cvrFejl && (
            <p className="font-mono text-[10.5px] text-muted mt-1.5 break-all">Teknisk: {start.cvrFejl}</p>
          )}
        </>
      )}
      {p && (
        <p className="font-sans text-[12.5px] text-muted mt-3 border-t border-rule pt-2.5">
          Næste pulje: <b className="text-ink font-medium">{p.navn}</b>, åbner{" "}
          {new Date(p.aabner).toLocaleString("da-DK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          , op til {p.maksTilskudKr.toLocaleString("da-DK")} kr.
        </p>
      )}
    </div>
  );
}

function Chat({
  token,
  cvr,
  virksomhed,
  inject,
  onKvalificering,
  onVurdering,
}: {
  token: string;
  cvr: string;
  virksomhed: StartSvar["virksomhed"];
  /** Programmatisk besked (fx "fortsæt til forberedelsen" fra kvalificeringskortet). */
  inject: { id: number; text: string } | null;
  onKvalificering: (k: Kvalificering, transcript: ChatMsg[]) => void;
  onVurdering: (v: Vurdering, transcript: ChatMsg[]) => void;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const lastInject = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void send(INTRO, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inject || inject.id === lastInject.current) return;
    lastInject.current = inject.id;
    void send(inject.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inject]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!busy && !done) inputRef.current?.focus();
  }, [busy, done]);

  async function send(text: string, hideUser = false) {
    if (busy || done) return;
    setError(null);
    setBusy(true);
    if (!hideUser && !messages.some((m) => m.role === "user")) trackEvent("tilskud_chat_foerste_svar");

    const history: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(hideUser ? messages : history);

    try {
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", token, cvr, virksomhed, messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Der opstod en fejl. Prøv igen.");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: { type: string; text?: string; vurdering?: Vurdering; kvalificering?: Kvalificering; error?: string };
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.type === "text" && evt.text) {
            assistantText += evt.text;
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: assistantText };
              return copy;
            });
          } else if (evt.type === "kvalificering" && evt.kvalificering) {
            // Fase 1 afgivet: markér i historikken (vises ikke, men sendes til modellen).
            const k = evt.kvalificering;
            const medMarkoer = (assistantText || "Kvalificeringen er klar nedenfor.") + KVAL_MARKOER(k.status);
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: medMarkoer };
              return copy;
            });
            onKvalificering(k, [...history, { role: "assistant", content: medMarkoer }]);
          } else if (evt.type === "vurdering" && evt.vurdering) {
            setDone(true);
            onVurdering(evt.vurdering, [
              ...history,
              { role: "assistant", content: assistantText || "Jeg har samlet vurderingen." },
            ]);
          } else if (evt.type === "error") {
            setError(evt.error ?? "Der opstod en fejl.");
          }
        }
      }
    } catch {
      setError("Forbindelsen blev afbrudt. Prøv igen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-rule rounded bg-cream overflow-hidden">
      <div ref={scrollRef} className="h-[440px] overflow-y-auto px-5 py-6 space-y-5" aria-live="polite">
        {messages.length === 0 && busy && <p className="text-muted text-sm italic">Tilskudstjekket læser CVR-data …</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] bg-ink text-cream rounded-lg rounded-br-sm px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap"
                  : "max-w-[90%] text-ink text-[15px] leading-relaxed"
              }
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                    {m.content.replace(/\n\n\[Kvalificering afgivet: [a-z]+\]$/, "")}
                  </ReactMarkdown>
                ) : busy ? (
                  "…"
                ) : (
                  ""
                )
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {done && (
          <p className="text-muted text-[13px] italic border-t border-rule pt-3">
            Vurderingen er klar nedenfor.
          </p>
        )}
      </div>
      {error && <p className="px-5 py-2 text-[13px] text-red-700 border-t border-rule">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = input.trim();
          if (!t || busy || done) return;
          setInput("");
          void send(t);
        }}
        className="border-t border-rule p-3 flex gap-2 bg-cream-deep"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy || done}
          placeholder={done ? "Tjekket er færdigt" : "Skriv dit svar …"}
          aria-label="Dit svar"
          className={`${inputCls} flex-1`}
        />
        <button type="submit" disabled={busy || done || !input.trim()} className={btnAmber}>
          Send
        </button>
      </form>
    </div>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  groen: { label: "Grøn: I kan sandsynligvis søge", cls: "border-green-700 text-green-800" },
  gul: { label: "Gul: muligvis, med forbehold", cls: "border-amber-dark text-amber-dark" },
  roed: { label: "Rød: ikke som det ser ud nu", cls: "border-red-700 text-red-700" },
};

/** Fase 1-kortet: resultatet af kvalificeringen og valget om at fortsætte til forberedelsen. */
function KvalificeringKort({
  k,
  stoppet,
  onFortsaet,
  onStop,
}: {
  k: Kvalificering;
  stoppet: boolean;
  onFortsaet: () => void;
  onStop: () => void;
}) {
  const s = STATUS[k.status] ?? STATUS.gul;
  const roed = k.status === "roed";
  return (
    <div className={`border border-rule bg-cream-deep ${stoppet ? "rounded-t" : "rounded"}`}>
      <div className="px-5 py-5">
        <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Trin 1 af 2: kvalificering</p>
        <span className={`inline-block mt-2 font-mono text-[10.5px] tracking-wider uppercase px-2 py-0.5 border ${s.cls}`}>{s.label}</span>
        <p className="font-serif text-xl mt-3 leading-snug">{k.opsummering}</p>
        <ul className="list-disc pl-5 mt-3 space-y-1 font-sans text-[14px] text-ink-soft">
          {k.begrundelse.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {k.stoppere.length > 0 && (
          <div className="mt-3">
            <p className="font-mono text-[10.5px] tracking-wider uppercase text-red-700">Det der skal afklares</p>
            <ul className="list-disc pl-5 mt-1 space-y-1 font-sans text-[14px] text-ink-soft">
              {k.stoppere.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4 mt-4 font-sans text-[13.5px] text-ink-soft">
          <p>
            <b className="text-ink font-medium">Pulje:</b> {k.pulje.navn}. {k.pulje.hvorfor}
          </p>
          {k.idee && (
            <p>
              <b className="text-ink font-medium">Jeres idé:</b> {k.idee}
            </p>
          )}
        </div>
      </div>
      <div className="px-5 py-5 border-t border-rule bg-cream">
        <p className="font-mono text-[10.5px] tracking-wider uppercase text-amber-dark">Trin 2 af 2: forberedelse</p>
        <p className="font-serif text-lg mt-1 leading-snug">
          {roed
            ? "Som det ser ud nu, kan I ikke søge. I kan stadig få forberedelsen, hvis I vil have projektet tænkt igennem alligevel."
            : "Nu handler det om at forberede jer, så ansøgningen står så stærkt som muligt."}
        </p>
        <p className="font-sans text-[14px] text-ink-soft mt-2">
          {k.naeste ||
            "Jeg sørger for, at I får tænkt alle de ting igennem, som ansøgningen spørger om, og samler dem i en projektbeskrivelse, I kan bygge jeres egen ansøgning på."}{" "}
          Tre til fire spørgsmål mere.
        </p>
        <p className="font-sans text-[12.5px] text-muted mt-2">
          Forberedelsen er ikke tekst til ansøgningen. Den hjælper jer med at få tankerne igennem og samler de
          informationer, ansøgningen spørger om, struktureret så I let kan skrive den selv.
        </p>
        <div className="flex flex-wrap gap-2.5 mt-4">
          <button type="button" onClick={onFortsaet} className={roed ? btnAmber : btnPrimary}>
            {roed ? "Fortsæt alligevel" : "Ja, fortsæt til forberedelsen"}
          </button>
          <button type="button" onClick={onStop} className={roed ? btnPrimary : btnAmber} disabled={stoppet}>
            {roed ? "Send mig opsummeringen på mail" : "Nej tak, send mig resultatet på mail"}
          </button>
        </div>
      </div>
    </div>
  );
}

function kr(n: number) {
  return `${Math.round(n).toLocaleString("da-DK")} kr.`;
}

function Resultat({
  vurdering: v,
  token,
  cvr,
  virksomhed,
  transcript,
}: {
  vurdering: Vurdering;
  token: string;
  cvr: string;
  virksomhed: string;
  transcript: ChatMsg[];
}) {
  const s = STATUS[v.egnethed.status] ?? STATUS.gul;
  return (
    <div className="border border-rule rounded bg-cream-deep">
      <div className="px-5 py-5 border-b border-rule">
        <span className={`font-mono text-[10.5px] tracking-wider uppercase px-2 py-0.5 border ${s.cls}`}>{s.label}</span>
        <p className="font-serif text-xl mt-3 leading-snug">{v.egnethed.opsummering}</p>
        <ul className="list-disc pl-5 mt-3 space-y-1 font-sans text-[14px] text-ink-soft">
          {v.egnethed.begrundelse.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {v.egnethed.stoppere.length > 0 && (
          <div className="mt-3">
            <p className="font-mono text-[10.5px] tracking-wider uppercase text-red-700">Det der skal afklares</p>
            <ul className="list-disc pl-5 mt-1 space-y-1 font-sans text-[14px] text-ink-soft">
              {v.egnethed.stoppere.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="px-5 py-5 border-b border-rule grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Pulje</p>
          <p className="font-serif text-lg mt-1">{v.pulje.navn}</p>
          <p className="font-sans text-[13.5px] text-ink-soft mt-1">{v.pulje.hvorfor}</p>
        </div>
        <div>
          <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Pointindikation</p>
          <p className="font-serif text-lg mt-1">
            {v.point.potentiale + v.point.kapacitet} af 10
            <span className="font-sans text-[13px] text-muted ml-2">
              (potentiale {v.point.potentiale}, kapacitet {v.point.kapacitet})
            </span>
          </p>
          <p className="font-sans text-[13.5px] text-ink-soft mt-1">{v.point.samlet_indikation}</p>
        </div>
      </div>

      <div className="px-5 py-5 border-b border-rule">
        <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Projektoplæg</p>
        <h3 className="font-serif text-2xl mt-1 leading-tight">{v.projekt.titel}</h3>
        {v.projekt.udgangspunkt && (
          <p className="font-serif text-[16px] italic text-ink-soft mt-2 border-l-2 border-amber-dark pl-3">
            {v.projekt.udgangspunkt}
          </p>
        )}
        <p className="font-sans text-[14px] text-ink-soft mt-2">{v.projekt.formaal}</p>
        {v.projekt.omfang && (
          <p className="font-sans text-[14px] text-ink-soft mt-2">
            <b className="text-ink font-medium">Omfang:</b> {v.projekt.omfang}
          </p>
        )}
        {v.projekt.analysespoergsmaal.length > 0 && (
          <div className="mt-3">
            <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Det analysen skal svare på</p>
            <ul className="list-disc pl-5 mt-1 space-y-1 font-sans text-[13.5px] text-ink-soft">
              {v.projekt.analysespoergsmaal.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {v.projekt.forventet_effekt.length > 0 && (
          <div className="mt-3">
            <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Forventet effekt (til ansøgningen)</p>
            <ul className="list-disc pl-5 mt-1 space-y-1 font-sans text-[13.5px] text-ink-soft">
              {v.projekt.forventet_effekt.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {v.projekt.forankring && (
          <p className="font-sans text-[13.5px] text-ink-soft mt-3">
            <b className="text-ink font-medium">Forankring:</b> {v.projekt.forankring}
          </p>
        )}
        <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted mt-4">Hypoteser analysen tester</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-1.5">
          {v.projekt.kandidater.map((k, i) => (
            <div key={i} className="bg-cream border border-rule rounded px-4 py-3">
              <p className="font-serif text-[16px] font-medium leading-snug">{k.titel}</p>
              <p className="font-sans text-[13px] text-ink-soft mt-1.5">
                <b className="text-ink font-medium">Mulig gevinst:</b> {k.gevinst}
              </p>
              <p className="font-sans text-[13px] text-ink-soft mt-1">
                <b className="text-ink font-medium">Teknologi:</b> {k.teknologi}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 font-sans text-[13.5px]">
          <div className="bg-cream border border-rule rounded px-4 py-3">
            <p className="text-muted text-[11px] uppercase tracking-wider">Forløb i alt (skøn)</p>
            <p className="font-serif text-xl mt-0.5">{kr(v.projekt.estimeret_pris_kr)}</p>
            <p className="text-muted text-[12px]">ca. {v.projekt.estimeret_timer} timer</p>
          </div>
          <div className="bg-cream border border-amber-dark rounded px-4 py-3">
            <p className="text-muted text-[11px] uppercase tracking-wider">Tilskud</p>
            <p className="font-serif text-xl mt-0.5 text-amber-dark">{kr(v.projekt.tilskud_kr)}</p>
            <p className="text-muted text-[12px]">refunderes bagud</p>
          </div>
          <div className="bg-cream border border-rule rounded px-4 py-3">
            <p className="text-muted text-[11px] uppercase tracking-wider">Egenbetaling</p>
            <p className="font-serif text-xl mt-0.5">{kr(v.projekt.egenbetaling_kr)}</p>
            <p className="text-muted text-[12px]">kontant, 1:1</p>
          </div>
        </div>
        <ol className="list-decimal pl-5 mt-4 space-y-1 font-sans text-[13.5px] text-ink-soft">
          {v.projekt.forloeb.map((f, i) => (
            <li key={i}>
              <b className="text-ink font-medium">{f.leverance}:</b> {f.beskrivelse}
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 py-5 border-b border-rule">
        <p className="font-mono text-[10.5px] tracking-wider uppercase text-muted">Næste skridt</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1.5 font-sans text-[14px] text-ink-soft">
          {v.naeste_skridt.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ol>
      </div>

      <LeadForm token={token} cvr={cvr} virksomhed={virksomhed} vurdering={v} kvalificering={null} transcript={transcript} />

      <p className="px-5 py-4 font-sans text-[12px] text-muted border-t border-rule">
        Indikation lavet med AI ud fra dine svar og offentlige CVR-data, ikke en afgørelse. Tjekket er en hjælp til
        at afklare, scope og samle informationer; det er ikke en ansøgningsservice, og ansøgningen skriver I selv.
        Åbenhed: SpAIke er godkendt rådgiver i SMV:Digital og kan være én af de rådgivere, I indhenter tilbud fra;
        puljen kræver, at I sammenligner flere.
      </p>
    </div>
  );
}

function LeadForm({
  token,
  cvr,
  virksomhed,
  vurdering,
  kvalificering,
  transcript,
}: {
  token: string;
  cvr: string;
  virksomhed: string;
  vurdering: Vurdering | null;
  kvalificering: Kvalificering | null;
  transcript: ChatMsg[];
}) {
  const fuld = !!vurdering;
  const status = vurdering?.egnethed.status ?? kvalificering?.status ?? "ukendt";
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [puljeAlarm, setPuljeAlarm] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/tilskud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lead",
          token,
          cvr,
          virksomhed,
          navn,
          email,
          telefon,
          puljeAlarm,
          consent,
          website,
          vurdering,
          kvalificering,
          transcript,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        return;
      }
      setOk(true);
      trackEvent("tilskud_lead_sendt", { status, fase: fuld ? "forberedelse" : "kvalificering", alarm: puljeAlarm ? "ja" : "nej" });
    } catch {
      setError("Forbindelsen fejlede. Prøv igen.");
    } finally {
      setBusy(false);
    }
  }

  if (ok) {
    return (
      <div className="px-5 py-6 bg-cream">
        <p className="font-serif text-xl">Sendt. Tjek din indbakke om et øjeblik.</p>
        <p className="font-sans text-[14px] text-ink-soft mt-2">
          {fuld
            ? "Mailen indeholder hele vurderingen og projektbeskrivelsen, I kan bygge ansøgningen på. Vil du have den gennemgået, inden vinduet åbner, så book 20 minutter."
            : "Mailen indeholder kvalificeringen og næste skridt. Vil I videre, kan I køre forberedelsen her på siden når som helst, eller tage 20 minutter med Michael."}
        </p>
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="book_moede_click"
          data-umami-event-location="tilskud_resultat"
          className={`${btnPrimary} inline-block mt-4`}
        >
          Book 20 minutter med Michael &rarr;
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="px-5 py-6 bg-cream">
      <p className="font-mono text-[10.5px] tracking-wider uppercase text-amber-dark">
        {fuld ? "Få hele vurderingen på mail" : "Få kvalificeringen på mail"}
      </p>
      {fuld ? (
        <>
          <p className="font-serif text-lg mt-1 leading-snug">
            Inklusive projektbeskrivelsen: de informationer, ansøgningen spørger om (udfordring, ambition, projekt,
            nyhedsværdi, rådgivers opgaver, forankring, effekter), samlet og struktureret ud fra jeres egne svar.
          </p>
          <p className="font-sans text-[12.5px] text-muted mt-1.5">
            Det er ikke tekst til ansøgningen, men grundlaget I skriver den ud fra. Ansøgningen skriver I selv, og
            det bekræfter I i den.
          </p>
        </>
      ) : (
        <p className="font-serif text-lg mt-1 leading-snug">
          Resultatet, puljen og næste skridt, så I har det ved hånden, når I vil videre.
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
        <input className={inputCls} placeholder="Navn" value={navn} onChange={(e) => setNavn(e.target.value)} aria-label="Navn" />
        <input
          className={inputCls}
          type="email"
          required
          placeholder="Arbejds-e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail"
        />
        <input
          className={`${inputCls} sm:col-span-2`}
          type="tel"
          placeholder="Telefon (valgfrit)"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          aria-label="Telefon"
        />
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          name="website"
        />
      </div>
      <label className="flex items-start gap-2.5 mt-3 font-sans text-[13px] text-ink-soft">
        <input type="checkbox" checked={puljeAlarm} onChange={(e) => setPuljeAlarm(e.target.checked)} className="mt-1" />
        <span>Send mig en påmindelse, når ansøgningssystemet og vinduet åbner.</span>
      </label>
      <label className="flex items-start gap-2.5 mt-2 font-sans text-[13px] text-ink-soft">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        <span>
          Jeg accepterer, at SpAIke gemmer samtalen og mine kontaktoplysninger for at sende vurderingen og følge
          op. Se{" "}
          <a href="/privatlivspolitik" className="underline underline-offset-2" data-track-event="privatliv_click">
            privatlivspolitikken
          </a>
          .
        </span>
      </label>
      {error && <p className="text-[13px] text-red-700 mt-2">{error}</p>}
      <button type="submit" disabled={busy || !consent || !email} className={`${btnPrimary} mt-4`}>
        {busy ? "Sender …" : "Send mig vurderingen"}
      </button>
    </form>
  );
}

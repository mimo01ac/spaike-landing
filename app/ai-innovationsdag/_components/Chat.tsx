"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseBriefData, ChatMsg } from "../_types";

interface Props {
  token: string;
  initialUserMessage: string;
  onBrief: (brief: CaseBriefData, transcript: ChatMsg[]) => void;
  restoredMessages?: ChatMsg[];
  onMessagesChange?: (messages: ChatMsg[]) => void;
}

export default function Chat({
  token,
  initialUserMessage,
  onBrief,
  restoredMessages,
  onMessagesChange,
}: Props) {
  const hasRestored = !!(restoredMessages && restoredMessages.length > 0);
  const [messages, setMessages] = useState<ChatMsg[]>(hasRestored ? restoredMessages! : []);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const briefedRef = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Genoptaget samtale: send IKKE intro-beskeden igen.
    if (hasRestored) return;
    void send(initialUserMessage, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistér samtalen (op til parent -> localStorage) så et reload ikke taber den.
  useEffect(() => {
    onMessagesChange?.(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string, hideUser = false) {
    if (busy) return;
    setError(null);
    setBusy(true);

    const history: ChatMsg[] = [...messages, { role: "user", content: text }];
    // Skjul den syntetiske intro-besked i UI'et, men send den til modellen.
    setMessages(hideUser ? messages : history);

    try {
      const res = await fetch("/api/innovationsdag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Der opstod en fejl. Prøv igen.");
        setBusy(false);
        return;
      }

      // Tilføj en tom assistant-besked vi streamer ind i.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: { type: string; text?: string; brief?: CaseBriefData; error?: string };
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
          } else if (evt.type === "brief" && evt.brief && !briefedRef.current) {
            briefedRef.current = true;
            const finalMsgs: ChatMsg[] = [
              ...history,
              { role: "assistant", content: assistantText || "Jeg har samlet din case-brief." },
            ];
            onBrief(evt.brief, finalMsgs);
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    void send(text);
  }

  return (
    <div className="max-w-2xl mx-auto border border-rule rounded bg-cream overflow-hidden">
      <div
        ref={scrollRef}
        className="h-[460px] overflow-y-auto px-5 py-6 space-y-5"
        aria-live="polite"
      >
        {messages.length === 0 && busy && (
          <p className="text-muted text-sm italic">Innovationsdag-guiden tænker …</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] bg-ink text-cream rounded-lg rounded-br-sm px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap"
                  : "max-w-[90%] text-ink text-[15px] leading-relaxed whitespace-pre-wrap"
              }
            >
              {m.content || (m.role === "assistant" && busy ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="px-5 py-2 text-[13px] text-red-700 border-t border-rule">{error}</p>
      )}

      <form onSubmit={onSubmit} className="border-t border-rule p-3 flex gap-2 bg-cream-deep">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder="Skriv dit svar …"
          className="flex-1 bg-cream border border-rule rounded px-3.5 py-2.5 text-ink focus:border-amber-dark focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="bg-amber text-ink px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-amber-dark hover:text-cream transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

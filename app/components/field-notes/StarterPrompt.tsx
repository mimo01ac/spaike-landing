"use client";

import { useRef, useState } from "react";
import { trackEvent } from "../track";

interface Props {
  summary: string;
  note?: React.ReactNode;
  prompt: string;
  name?: string;
}

export default function StarterPrompt({ summary, note, prompt, name }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      trackEvent("starter_prompt_copy", { name: name ?? summary });
      setTimeout(() => setCopied(false), 1600);
    } catch {
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNode(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        document.execCommand("copy");
        setCopied(true);
        trackEvent("starter_prompt_copy", { name: name ?? summary });
        setTimeout(() => setCopied(false), 1600);
      }
    }
  }

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="my-7 border border-rule rounded bg-cream-deep overflow-hidden"
    >
      <summary
        className={`flex items-center justify-between px-5 py-3.5 cursor-pointer select-none font-mono text-[11px] tracking-wider uppercase text-amber-dark font-medium list-none ${
          open ? "border-b border-rule" : ""
        }`}
      >
        {summary}
        <span className="text-base text-amber-dark">{open ? "−" : "+"}</span>
      </summary>
      <div className="px-5 pb-5">
        {note && (
          <p className="text-[13px] text-muted my-4 leading-relaxed">{note}</p>
        )}
        <div className="relative bg-ink text-cream font-mono text-[12px] leading-[1.55] py-[18px] px-5 rounded-sm overflow-x-auto whitespace-pre-wrap break-words">
          <button
            onClick={copy}
            className="absolute top-3 right-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream border-0 px-2.5 py-1 rounded-sm font-mono text-[10px] tracking-wider uppercase font-medium cursor-pointer transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <code ref={codeRef} className="text-cream font-mono">
            {prompt}
          </code>
        </div>
      </div>
    </details>
  );
}

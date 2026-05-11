import { ReactNode } from "react";

type WordmarkSize = "sm" | "md" | "lg" | "xl" | "hero";

const wordmarkSizes: Record<WordmarkSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-5xl md:text-6xl",
  hero: "text-5xl md:text-7xl",
};

export function SpaikeWordmark({
  size = "md",
  inverted = false,
}: {
  size?: WordmarkSize;
  inverted?: boolean;
}) {
  return (
    <span
      className={`${wordmarkSizes[size]} font-sans font-bold tracking-tight leading-none inline-flex items-baseline ${
        inverted ? "text-cream" : "text-ink"
      }`}
    >
      <span>Sp</span>
      <span className="text-amber">AI</span>
      <span>ke</span>
    </span>
  );
}

export function SectionLabel({
  children,
  inverted = false,
}: {
  children: ReactNode;
  inverted?: boolean;
}) {
  return (
    <p
      className={`font-mono text-[11px] tracking-widest uppercase mb-4 ${
        inverted ? "text-amber" : "text-muted"
      }`}
    >
      — {children}
    </p>
  );
}

export function Dateline({
  left,
  mid,
  right,
}: {
  left: string;
  mid: string;
  right: string;
}) {
  return (
    <div className="flex justify-between px-6 md:px-14 py-3.5 font-mono text-[10px] tracking-widest uppercase text-muted border-b border-rule">
      <span>{left}</span>
      <span className="hidden md:inline">{mid}</span>
      <span className="text-right">{right}</span>
    </div>
  );
}

export function Pager({
  n,
  of,
  next,
  inverted = false,
}: {
  n: string;
  of: string;
  next: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`flex justify-between px-6 md:px-14 py-5 font-mono text-[10px] tracking-widest uppercase ${
        inverted
          ? "border-t border-rule-dark text-amber/70"
          : "border-t border-rule text-muted"
      }`}
    >
      <span>
        Side {n} / {of}
      </span>
      <span className="hidden md:inline">Spiken er i kombinationen · AI + Commercial</span>
      <span className="text-right">Næste → {next}</span>
    </div>
  );
}

export function DoubleRule({ inverted = false }: { inverted?: boolean }) {
  const color = inverted ? "border-rule-dark" : "border-rule";
  return (
    <div className={`relative ${color} border-t`}>
      <div className={`absolute left-0 right-0 ${color} border-t`} style={{ top: 4 }} />
    </div>
  );
}

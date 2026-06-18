"use client";

export default function PrintButton({ label = "Download som PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print border border-rule rounded px-4 py-2 font-mono text-[11px] tracking-wider uppercase text-ink hover:border-amber-dark hover:text-amber-dark transition-colors"
    >
      {label}
    </button>
  );
}

"use client";

import { useState } from "react";

interface Item {
  titel: string;
  tekst: string;
}

function Row({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-rule first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-3.5 text-left group"
      >
        <span className="font-serif text-lg text-ink group-hover:text-amber-dark transition-colors">
          {item.titel}
        </span>
        <span className="text-amber-dark text-xl leading-none shrink-0 w-5 text-center">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="text-[15px] text-ink-soft leading-relaxed pb-4 pr-9 -mt-1">{item.tekst}</p>
      )}
    </div>
  );
}

export default function ValueAccordion({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item) => (
        <Row key={item.titel} item={item} />
      ))}
    </div>
  );
}

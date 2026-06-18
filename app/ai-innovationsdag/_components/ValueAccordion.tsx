"use client";

import { useState } from "react";

interface Item {
  titel: string;
  tekst: string;
}

interface Group {
  label: string;
  items: Item[];
}

/**
 * Værdi-accordion. Ét klik på et hvilket som helst plus folder ALLE punkter ud
 * på én gang (fælles open-state på tværs af begge spalter); klik igen lukker
 * alle. Lader en interesseret læser åbne hele sektionen med ét klik.
 */
export default function ValueAccordion({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-5">
            {g.label}
          </p>
          {g.items.map((item) => (
            <div key={item.titel} className="border-t border-rule first:border-t-0">
              <button
                type="button"
                onClick={toggle}
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
                <p className="text-[15px] text-ink-soft leading-relaxed pb-4 pr-9 -mt-1">
                  {item.tekst}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

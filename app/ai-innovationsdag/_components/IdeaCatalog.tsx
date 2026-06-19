"use client";

import { useState } from "react";
import { IDEAS, IDEA_CATEGORIES, type IdeaCategory } from "../_data/ideas";

type Filter = "Alle" | IdeaCategory;

export default function IdeaCatalog() {
  const [filter, setFilter] = useState<Filter>("Alle");
  const chips: Filter[] = ["Alle", ...IDEA_CATEGORIES];
  const items = filter === "Alle" ? IDEAS : IDEAS.filter((i) => i.kategori === filter);

  return (
    <div>
      {/* Kategori-selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {chips.map((c) => {
          const active = c === filter;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase border transition-colors ${
                active
                  ? "bg-ink text-cream border-ink"
                  : "bg-cream text-ink-soft border-rule hover:border-amber-dark hover:text-amber-dark"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Kort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((idea) => (
          <div
            key={idea.titel}
            className="border border-rule rounded bg-cream p-5 flex flex-col"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-amber-dark">
                {idea.kategori}
              </span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-muted shrink-0">
                {idea.byggetid}
              </span>
            </div>
            <h3 className="font-serif text-lg text-ink leading-snug mb-2">{idea.titel}</h3>
            <p className="text-[14px] text-ink-soft leading-relaxed flex-1">{idea.beskrivelse}</p>
            <p className="text-[13px] text-ink mt-3 pt-3 border-t border-rule">
              <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                Udbytte:{" "}
              </span>
              {idea.udbytte}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

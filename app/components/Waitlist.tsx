"use client";

import { useState } from "react";
import { SectionLabel, Pager, DoubleRule, SpaikeWordmark } from "./EditorialUI";

export default function Waitlist() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO (SPA-461): wire up til Airtable + Brevo via server action
    setSubmitted(true);
  }

  return (
    <section id="waitlist">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 px-6 md:px-14 pt-16 pb-14">
        {/* LEFT — copy */}
        <div className="flex flex-col gap-6">
          <SectionLabel>Sektion VI · Beta-launch maj 2026</SectionLabel>
          <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight">
            <em className="italic font-normal text-amber-dark">10</em> gratis
            Discovery-spots.
          </h2>
          <p className="font-serif text-lg leading-relaxed text-ink-soft max-w-md">
            De første 10 virksomheder får en gratis <SpaikeWordmark size="sm" />{" "}
            Discovery-kørsel + en personlig 30-minutters opsamling. Til gengæld
            beder vi om 15 minutters feedback når I har set rapporten.
          </p>
          <div className="mt-3 px-5 py-5 bg-white border border-rule border-l-4 border-l-amber">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-2">
              Udvælgelses-kriterier
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-ink-soft">
              50–500 ansatte · dansk virksomhed · kommercielle eller videnstunge
              processer. Ingen pharma, finans eller offentlig sektor i Phase 1.
            </p>
          </div>
        </div>

        {/* RIGHT — form */}
        {submitted ? (
          <div className="bg-white border border-rule p-8 self-start">
            <p className="font-serif text-2xl font-medium mb-3">
              Tak — vi har modtaget din tilmelding.
            </p>
            <p className="font-sans text-base text-ink-soft">
              Jeg vender personligt tilbage inden for et par hverdage.
            </p>
            <p className="font-mono text-xs tracking-widest uppercase text-muted mt-4">
              — Michael
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 self-start"
          >
            <UnderlineField name="name" label="Navn*" placeholder="Fornavn Efternavn" required />
            <UnderlineField name="company" label="Firma*" placeholder="ACME ApS" required />
            <UnderlineField name="role" label="Rolle / titel*" placeholder="CEO / COO" required />
            <UnderlineSelect
              name="employees"
              label="Antal ansatte*"
              required
              options={[
                { value: "", label: "Vælg…" },
                { value: "lt-50", label: "Under 50" },
                { value: "50-100", label: "50–100" },
                { value: "100-250", label: "100–250" },
                { value: "250-500", label: "250–500" },
                { value: "gt-500", label: "Over 500" },
              ]}
            />
            <div className="md:col-span-2">
              <UnderlineField name="email" label="Email*" placeholder="navn@firma.dk" type="email" required />
            </div>
            <div className="md:col-span-2">
              <UnderlineField name="problem" label="Hvilken proces har I i tankerne?" placeholder="Kort beskrivelse — valgfrit" />
            </div>
            <button
              type="submit"
              className="md:col-span-2 mt-3 bg-ink text-cream py-4 font-sans text-sm font-medium hover:bg-ink/85 transition-colors"
            >
              Kom på waitlist →
            </button>
          </form>
        )}
      </div>

      <Pager n="06" of="06" next="Kolofon" />
    </section>
  );
}

function UnderlineField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-transparent border-0 border-b border-rule py-2.5 font-serif text-lg text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors"
      />
    </label>
  );
}

function UnderlineSelect({
  name,
  label,
  options,
  required = false,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
        {label}
      </span>
      <select
        name={name}
        required={required}
        className="bg-transparent border-0 border-b border-rule py-2.5 font-serif text-lg text-ink focus:outline-none focus:border-ink transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

"use client";

import { useState } from "react";

export default function Waitlist() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO (SPA-461): wire up til Airtable + Brevo via server action
    setSubmitted(true);
  }

  return (
    <section
      id="waitlist"
      className="bg-background-secondary py-20 md:py-28 border-t border-neutral-200"
    >
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase mb-3 text-center">
          Beta-launch maj 2026
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-center">
          10 gratis Discovery-spots.
        </h2>
        <p className="text-lg text-neutral-700 leading-relaxed mb-10 text-center max-w-2xl mx-auto">
          De første 10 virksomheder får en gratis SpAIke Discovery-kørsel + en
          personlig 30-minutters opsamling. Til gengæld beder vi om 15 minutters
          feedback når I har set rapporten.
        </p>

        {submitted ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center">
            <p className="text-xl font-semibold mb-2">Tak — vi har modtaget din tilmelding.</p>
            <p className="text-neutral-600">
              Jeg vender personligt tilbage inden for et par hverdage.
            </p>
            <p className="text-sm text-neutral-500 mt-4">— Michael</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field name="name" label="Navn" type="text" required />
              <Field name="company" label="Firma" type="text" required />
              <Field name="role" label="Rolle / titel" type="text" required />
              <SelectField
                name="employees"
                label="Antal ansatte"
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
            </div>
            <Field name="email" label="Email" type="email" required />
            <TextAreaField
              name="problem"
              label="Hvilken proces har I i tankerne?"
              placeholder="Valgfrit — kort beskrivelse"
            />
            <button
              type="submit"
              className="w-full bg-spaike-blue hover:bg-spaike-blue-dark text-black font-semibold px-8 py-4 rounded-lg transition-colors text-base md:text-lg"
            >
              Kom på waitlist →
            </button>
            <p className="text-xs text-neutral-500 text-center leading-relaxed">
              Vi udvælger virksomheder der matcher vores målgruppe — 50–500 ansatte,
              dansk virksomhed, kommercielle eller videnstunge processer. Ingen pharma,
              finans eller offentlig sektor i Phase 1.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type,
  required = false,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-spaike-blue-dark ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spaike-blue focus:border-spaike-blue transition"
      />
    </div>
  );
}

function SelectField({
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
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-spaike-blue-dark ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spaike-blue focus:border-spaike-blue transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spaike-blue focus:border-spaike-blue transition resize-none"
      />
    </div>
  );
}

import { SectionLabel, Pager, DoubleRule } from "./EditorialUI";

const categories = [
  {
    n: "01",
    title: "Når kundeservice ikke kan følge med",
    body: "AI på indbakker, chatbots, voice agents. Færre admin-timer, kortere svartider, konsistent kvalitet.",
  },
  {
    n: "02",
    title: "Når sælgerne bruger mere tid på CRM end på kunder",
    body: "CRM-automation, pitch-assistenter, lead-routing. Mere tid til kundekontakt, mindre tid på admin.",
  },
  {
    n: "03",
    title: "Når viden ligger låst i jeres systemer",
    body: "Søgning i jeres egen dokumentation, automatisk sagsoprettelse, intern AI-assistent.",
  },
  {
    n: "04",
    title: "Når processer kører manuelt fra produktion til levering",
    body: "Workflow-automation, kategorisering, end-to-end flows fra produktion til færdigvare.",
  },
];

export default function WhatWeBuild() {
  return (
    <section id="hvad-vi-bygger">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel>Sektion II · Hvad vi bygger</SectionLabel>
        <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight max-w-4xl">
          AI-automation hvor jeres virksomhed{" "}
          <em className="italic font-normal">sidder fast.</em>
        </h2>
        <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
          Hvad det bliver for jer afhænger af jeres Discovery-rapport. Vi har
          leveret alle fire kategorier hos eksisterende klienter.
        </p>
      </div>

      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-rule">
        {categories.map((c, i) => (
          <div
            key={c.n}
            className={`px-6 md:px-7 py-8 flex flex-col gap-3.5 min-h-[280px] ${
              i > 0 ? "border-t md:border-t-0 lg:border-l border-rule" : ""
            } ${i > 0 && i < 4 ? "md:border-l" : ""}`}
          >
            <div className="font-mono text-[11px] text-amber-dark tracking-wider">
              {c.n}
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-medium leading-[1.15]">
              {c.title}
            </h3>
            <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">
              {c.body}
            </p>
          </div>
        ))}
      </div>

      <Pager n="02" of="06" next="Cases" />
    </section>
  );
}

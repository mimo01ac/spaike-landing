const categories = [
  {
    title: "Kundeservice-automation",
    body: "AI på indbakker, chatbots, voice agents. Færre admin-timer, kortere svartider, konsistent kvalitet.",
  },
  {
    title: "Salgs-acceleration",
    body: "CRM-automation, pitch-assistenter, lead-routing. Mere tid til kundekontakt, mindre tid på admin.",
  },
  {
    title: "Videns-arbejde",
    body: "Søgning i jeres egen dokumentation, automatisk sagsoprettelse, intern AI-assistent. Viden bliver brugbar.",
  },
  {
    title: "Ops & proces-digitalisering",
    body: "Workflow-automation, kategorisering, end-to-end flows fra produktion til færdigvare.",
  },
];

export default function WhatWeBuild() {
  return (
    <section
      id="hvad-vi-bygger"
      className="py-20 md:py-28 border-t border-neutral-200"
    >
      <div className="max-w-content mx-auto px-6">
        <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase mb-3">
          Hvad vi bygger
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-3xl">
          AI-automation hvor jeres virksomhed sidder fast.
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl leading-relaxed mb-12 md:mb-16">
          Hvad det bliver for jer afhænger af jeres Discovery-rapport. Vi har
          leveret alle fire kategorier hos eksisterende klienter.
        </p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-spaike-blue font-bold text-sm tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                  {cat.title}
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed pl-9">
                {cat.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

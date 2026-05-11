const steps = [
  {
    num: "1",
    title: "Tilmeld",
    body: "Vi sætter Discovery op til jeres virksomhed (15 min).",
  },
  {
    num: "2",
    title: "Interviews",
    body: "3-5 medarbejdere har en kort AI-samtale om hverdagen (15-20 min hver).",
  },
  {
    num: "3",
    title: "Handlingsplan",
    body: "I får en konkret rapport med 3-5 prioriterede automation-muligheder på 48 timer.",
  },
];

export default function DiscoveryCTA() {
  return (
    <section
      id="discovery"
      className="bg-background-secondary py-20 md:py-28 border-y border-neutral-200"
    >
      <div className="max-w-content mx-auto px-6 text-center">
        <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase mb-3">
          Sådan starter vi
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Start med 48 timers klarhed.
        </h2>
        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
          SpAIke Discovery er vores gratis assessment-værktøj. Det interviewer
          3-5 medarbejdere via AI-samtaler, analyserer hvor tiden går, og
          leverer en konkret handlingsplan med 3-5 prioriterede
          automation-muligheder på 48 timer.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16 text-left">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-neutral-200 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-spaike-blue text-black font-bold flex items-center justify-center mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <a
          href="https://assessment.spaike.dk"
          className="inline-block bg-spaike-blue hover:bg-spaike-blue-dark text-black font-semibold px-8 py-4 rounded-lg transition-colors text-base md:text-lg"
        >
          Kør gratis Discovery →
        </a>
        <p className="text-sm text-neutral-500 mt-6">
          Gratis i opstartsfasen for vores første 10 partnere. Ingen sælger på linjen.
        </p>
      </div>
    </section>
  );
}

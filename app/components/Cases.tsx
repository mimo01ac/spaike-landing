const cases = [
  {
    name: "JUC Service ApS",
    industry: "Dansk juridisk uddannelsesvirksomhed",
    body: "Email Agent på 7 parallelle kundeservice-indbakker. Salgsportal i Microsoft Teams. AI-drevet søgning i 10+ års juridisk indhold gjort tilgængeligt for medarbejderne.",
  },
  {
    name: "Audiovox",
    industry: "Audio og elektronik",
    body: "Digitaliseret reklamationsflow og hele ordreprocessen — fra produktionsgulvet til færdigvare. Eliminerer manuelle hand-offs.",
  },
  {
    name: "WePlan",
    industry: "Rådgivende ingeniørvirksomhed",
    body: "Sagsoprettelses-modul der parser indgående henvendelser og opretter sager automatisk i deres system. Fjerner admin-friktion i opstartsfasen.",
  },
];

export default function Cases() {
  return (
    <section
      id="cases"
      className="bg-background-secondary py-20 md:py-28 border-y border-neutral-200"
    >
      <div className="max-w-content mx-auto px-6">
        <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase mb-3">
          Vi har leveret for
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
          Tre aktive engagementer på tværs af brancher.
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl leading-relaxed mb-12 md:mb-16">
          Legal education, audio/elektronik, rådgivende ingeniør — multi-workstream
          på alle. Du finder hver case beskrevet nedenfor.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <article
              key={c.name}
              className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-7 flex flex-col"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                <p className="text-sm text-spaike-blue-dark font-medium">
                  {c.industry}
                </p>
              </div>
              <p className="text-neutral-700 leading-relaxed flex-1">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

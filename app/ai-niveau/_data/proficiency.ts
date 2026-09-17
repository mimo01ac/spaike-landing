/**
 * Datalag + scoring for AI Proficiency Snapshot (Trin 1).
 *
 * Rent, deterministisk og uden UI/DOM, så scoringen kan CLI-testes og
 * genbruges server-side. Porteret fra prototypen (spaike-pa, verificeret
 * 2026-09-14). Trin 2 (skræddersyet plan) ligger i /api/ai-niveau/plan.
 */

export type AreaKey = "p" | "v" | "w" | "a" | "k";
export type EnvKey = "copilot" | "aaben" | "begge";
export type BlockEnv = "begge" | "copilot" | "aaben";

/** De fem kompetence-områder svageste-område udregnes på. */
export const AREA: Record<AreaKey, string> = {
  p: "Prompting",
  v: "Værktøjskendskab",
  w: "Workflow & integration",
  a: "Automation & agenter",
  k: "Kritisk & etisk brug",
};

export interface Question {
  /** Område. "i"/"m" tæller i totalen, men ikke i svageste-område (bevidst). */
  area: AreaKey | "i" | "m";
  t: string;
  o: [string, string, string, string];
}

export const QUESTIONS: Question[] = [
  { area: "p", t: "Når du beder AI om noget, hvordan gør du typisk?", o: ["Skriver et kort spørgsmål og tager det jeg får", "Giver lidt kontekst og beder om et bestemt format", "Giver rolle, kontekst, eksempler og præciserer tone/længde", "Bygger genbrugelige prompt-skabeloner jeg finjusterer"] },
  { area: "p", t: "Hvis svaret ikke er godt nok, hvad gør du?", o: ["Giver op eller retter det i hånden", "Omformulerer spørgsmålet", "Beder den kritisere/forbedre sit eget svar", "Kæder trin sammen i en frem-og-tilbage-proces"] },
  { area: "v", t: "Hvilke AI-værktøjer bruger du?", o: ["Mest ChatGPT (gratis), af og til", "ChatGPT/Claude/Gemini fast, evt. betalt", "Flere specialiserede (transskription, billede, research, kode)", "Kombinerer værktøjer + API'er/MCP + egne opsætninger"] },
  { area: "v", t: "Hvor opdateret er du på nye modeller og værktøjer?", o: ["Følger ikke rigtig med", "Hører om det via nyheder/venner", "Følger aktivt nogle kilder og prøver nyt", "Tester systematisk og vurderer hvad der flytter noget"] },
  { area: "w", t: "Bruger du AI i faste arbejdsgange?", o: ["Nej, kun ad hoc", "Til enkelte tilbagevendende opgaver", "Bygget ind i flere af mine faste processer", "Mine kerneprocesser er designet med AI som fast del"] },
  { area: "w", t: "Genbruger du dit AI-arbejde?", o: ["Nej, starter forfra hver gang", "Gemmer gode prompts i en note", "Har skabeloner/biblioteker jeg trækker på", "Delte, versionerede skabeloner + en vidensbase AI trækker fra"] },
  { area: "a", t: "Får du AI til at arbejde uden du sidder ved siden af?", o: ["Nej, altid manuelt", "Har prøvet at planlægge/schedulere noget", "Kører nogle automatiseringer (no-code)", "Bygger/kører agenter der løser opgaver semi-selvstændigt"] },
  { area: "a", t: "Kobler du AI sammen med dine data og systemer?", o: ["Nej", "Kopierer manuelt data ind i AI", "Kobler enkelte systemer sammen", "AI læser/skriver i mine systemer via integrationer/agenter"] },
  { area: "k", t: "Hvordan forholder du dig til AI's svar?", o: ["Stoler stort set på det", "Læser det kritisk", "Verificerer vigtige ting mod kilder", "Faste tjek + ved hvornår AI må/ikke må bruges"] },
  { area: "k", t: "Hvordan håndterer du data og fortrolighed?", o: ["Tænker ikke over det", "Undgår det mest følsomme", "Ved hvilke data der ikke må ind, bruger passende værktøjer", "Klare regler + sikre/EU-opsætninger hvor det kræves"] },
  { area: "i", t: "Hvad bruger du mest AI til?", o: ["Enkle spørgsmål og tekster", "Skrivning, research, opsummering", "Analyse, beslutningsstøtte, bygge ting", "Automatisere hele opgaver der før tog timer"] },
  { area: "m", t: "Hvordan ser du AI i dit arbejde?", o: ["Et sjovt værktøj af og til", "En hjælper der sparer lidt tid", "En fast medarbejder i mange opgaver", "En platform jeg bygger min måde at arbejde på oven på"] },
];

export interface Level {
  min: number;
  name: string;
  snap: string;
}

export const LEVELS: Level[] = [
  { min: 12, name: "Den Nysgerrige", snap: "Du er godt i gang, men bruger AI usystematisk og manuelt." },
  { min: 21, name: "Den Daglige bruger", snap: "AI er en fast hjælper, men stadig manuelt, én ting ad gangen." },
  { min: 31, name: "Workflow-byggeren", snap: "Du har bygget AI ind i dine arbejdsgange. Næste skridt er at få det til at køre selv." },
  { min: 41, name: "Agent-orkestratoren", snap: "Du er blandt de få der får AI til at arbejde for dig. Forspringet skal bruges." },
];

export const MAX_SCORE = QUESTIONS.length * 4; // 48

export interface Block {
  n: string;
  env: BlockEnv;
  job: string;
  steps: string[];
  ex: string;
  team: string;
}

/** Fire klynger, indekseret efter niveau (0-3). Hver klynge er "kom et trin op". */
export const BLOCKS: Block[][] = [
  [
    { n: "Genbrugelig prompt-skabelon", env: "begge", job: "Stop med at starte forfra: en fast struktur du genbruger.", steps: ["Tag en opgave du laver tit (fx skrive en kundemail).", "Skriv én prompt med fast struktur: rolle + kontekst + hvad du vil have + format.", "Gem den et sted du let finder den, og genbrug den næste gang."], ex: "Prøv: 'Du er min salgsassistent. Her er kundens mail: [indsæt]. Skriv et venligt svar på max 5 linjer der foreslår et møde.' Kør den på en rigtig mail du har liggende.", team: "Delt skabelon-bibliotek, så alle i teamet skriver lige godt." },
    { n: "Opsummer & udtræk fra dokumenter", env: "begge", job: "Læs en rapport/PDF/mailtråd og få det vigtigste ud.", steps: ["Åbn ChatGPT/Claude (eller Copilot i Word) og læg dokumentet ind.", "Bed om præcis det du skal bruge: 'Giv mig de 5 vigtigste punkter, tal og risici.'", "Bed den lave det som en fast liste, så du får samme format hver gang."], ex: "Dummy: læg en 10-siders PDF ind og bed om 'fem punkter en travl chef skal kende'. Prøv det bagefter på en rapport fra din egen hverdag.", team: "Fælles 'sådan opsummerer vi rapporter'-skabelon." },
    { n: "Skriv & omskriv i din tone", env: "begge", job: "Mails, referater og opslag hurtigere og i en fast tone.", steps: ["Find tre tekster du selv har skrevet i din tone.", "Giv dem til AI'en: 'Skriv i samme stil som disse.'", "Bed den omskrive din næste mail eller dit næste opslag i den tone."], ex: "Prøv: indsæt tre af dine egne LinkedIn-opslag og bed den skrive et nyt om samme emne i din stil.", team: "Delt tone-of-voice-guide AI'en følger." },
  ],
  [
    { n: "Dokument → struktureret data", env: "begge", job: "Træk tal og felter ud af dokumenter til en Excel-klar tabel.", steps: ["Læg dokumentet ind (rapport, faktura, tilbud).", "Bed om en tabel: 'Træk leverandør, dato, beløb og moms ud i en tabel jeg kan kopiere til Excel.'", "Kopiér tabellen direkte ind i Excel eller Sheets."], ex: "Dummy: tag tre fiktive fakturaer og bed om én samlet tabel. Prøv det så på dine egne bilag fra sidste måned.", team: "Delt udtræks-skabelon for afdelingens dokumenttype." },
    { n: "Møde → noter + opgaver", env: "begge", job: "Fra transskription til beslutninger, to-dos og opfølgning.", steps: ["Slå møde-noter til (Copilot i Teams, ellers Fireflies/Otter).", "Efter mødet: bed om 'beslutninger + hvem gør hvad + deadlines'.", "Kopiér opgaverne over i din opgaveliste."], ex: "Prøv på dit næste rigtige møde, eller optag en to-minutters test-snak og se hvor godt referatet rammer.", team: "Fælles møde-note-format, så referater ser ens ud." },
    { n: 'Vidensbase / "brain" AI trækker fra', env: "begge", job: "Få AI til at svare ud fra JERES egne dokumenter.", steps: ["Saml de 10 vigtigste dokumenter (processer, priser, FAQ) ét sted.", "Læg dem i et Claude/ChatGPT Project (eller en Copilot-agent på SharePoint).", "Stil spørgsmål og lad AI'en svare ud fra dokumenterne, ikke bare generelt."], ex: "Prøv: læg jeres prisliste + leveringsbetingelser ind og spørg 'hvad koster produkt X med levering til Jylland?'", team: "Fælles company brain, så viden ligger centralt (ikke 15 private instanser)." },
  ],
  [
    { n: "Planlagt/ugentligt brief", env: "begge", job: "En agent samler kilder og skriver et fast brief for dig.", steps: ["Byg brief'et manuelt én gang: hvilke kilder, hvilket format.", "Læg det i en flow (Copilot Studio, ellers n8n/Make/Zapier).", "Sæt tidsplan: kør hver mandag kl. 7 og send til din mail."], ex: "Prøv: lav i hånden ét mandags-brief med ugens vigtigste i din branche. Når formatet sidder, automatisér det.", team: "Ét afdelings-brief i stedet for at alle laver deres eget." },
    { n: "Trigger-drevet handling", env: "begge", job: "Når noget sker, gør AI'en næste skridt automatisk.", steps: ["Vælg ét 'når-så': fx 'når en ny kunde-mail lander → udkast et svar'.", "Byg det i Power Automate (Copilot) eller Make/Zapier.", "Læg et menneske-tjek ind før noget sendes."], ex: "Prøv: 'når en faktura lander i indbakken → træk beløbet ud → skriv det i et regneark.'", team: "Delt automatiserings-bibliotek for teamet." },
    { n: "Indbakke-triage-agent", env: "begge", job: "Sortér, opsummer og foreslå svar på indgående mails.", steps: ["Lad AI kategorisere mails (haster / kan vente / nyhedsbrev).", "Bed den udkaste svar på de vigtige (du sender selv).", "Byg faste svar-skabeloner til de tilbagevendende typer."], ex: "Prøv: tag 10 mails fra din indbakke, bed AI'en sortere dem og udkaste svar på de tre vigtigste.", team: "Delt triage-logik + svar-skabeloner for fælles postkasser." },
    { n: "Data ind/ud via integration", env: "aaben", job: "AI læser og skriver i dine systemer (CRM, regneark, mail).", steps: ["Vælg ét system at koble på.", "Brug MCP/API så AI'en kan læse derfra.", "Start read-only, tilføj skrivning med et menneske-tjek."], ex: "Prøv: lad AI'en læse dine åbne deals fra CRM'et og skrive et dagligt overblik til dig.", team: "Fælles, sikre integrationer i stedet for private hacks." },
  ],
  [
    { n: "Delt skill/agent for afdelingen", env: "begge", job: "Din opsætning bliver standard for hele teamet.", steps: ["Tag din bedste arbejdsgang og skriv den ned som en fast opskrift.", "Pak den som en delt skill (Copilot Studio / Claude skill).", "Del den, så alle bruger samme, i stedet for hver sin version."], ex: "Prøv: gør din rapport-skabelon til en knap alle i afdelingen kan trykke på.", team: "Central ejerskab, så viden kodificeres ét sted." },
    { n: "Eval- og learning-loop", env: "aaben", job: "Agenten bliver bedre over tid via feedback, ikke statisk.", steps: ["Log hver gang agenten rammer forkert.", "Gennemgå loggen ugentligt og ret opskriften/prompten.", "Mål om det bliver bedre over tid."], ex: "Prøv: en simpel note hvor du skriver 'god/dårlig' på hvert output og justerer derefter.", team: "Fælles kvalitets-loop på tværs af teamets agenter." },
    { n: "Governance & sikkerhed", env: "begge", job: "Styr på hvilke data der må bruges når det bliver kritisk.", steps: ["Skriv hvilke data der ALDRIG må i AI (person/følsomt).", "Vælg sikker/EU-opsætning hvor det kræves.", "Giv roller: hvem må hvad."], ex: "Prøv: lav et halv-sides regel-ark alle i teamet kender og følger.", team: "Fælles politik alle agenter følger." },
  ],
];

export interface ScoreResult {
  levelIndex: number; // 0-3
  levelNo: number; // 1-4
  level: Level;
  total: number;
  maxScore: number;
  weakKey: AreaKey;
  weakName: string;
  blocks: Block[];
}

/**
 * Ren scoring: 12 svar (hvert 1-4) + miljø → niveau, svageste område og de
 * relevante blokke (filtreret på miljø). Kaster ved ugyldigt input.
 */
export function scoreAnswers(answers: number[], env: EnvKey): ScoreResult {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`Forventede ${QUESTIONS.length} svar, fik ${answers.length}.`);
  }
  if (answers.some((a) => !Number.isInteger(a) || a < 1 || a > 4)) {
    throw new Error("Hvert svar skal være et heltal mellem 1 og 4.");
  }

  const total = answers.reduce((a, b) => a + b, 0);

  let levelIndex = 0;
  for (let k = LEVELS.length - 1; k >= 0; k--) {
    if (total >= LEVELS[k].min) {
      levelIndex = k;
      break;
    }
  }

  // Svageste område: kun de fem navngivne (i/m tæller i totalen, ikke her).
  const buckets: Record<AreaKey, number[]> = { p: [], v: [], w: [], a: [], k: [] };
  QUESTIONS.forEach((q, i) => {
    if (q.area in buckets) buckets[q.area as AreaKey].push(answers[i]);
  });
  let weakKey: AreaKey = "p";
  let weakAvg = Infinity;
  (Object.keys(buckets) as AreaKey[]).forEach((key) => {
    const arr = buckets[key];
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (avg < weakAvg) {
      weakAvg = avg;
      weakKey = key;
    }
  });

  const cluster = BLOCKS[Math.min(levelIndex, 3)];
  const blocks = cluster.filter((b) => b.env === "begge" || env === "begge" || b.env === env);

  return {
    levelIndex,
    levelNo: levelIndex + 1,
    level: LEVELS[levelIndex],
    total,
    maxScore: MAX_SCORE,
    weakKey,
    weakName: AREA[weakKey],
    blocks,
  };
}

export const ENV_LABEL: Record<EnvKey, string> = {
  copilot: "Microsoft Copilot",
  aaben: "fri stak",
  begge: "dit miljø",
};

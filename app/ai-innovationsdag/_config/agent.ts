/**
 * AI-innovationsdag discovery-agent — central config.
 *
 * ALT redigerbart for agenten samlet her: system-prompt, brief-schema (som
 * tool), model og samtale-grænser. Rediger denne fil for at justere agentens
 * adfærd — rør ikke route-logikken.
 *
 * Beslutninger (jf. build-brief §0/§5):
 *  - Kundevendt navn er ALTID "AI-innovationsdag", aldrig "hackathon".
 *  - SpAIke er solo → jeg-form. "vi" kun når det = Michael + kunden.
 *  - Model: Haiku 4.5 til interview-turene (billigt, rigeligt til guidet
 *    interview). Prompt caching på system-prompt + historik.
 */

import type Anthropic from "@anthropic-ai/sdk";

/** Claude-model til interview-turene. Server-side only. */
export const MODEL = "claude-haiku-4-5";

/** Maks. antal bruger-ture pr. session (cost-/abuse-loft). */
export const MAX_TURNS = 40;

/** Maks. output-tokens pr. svar. */
export const MAX_TOKENS = 1500;

/** Navn på det tool agenten kalder når case-briefen er klar. */
export const BRIEF_TOOL_NAME = "submit_case_brief";

export const SYSTEM_PROMPT = `Du er "Innovationsdag-guiden" fra SpAIke. Din ENESTE opgave er hurtigt at hjælpe en dansk virksomhed med at finde 2-3 konkrete problemstillinger fra deres hverdag, som ville være et godt fit for en en-dags AI-innovationsdag, og bekræfte at der er en reel, relevant problemstilling at gå videre med.

VIGTIGT om fokus: Du skal IDENTIFICERE problemet, ikke designe løsningen. Gå IKKE i dybden med hvordan det løses, hvilke systemer de bruger (Microsoft, Google osv.), hvor mange steps en proces har, sprog, dataformater eller andre tekniske detaljer. Den slags er en senere dialog. Bliv på problem-niveau: hvad gør ondt, for hvem, og hvorfor er det værd at bruge en dag på. Hold samtalen KORT, gerne 4 til 7 udvekslinger i alt, og afslut så snart du har 2-3 brugbare kandidater. Pointen er at demonstrere at der ER noget her, der kan løses, ikke at lave en plug-and-play-plan.

Stil og form: Vær venlig, konkret og effektiv. Stil KUN ét spørgsmål ad gangen, aldrig flere i samme tur. Spring irrelevante spørgsmål over (spørg fx aldrig om medarbejdernes navne, titler, eller hvilke systemer de bruger). Brug et enkelt, jordnært dansk uden buzzwords. Skriv i jeg-form (SpAIke er solo: sig "jeg", aldrig "vi" om SpAIke; "vi" kun når det betyder dig og virksomheden sammen). Brug aldrig tankestreger (— eller –) som tegnsætning; brug punktum eller komma.

Sådan vurderer du LET om en problemstilling er et godt fit (du fornemmer det meste fra samtalen, du behøver ikke spørge eksplicit til alt):
- Konkret og aktuel: en reel smerte lige nu, ikke hypotetisk.
- Software-formet: kan løses med en app, et værktøj, en formular, et dashboard eller en automatisering, ikke hardware.
- Afgrænsbar: man kan se noget demo-bart bygget på en dag.
- Rører flere: det er ikke kun én persons private irritation.

Hvis en idé er for stor eller vag, så hjælp kort med at skære den til, i stedet for at afvise den.

Forløb:
1. Forklar KORT (1 til 2 sætninger) hvad I skal: finde et par konkrete problemer der ville være gode at bygge på, og at de får en brief med kandidaterne tilsendt.
2. Spørg FØRST om de allerede har en eller flere problemstillinger i tankerne. Har de: tag fat i dem og stil ét enkelt opklarende spørgsmål pr. case for at forstå smerten (ikke løsningen). Har de ikke: hjælp dem til 2-3 kandidater ved at spørge til hvad der tager tid eller irriterer i hverdagen (gentaget manuelt arbejde, rapporter samlet i hånden, info fanget i regneark eller indbakker, langsomme overleveringer).
3. Få et hurtigt, let indtryk af hvem der kunne være gode at have med på dagen (roller, valgfrit, kort). Grav ikke i det.
4. Når du har 2-3 problemstillinger der virker som gode fit, så afslut. Du behøver IKKE alle detaljer.

Når du har 2-3 kandidater, så sig kort at du samler en brief, og kald værktøjet "${BRIEF_TOOL_NAME}". Skriv ALDRIG selve briefen som JSON i din tekst; brug kun værktøjet. Efter kaldet fortsætter samtalen ikke; brugeren får sin brief tilsendt på mail.`;

/**
 * Brief-tool. Agenten kalder dette når case-briefen er klar; serveren
 * fanger tool_use-blokken og sender den strukturerede brief til klienten.
 * Bevidst ikke `strict: true` - schemaet bruger nested objects/arrays som
 * structured-output strict-mode ikke fuldt understøtter, og en almindelig
 * tool-definition er rigeligt robust her.
 */
export const BRIEF_TOOL: Anthropic.Tool = {
  name: BRIEF_TOOL_NAME,
  description:
    "Indsend en kort case-brief: 2-3 problemstillinger der ville være gode fit for en AI-innovationsdag. Hold den på problem-niveau, ikke en detaljeret løsningsplan. Al tekst på dansk, jeg-form, ingen tankestreger.",
  input_schema: {
    type: "object",
    properties: {
      virksomhed: {
        type: "string",
        description: "Kort: hvad virksomheden laver (én sætning er nok)",
      },
      deltagere_forslag: {
        type: "array",
        items: { type: "string" },
        description: "Valgfrit: roller der kunne være gode at have med på dagen (ikke navne)",
      },
      cases: {
        type: "array",
        description: "2-3 problemstillinger, stærkeste først",
        items: {
          type: "object",
          properties: {
            titel: { type: "string", description: "Kort, sigende titel på problemstillingen" },
            problem: {
              type: "string",
              description: "Hvad gør ondt, for hvem. Konkret og kort, ikke en løsning.",
            },
            hvorfor_godt_fit: {
              type: "string",
              description: "Kort: hvorfor er det en god case til en AI-innovationsdag",
            },
            mulig_loesning: {
              type: "string",
              description:
                "Én kort sætning der antyder hvad man kunne bygge. Inspiration, ikke en plan.",
            },
          },
          required: ["titel", "problem", "hvorfor_godt_fit", "mulig_loesning"],
          additionalProperties: false,
        },
      },
      samlet_anbefaling: {
        type: "string",
        description: "Kort: hvilken case ville jeg starte med, og hvorfor",
      },
    },
    required: ["virksomhed", "cases", "samlet_anbefaling"],
    additionalProperties: false,
  },
};

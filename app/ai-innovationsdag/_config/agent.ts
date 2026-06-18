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

export const SYSTEM_PROMPT = `Du er "Innovationsdag-guiden" fra SpAIke. Din opgave er at hjælpe en dansk virksomhed med at finde 1-3 konkrete problemer fra deres egen hverdag, som egner sig til en en-dags AI-innovationsdag, hvor et lille team bygger en løsning med vibe coding / no-code AI-værktøjer.

Du kvalificerer dem IKKE som "gode nok". Du hjælper dem med at opdage og skærpe en god case, så de selv forstår konkret hvad der kan bygges - og dermed værdien. Vær venlig, konkret og effektiv. Stil KUN ét spørgsmål ad gangen, aldrig flere spørgsmål i samme tur. Spring irrelevante spørgsmål over (spørg fx aldrig om medarbejdernes navne eller titler) og kom hurtigt til sagen, så det ikke føles som et forhør. Brug et enkelt, jordnært dansk uden buzzwords. Skriv i jeg-form på SpAIke's vegne (SpAIke er en solo-virksomhed - sig "jeg", aldrig "vi" om SpAIke; "vi" kun når det betyder dig og virksomheden sammen). Brug aldrig tankestreger (— eller –) som tegnsætning; brug punktum eller komma.

Du arbejder ud fra denne tjekliste for, hvornår et problem egner sig til en innovationsdag:
1. Kritisk masse: mindst 3 personer deler problemet og kan være på teamet.
2. Konkret og aktuelt: det er en reel smerte lige nu, ikke hypotetisk.
3. Kan afgrænses til én dag: en brugbar MVP kan bygges på ca. én dag.
4. Kan løses med vibe coding: det er en app, et internt værktøj, en formular, et dashboard eller en automatisering - ikke hardware eller tung specialudviklet ML.
5. Ejer er med i rummet: en person, der kender problemet i dybden, deltager.
6. Data/kontekst findes: de har eksempler eller data at arbejde med.

Et problem behøver ikke score perfekt. Hvis en case er for stor eller for vag, så hjælp dem med at indsnævre eller omformulere den i stedet for at afvise den. Husk reglen "hvis man ikke kan se det i en demo, så byg det ikke" - styr mod én synlig kerne-feature.

Når de 1-3 cases er fundet, afdæk kort parathed (uden at være en dørvogter):
- Kan de samle mindst 3-5 personer om problemet?
- Er der en der kan eje løsningen bagefter?
- Er de villige til at give adgang til vibe coding-værktøjer og API-adgang til systemerne?
Og for hver case: spørg hvordan et typisk datasæt ser ud (felter + et par eksempel-rækker), så vi på forhånd kan lave syntetisk data at bygge på - så slipper vi for at røre rigtige følsomme data på dagen.

Forløb: 1) Forklar KORT (2-3 sætninger) hvad I skal, og at de går fra det med en brugbar brief uanset hvad. 2) Spørg FØRST om de allerede har et eller flere konkrete problemer i tankerne, som kunne være en god case. Hvis ja: tag fat i dem med det samme, få dem på bordet, og udfordr og skærp dem mod tjeklisten. Når I har været deres egne idéer igennem, så spørg om der kunne være andre. Hvis nej: hjælp dem med at finde 2-4 kandidater ved at spørge til hvad der tager tid eller irriterer i hverdagen (gentaget manuelt arbejde, rapporter samlet i hånden, info fanget i regneark eller indbakker, langsomme overleveringer). 3) Når der er kandidater på bordet, spørg KORT til den kontekst du faktisk skal bruge for at vurdere casen: hvad virksomheden laver, ca. hvor mange I er, og hvilke roller der ville være med på dagen (roller, ikke navne). Kun det der er relevant. 4) Test kandidaterne mod tjeklisten og coach mod konkrethed og afgrænsning. 5) Konvergér mod de 1-3 stærkeste, omskrevet som SMART-problemformuleringer. 6) Afdæk kort parathed + data-skitse. 7) Afslut med case-briefen.

Når du har nok til en brief - typisk efter trin 6 - så kald værktøjet "${BRIEF_TOOL_NAME}" med den strukturerede case-brief. Sig kort til brugeren at du nu samler briefen, og kald så værktøjet. Skriv ALDRIG selve briefen som JSON i din tekst; brug kun værktøjet. Efter værktøjet er kaldt, fortsætter samtalen ikke automatisk - brugeren ser briefen og vælger en vej.`;

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
    "Indsend den færdige case-brief for virksomheden. Kald KUN når du har afdækket virksomhed, 1-3 cases med SMART-problemformuleringer, parathed og data-skitse. Al tekst på dansk, jeg-form, ingen tankestreger.",
  input_schema: {
    type: "object",
    properties: {
      virksomhed: { type: "string", description: "Virksomhedens navn" },
      stoerrelse: { type: "string", description: "Fx antal ansatte / segment" },
      deltagere_forslag: {
        type: "array",
        items: { type: "string" },
        description: "Forslag til hvem fra virksomheden der deltager (roller)",
      },
      parathed: {
        type: "object",
        properties: {
          kritisk_masse: { type: "boolean" },
          ejer_bagefter: { type: "boolean" },
          tool_api_adgang: { type: "boolean" },
        },
        required: ["kritisk_masse", "ejer_bagefter", "tool_api_adgang"],
        additionalProperties: false,
      },
      cases: {
        type: "array",
        description: "1-3 cases, stærkeste først",
        items: {
          type: "object",
          properties: {
            titel: { type: "string" },
            problemformulering: {
              type: "string",
              description: "SMART: specifik, målbar, opnåelig, relevant, tidsbundet",
            },
            hvem_paavirkes: { type: "string" },
            succeskriterie: { type: "string" },
            mvp_scope: {
              type: "string",
              description: "Hvad bygges på dagen - én synlig, demo-bar kerne-feature",
            },
            data_kontekst_behov: { type: "string" },
            data_skitse: {
              type: "string",
              description:
                "Typiske felter + et par eksempel-rækker + format - input til et synthetic-data-script",
            },
            vej_til_drift: {
              type: "string",
              description: "Kort: hvordan løsningen kan komme i drift efter dagen",
            },
            anbefalet_team: { type: "string", description: "3-4 personer, hvilke roller" },
            fit_score: {
              type: "object",
              description: "0-3 pr. dimension (0=svag, 3=stærk)",
              properties: {
                kritisk_masse: { type: "integer" },
                konkret: { type: "integer" },
                dag_scope: { type: "integer" },
                vibe_code: { type: "integer" },
                ejer: { type: "integer" },
                data: { type: "integer" },
              },
              required: [
                "kritisk_masse",
                "konkret",
                "dag_scope",
                "vibe_code",
                "ejer",
                "data",
              ],
              additionalProperties: false,
            },
            fit_kommentar: {
              type: "string",
              description: "Hvad er stærkt, hvad bør styrkes",
            },
          },
          required: [
            "titel",
            "problemformulering",
            "hvem_paavirkes",
            "succeskriterie",
            "mvp_scope",
            "data_kontekst_behov",
            "data_skitse",
            "vej_til_drift",
            "anbefalet_team",
            "fit_score",
            "fit_kommentar",
          ],
          additionalProperties: false,
        },
      },
      samlet_anbefaling: { type: "string" },
    },
    required: [
      "virksomhed",
      "stoerrelse",
      "deltagere_forslag",
      "parathed",
      "cases",
      "samlet_anbefaling",
    ],
    additionalProperties: false,
  },
};

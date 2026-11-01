/**
 * Stemme-agenten i /tilskud som konfig-som-kode (Michael 2026-11-01).
 *
 * Et selvstændigt flow, ikke oplæsning af chatten: en rolig coach der i en
 * samtale guider ejeren gennem afklaringen, med sin egen tale-prompt og sin
 * egen åbning. Brugeren ser ingen tekst, kun tjeklisten (lib/tilskud/afklaring.ts),
 * som agenten selv afkrydser via client tool'et noter_afklaring.
 * Efter samtalen laver Claude den samme kvalificering/vurdering som chatten
 * ud fra udskriften (lib/tilskud/chat.ts: udledResultatAfSamtale).
 *
 * Ændres noget her: kør `npm run tilskud:voice -- sync` (opdaterer agenten hos
 * ElevenLabs og læser felterne tilbage) og `-- simuler` (samtale uden mikrofon).
 * Stemme-tuning følger vault-noten "Dansk voice-agent (ElevenLabs)".
 */

import { AFKLARINGSPUNKTER, PUNKT_IDER, afklaretFraCvr, afklaretSomTekst } from "./afklaring";
import { FAKTAGRUNDLAG } from "./agent";
import { forhaandstjek, virksomhedSomTekst, type Virksomhed } from "./cvr";
import { puljerSomTekst } from "./puljer";
import type { AgentKonfig } from "./voice";

/** Udtales "spajk". "SpAIke" læses forkert af dansk TTS. */
const NAVN = "Spajk";

export const NOTER_TOOL = "noter_afklaring";
export const FORELOEBIG_TOOL = "vis_foreloebig_vurdering";

const punkterTekst = (fase: "kvalificering" | "forberedelse") =>
  AFKLARINGSPUNKTER.filter((p) => p.fase === fase)
    .map((p) => `${p.id} (${p.label.toLowerCase()})`)
    .join(", ");

export const VOICE_PROMPT = `Du er ${NAVN}s AI-assistent. Du er en erfaren og rolig coach, der i en samtale guider ejeren eller en leder i en dansk SMV gennem en afklaring af, om SMV Digitals rådgivertilskud er en mulighed for dem, og hjælper dem med at forme ét projekt, som de kan bygge en ansøgning på. Du giver en ærlig indikation, aldrig en garanti.

SÅDAN TALER DU
Det her er en samtale i øret, ikke en tekst. Én til to korte sætninger ad gangen og højst ét spørgsmål pr. tur. Ingen lister, punkttegn, overskrifter eller markdown.
Tal, beløb, procenter og datoer siger du altid som danske ord: "halvtreds procent", "hundrede og halvtreds tusind kroner", "den niende november klokken ni". Aldrig cifre.
Skriv firmanavnet som "${NAVN}", aldrig "SpAIke", så det udtales rigtigt. Puljen hedder "SMV Digital".
Alt hvad du skriver, bliver læst højt. Skriv derfor aldrig noget om værktøjer, om hvad du gør, eller noget på engelsk. Brug ikke tankestreger; brug komma eller punktum.
Jordnært dansk uden buzzwords. Ingen superlativer, ingen ros og ingen tomme høfligheder: sig aldrig "perfekt", "glimrende", "super", "fantastisk", "godt at høre" eller "held og lykke". Kvittér kort og naturligt ("okay", "forstået", "det giver god mening"), og spejl en gang imellem det du hører i én sætning, så de kan mærke at du har forstået.
Lad dem altid tale færdig, også når de tøver eller tænker.
Du er en AI-assistent og ikke selv rådgiver. Den godkendte rådgiver er Michael Mortensen fra ${NAVN}; omtal ham som "Michael fra ${NAVN}". Sig aldrig "vi" om ${NAVN}.
Du skriver ikke ansøgningen for dem og lover ikke tilsagn. Spørger de om noget uden for emnet, svarer du kort og fører samtalen tilbage. Du er ikke en generel assistent.

DET DU VED OM VIRKSOMHEDEN (fra CVR, kan være ufuldstændigt):
{{cvr_kontekst}}
Allerede afklaret fra CVR, så spørg ikke om det igen: {{allerede_afklaret}}
I dag er det {{i_dag}}.

PULJER:
{{puljer}}

${FAKTAGRUNDLAG}

TJEKLISTEN
Brugeren ser en tjekliste på skærmen. Hver gang du har fået et brugbart svar på et punkt, kalder du værktøjet ${NOTER_TOOL} med punktet, status (ok, nej eller usikker) og en note på højst ti ord med deres egne ord og tal. Kald det i den SAMME tur, hvor du kvitterer for svaret, og altid før du stiller næste spørgsmål. Gem aldrig noteringer til senere; tjeklisten skal følge samtalen. Sig aldrig højt, at du noterer. Et punkt der ændrer sig, noterer du igen.
Kvalificering: ${punkterTekst("kvalificering")}.
Forberedelse: ${punkterTekst("forberedelse")}.

FORLØB
Fase et, kvalificering:
1. Du har allerede sagt din åbning og spurgt, hvad der fik dem til at kigge på det her. Lyt, spejl kort, og stil gerne ét opfølgende spørgsmål om situationen. Når smerten eller idéen er tydelig, noterer du idee med status ok og deres egne ord.
2. Gå derefter alle kvalificeringspunkter igennem, som ikke allerede er afklaret, ét ad gangen og i en naturlig rækkefølge. Sig i en halv sætning hvorfor du spørger, fx "det er et af puljens krav". Spring kun over det, der står som afklaret ovenfor, eller som de allerede har svaret på.
   smv og aarsvaerk: spørg samlet, hvor mange de er regnet i fuldtidsstillinger, og cirka hvad de omsætter for om året. Under to hundrede og halvtreds ansatte og en omsætning under cirka tre hundrede og halvfjerds millioner kroner er en SMV, og der skal være mindst to årsværk. Spørg også om omsætningen, når CVR kender antallet af ansatte.
   regnskab: om de har aflagt mindst ét årsregnskab.
   medfinansiering: de betaler selv halvdelen kontant, typisk halvtreds til hundrede og halvtreds tusind kroner, og lægger hele beløbet ud, indtil tilskuddet bliver refunderet. Spørg om det er realistisk for dem.
   tidligere_tilskud: om de har fået offentlige tilskud de seneste tre år, og cirka hvor meget.
   ejerskab: om en større virksomhed ejer en fjerdedel eller mere af dem.
   Rammer du en klar stopper, så notér punktet med status nej i samme tur, sig det ærligt, og gå de resterende punkter kort igennem, så tjeklisten bliver hel. Kravene til virksomheden (SMV, mindst to årsværk, aflagt regnskab, kontant medfinansiering, de minimis og ejerskab) gælder for ALLE puljerne, også cyber- og digitaliseringspuljen. Påstå aldrig, at en anden pulje har lempeligere krav til virksomheden, og nævn ikke en anden pulje som udvej for en stopper.
3. Når alle kvalificeringspunkter er noteret: opsummer i to til tre sætninger, hvad I har fået afklaret, og giv din foreløbige vurdering i ord, fx "det ser ud til, at I kan søge" eller "der er ét krav, vi skal have afklaret". Kald ${FORELOEBIG_TOOL} med status og én sætning i den SAMME tur som opsummeringen, ikke senere. Sig så, at du med tre til fire spørgsmål mere kan forberede dem, så de får en projektbeskrivelse med alt det, ansøgningen spørger om, som de kan skrive deres egen ansøgning ud fra. Spørg om de vil fortsætte.
   Siger de nej: sig at kvalificeringen kommer frem på skærmen om et øjeblik, og at de kan få den på mail derfra. Sig farvel, og kald end_call.
Fase to, forberedelse, kun efter et ja, højst fire spørgsmål:
4. omraade: hvad fylder mest i hverdagen, og hvor spilder de tid eller taber penge. Brug branchen til at gøre det let at svare på. Nævner de et område, så bekræft omfanget i én sætning. Er de i tvivl, så foreslå to til tre områder ud fra smerten og branchen, og nævn at hele flowet fra opgave til faktura typisk står stærkest. Tilskuddet betaler en analyse, så hold det på analysens niveau, og spørg aldrig "hvor i flowet går tiden" eller "hvor opstår fejlene". Det er analysens opgave.
5. effekt: hvad det ville betyde for dem, hvis det blev løst, og hvor de vil hen de næste par år. Størrelsesorden er nok, fx en eftermiddag om ugen eller en halv stilling, flere kunder uden at ansætte, hurtigere betaling.
6. forankring (notér det, så snart de har sagt hvem): hvem hos dem der ville drive projektet, mindst én fra ledelsen og én medarbejder, om de har gennemført digitale projekter før, og om de bruger AI i dag. Nævn at ansøgningen også spørger til penge til at gennemføre anbefalingerne bagefter, så de kan tænke over et beløb.
7. Afslut: opsummer projektet i to til tre sætninger, som du har forstået det: område, smerte og effekt. Sig at vurderingen og projektbeskrivelsen kommer frem på skærmen om et øjeblik, og at de kan få det hele på mail. Nævn én gang og uden salgstryk, at Michael fra ${NAVN} er godkendt rådgiver og kan være én af dem, de indhenter tilbud fra, og at puljen kræver, at de sammenligner flere. Sig farvel, og kald end_call.

Kan de ikke svare på noget, så tag deres bedste skøn, notér status usikker og gå videre. Vil de stoppe undervejs, så respektér det: sig at det, I nåede, kommer frem på skærmen, sig farvel og kald end_call.
Afslutning: din sidste tur slutter med ordet "farvel", og i SAMME tur kalder du end_call. Har brugeren allerede sagt farvel, så svar kort med "Farvel" og kald end_call. Aldrig end_call i en tom tur, og aldrig en sætning om at du afslutter.`;

export const FIRST_MESSAGE = `Hej, og tak fordi du tager dig tid. Jeg er ${NAVN}s AI-assistent, og jeg guider dig gennem en kort afklaring af, om SMV Digitals tilskud er en mulighed for {{virksomhed_navn}}. Det tager typisk fem til ti minutter, og på skærmen kan du følge med i, hvad vi har fået afklaret. Til at starte med: hvad fik jer til at kigge på det her lige nu?`;

export function voiceAgentKonfig(): AgentKonfig {
  const voiceId = process.env.TILSKUD_TTS_VOICE || "2FnlfmVwtwwygasoGwH4";
  return {
    name: "Tilskudstjek: stemme-coach (spaike.dk/tilskud)",
    tags: ["spaike", "tilskud", "voice-agent", "da"],
    conversation_config: {
      agent: {
        language: "da",
        first_message: FIRST_MESSAGE,
        dynamic_variables: {
          dynamic_variable_placeholders: {
            virksomhed_navn: "jer",
            cvr_kontekst: "Intet CVR-opslag. Spørg selv, hvad virksomheden laver.",
            allerede_afklaret: "intet endnu",
            i_dag: "den første november totusind og seksogtyve",
            puljer: "Ingen pulje-data.",
          },
        },
        prompt: {
          prompt: VOICE_PROMPT,
          llm: process.env.TILSKUD_VOICE_LLM || "claude-sonnet-4-6", // A/B 2026-11-01: 10/10 noteringer, 0 ros (Haiku 4.5 og Gemini Flash glemte punkter)
          temperature: 0.5,
          max_tokens: 350,
          tools: [
            {
              type: "client",
              name: NOTER_TOOL,
              description: "Afkryds et punkt på brugerens tjekliste, så snart det er afklaret i samtalen.",
              expects_response: false,
              response_timeout_secs: 5,
              parameters: {
                type: "object",
                required: ["punkt", "status", "note"],
                properties: {
                  punkt: { type: "string", enum: PUNKT_IDER, description: "Hvilket punkt på tjeklisten" },
                  status: { type: "string", enum: ["ok", "nej", "usikker"], description: "ok = kravet er opfyldt eller svaret er klart, nej = stopper, usikker = skal afklares" },
                  note: { type: "string", description: "Højst ti ord med brugerens egne ord og tal" },
                },
              },
            },
            {
              type: "client",
              name: FORELOEBIG_TOOL,
              description: "Vis den foreløbige vurdering på skærmen, når alle kvalificeringspunkter er afklaret.",
              expects_response: false,
              response_timeout_secs: 5,
              parameters: {
                type: "object",
                required: ["status", "tekst"],
                properties: {
                  status: { type: "string", enum: ["groen", "gul", "roed"], description: "groen = kan søge, gul = med forbehold, roed = ikke som det ser ud nu" },
                  tekst: { type: "string", description: "Én sætning om vurderingen" },
                },
              },
            },
            { type: "system", name: "end_call", description: "", params: { system_tool_type: "end_call" } },
          ],
        },
      },
      tts: {
        // Pro-klon ("Michael Stemme") degraderer på v3; flash_v2_5 er den verificerede danske realtidsmodel.
        model_id: process.env.TILSKUD_VOICE_TTS_MODEL || "eleven_flash_v2_5",
        voice_id: voiceId,
        stability: 0.4,
        similarity_boost: 0.85,
        speed: 1,
        text_normalisation_type: "system_prompt",
      },
      turn: {
        turn_timeout: 15,
        turn_eagerness: "patient",
        speculative_turn: false,
        soft_timeout_config: {
          timeout_seconds: 3,
          message: "Mm, lige et øjeblik.",
        },
      },
      asr: { provider: "scribe_realtime", quality: "high", user_input_audio_format: "pcm_16000" },
      conversation: { max_duration_seconds: 900 },
    },
    platform_settings: {
      // Privat agent: kun vores server kan udstede samtale-tokens (efter session-token + rate-limit).
      auth: { enable_auth: true },
      // Omkostningsvagt, fail-closed: højst 50 samtaler pr. døgn og 5 samtidige.
      call_limits: { agent_concurrency_limit: 5, daily_limit: 50 },
      // Privatliv: ingen lydoptagelse, udskriften slettes hos ElevenLabs efter 30 dage (står i privatlivspolitikken).
      privacy: { record_voice: false, retention_days: 30 },
    },
  };
}

function datoSomOrd(d: Date): string {
  return d.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Copenhagen" });
}

/** Dynamiske variabler pr. samtale, bygget server-side fra CVR-opslaget. */
export function dynamiskeVariabler(v: Virksomhed | null): Record<string, string> {
  const t = v ? forhaandstjek(v) : null;
  return {
    virksomhed_navn: v?.navn || "jer",
    cvr_kontekst: v && t ? virksomhedSomTekst(v, t).slice(0, 2500) : "Intet CVR-opslag. Spørg selv, hvad virksomheden laver.",
    allerede_afklaret: afklaretSomTekst(afklaretFraCvr(v, t)),
    i_dag: datoSomOrd(new Date()),
    puljer: puljerSomTekst(),
  };
}

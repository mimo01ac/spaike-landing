# DEFERRED — bevidste fravalg (append-only)

Format: hvad blev fravalgt · hvorfor · det rigtige · effort (S/M/L).

## 2026-08-30 · AI-tjek (/ai-tjek) v1

- Automatisk AI-panel-kørsel (Perplexity/Claude web search + mail-token-flow + Brevo-rapportmail) · fart: v1 shipper uden nye betalte API-afhængigheder; leads notificeres til Michael og panelet køres manuelt med den eksisterende ai-visibility-motor · det rigtige: async kø m. mail-verifikation før LLM-kald, jf. build-skitsen i vaultens lead-magnet-dom · effort M
- CWV-tjek via PageSpeed Insights-API · fart: tilføjer 10-20 sek. latenstid + API-nøgle; instant-oplevelsen prioriteret · det rigtige: async CWV-berigelse af rapporten · effort S
- Fuld E2E af scan→rapport mod rigtig PocketBase · scope: E2E mocker scan-API'et; motoren dækkes af CLI-harness (scripts/ai-tjek-cli.mjs) + manuel verifikation · det rigtige: test-PB-instans eller PB-mock i webServer · effort M
- Globalt dagsloft er in-memory pr. serverless-instans (best effort) · fart: rigeligt ved lav trafik, og scan-trinnet er gratis (ingen LLM) · det rigtige: delt tæller i PocketBase/KV · effort S
- Dynamisk OG-billede pr. rapport ("sell the screenshot") · fart · det rigtige: @vercel/og med score-kort · effort S

## 2026-09-17 · AI Proficiency Snapshot (/ai-niveau) v1 (tekst-først)

- Trin 2 voice-interview (tryk-og-tal i browseren) · scope: tekst-først lancering, brugeren skriver 4 felter i stedet · det rigtige: genbrug OpenAI Realtime-botten fra spaike-pa/karachi (voice/bot_openai_realtime.py) som valgfri knap ved siden af tekst-interviewet · effort L
- Email-opt-in persisteres IKKE i PocketBase, kun mailet til Michael · fart: undgår ny PB-collection + setup-migration i v1 · det rigtige: ai_niveau_leads-collection (som ai_tjek_leads) + gem i lead-routen · effort S
- Ingen CLI/HTTP-vej for selve scoringen · scope: scoringen er ren klient-logik i _data/proficiency.ts (scoreAnswers), ingen serverless-funktion · det rigtige: hvis den skal server-verificeres, læg en lille unit-test på scoreAnswers eller et /api/ai-niveau/score-endpoint · effort S
- Rate-limit på plan-endpointet er in-memory pr. serverless-instans (best effort) · fart: rigeligt ved lav trafik i beta · det rigtige: delt tæller i KV/Upstash · effort S
- Delbart OG-billede med niveau/score · fart · det rigtige: @vercel/og med niveau-kort · effort S

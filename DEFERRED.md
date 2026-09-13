# DEFERRED — bevidste fravalg (append-only)

Format: hvad blev fravalgt · hvorfor · det rigtige · effort (S/M/L).

## 2026-08-30 · AI-tjek (/ai-tjek) v1

- Automatisk AI-panel-kørsel (Perplexity/Claude web search + mail-token-flow + Brevo-rapportmail) · fart: v1 shipper uden nye betalte API-afhængigheder; leads notificeres til Michael og panelet køres manuelt med den eksisterende ai-visibility-motor · det rigtige: async kø m. mail-verifikation før LLM-kald, jf. build-skitsen i vaultens lead-magnet-dom · effort M
- CWV-tjek via PageSpeed Insights-API · fart: tilføjer 10-20 sek. latenstid + API-nøgle; instant-oplevelsen prioriteret · det rigtige: async CWV-berigelse af rapporten · effort S
- Fuld E2E af scan→rapport mod rigtig PocketBase · scope: E2E mocker scan-API'et; motoren dækkes af CLI-harness (scripts/ai-tjek-cli.mjs) + manuel verifikation · det rigtige: test-PB-instans eller PB-mock i webServer · effort M
- Globalt dagsloft er in-memory pr. serverless-instans (best effort) · fart: rigeligt ved lav trafik, og scan-trinnet er gratis (ingen LLM) · det rigtige: delt tæller i PocketBase/KV · effort S
- Dynamisk OG-billede pr. rapport ("sell the screenshot") · fart · det rigtige: @vercel/og med score-kort · effort S

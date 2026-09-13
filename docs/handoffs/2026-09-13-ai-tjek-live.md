# Handoff 2026-09-13: AI-tjek-pakken live på spaike.dk

## Slut-tilstand

- Branch `feature/ai-tjek` er merget til `main` og deployet af Vercel.
- Working tree rent, alt pushet, CI (E2E) grøn.
- Live og browser-verificeret: https://www.spaike.dk/ai-tjek og kontaktsektionen på forsiden (#kontakt).
- Første rigtige prod-scan: spaike.dk selv, 82/100, rapport: https://www.spaike.dk/ai-tjek/rapport/cfztxp3yz83sibd

## Løst i denne tråd

- /ai-tjek lead-magnet: deterministisk scan-motor (`lib/aiTjek.ts`, 8 tjek, 100 point, ingen LLM), landing + rapport-side + lead-formular, PocketBase-collections `ai_tjek_scans`/`ai_tjek_leads`, Brevo-notifikation, CLI-harness `scripts/ai-tjek-cli.mjs`. LIVE.
- Kontaktformular på forsiden: honeypot, consent-gate, PB `kontakt_beskeder`, Brevo med reply-to. LIVE.
- Score-transparens: delpoint i fund-teksterne, rapportens score udregnes af tjekkene og kan aldrig afvige. LIVE.
- Beriget case-brief: vurderingslag (datakrav_niveau, datakrav, faldgrube, kategori) i agent-schema, typer, mail-render. LIVE.
- Preview-script `scripts/render-brief-preview.mts` + renderet preview committet.
- Audiovox: fuldt AI-panel + CEO-læsbar rapport v2 (motor-spec v1.3 i `~/.claude/jobs/ai-visibility/`).
- EHHS AI-tjek 3.0 teardown + Fase 1 af framework-forbedringer.
- Vaultens `01 SpAIke/SpAIke.dk build-reference.md` opdateret med de nye live-sider.

## Udestående

- ORANGE: spaike.dk scorer selv 82/100 i eget tjek. Forsiden mangler JSON-LD struktureret data (0/12) og canonical (0/3). Fix før kunder scanner os.
- ORANGE: Fase 2+3 fra `docs/reviews/2026-09-01-plan-framework-forbedringer.html` (panel-rapporter med E/F/T-tags, motor v1.4; prioriteringsberegner).
- GUL: Omtale-agenten (design klar, ikke godkendt).
- GUL: SMV:Digital onboarding-webinar (frist ca. 2026-12-01).
- GUL: DEFERRED.md-punkterne (in-memory dagsloft, dynamisk OG-billede m.fl.).

## Prompt til næste tråd

Jeg fortsætter på spaike.dk (repo spaike-landing). Sidste tråd blev wrapped up 2026-09-13: AI-tjek, kontaktformular, score-fix og beriget brief er merget til main og live. Næste skridt: fix spaike.dk's egen AI-tjek-score (JSON-LD + canonical på forsiden), derefter evt. Fase 2. Læs først: DEFERRED.md, docs/handoffs/2026-09-13-ai-tjek-live.md, lib/aiTjek.ts.

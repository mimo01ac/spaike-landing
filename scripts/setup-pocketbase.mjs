#!/usr/bin/env node
/**
 * Idempotent PocketBase schema-setup for AI-innovationsdag discovery-tool.
 *
 * Opretter (hvis de ikke findes) de to collections på den EKSISTERENDE
 * spaike-crm-instans:
 *   - discovery_sessions
 *   - applications
 *
 * Sikker at køre flere gange: collections der allerede findes springes over.
 * Alle API-rules er låst til superuser (null) -> data er privat (GDPR).
 * Server-routen skriver via superuser-auth, som bypasser rules.
 *
 * Kør:  node --env-file=.env.local scripts/setup-pocketbase.mjs
 */

const URL = process.env.POCKETBASE_URL;
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!URL || !EMAIL || !PASSWORD) {
  console.error("Mangler POCKETBASE_URL / _ADMIN_EMAIL / _ADMIN_PASSWORD i env.");
  process.exit(1);
}

const COLLECTIONS = [
  {
    name: "discovery_sessions",
    type: "base",
    fields: [
      { name: "name", type: "text" },
      { name: "email", type: "email" },
      { name: "company", type: "text" },
      { name: "website", type: "text" },
      { name: "size", type: "text" },
      { name: "transcript", type: "json", maxSize: 2000000 },
      { name: "case_brief", type: "json", maxSize: 2000000 },
      {
        name: "path_chosen",
        type: "select",
        maxSelect: 1,
        values: ["diy", "apply", "none"],
      },
      { name: "consent", type: "bool" },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  },
  {
    name: "applications",
    type: "base",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "phone", type: "text" },
      { name: "company", type: "text" },
      { name: "website", type: "text" },
      { name: "case_brief", type: "json", maxSize: 2000000 },
      { name: "notes", type: "text" },
      { name: "consent", type: "bool" },
      {
        name: "status",
        type: "select",
        maxSelect: 1,
        values: ["new", "contacted", "scheduled", "done"],
      },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  },
  {
    name: "ai_tjek_scans",
    type: "base",
    fields: [
      { name: "url", type: "text", required: true },
      { name: "domaene", type: "text" },
      { name: "score", type: "number" },
      { name: "checks", type: "json", maxSize: 500000 },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
  },
  {
    name: "ai_tjek_leads",
    type: "base",
    fields: [
      { name: "email", type: "email", required: true },
      { name: "scan", type: "text" },
      { name: "domaene", type: "text" },
      { name: "consent", type: "bool" },
      {
        name: "status",
        type: "select",
        maxSelect: 1,
        values: ["new", "sent", "booked"],
      },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  },
];

async function api(path, opts = {}, token) {
  const res = await fetch(`${URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { status: res.status, ok: res.ok, body };
}

async function main() {
  // 1) Auth som superuser
  const auth = await api("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
  });
  if (!auth.ok || !auth.body.token) {
    console.error("Superuser-auth fejlede:", auth.status, auth.body);
    process.exit(1);
  }
  const token = auth.body.token;
  console.log("✓ Superuser-auth OK");

  // 2) Opret hver collection idempotent
  for (const col of COLLECTIONS) {
    const existing = await api(
      `/api/collections/${col.name}`,
      { method: "GET" },
      token,
    );
    if (existing.ok) {
      // Findes allerede: sørg for at evt. nye felter tilføjes (idempotent schema-evolution).
      const have = new Set((existing.body.fields || []).map((f) => f.name));
      const missing = col.fields.filter((f) => !have.has(f.name));
      if (missing.length === 0) {
        console.log(`• ${col.name}: findes, alle felter ok`);
        continue;
      }
      const merged = [...existing.body.fields, ...missing];
      const upd = await api(
        `/api/collections/${existing.body.id}`,
        { method: "PATCH", body: JSON.stringify({ fields: merged }) },
        token,
      );
      if (upd.ok) {
        console.log(`✓ ${col.name}: tilføjede felter [${missing.map((f) => f.name).join(", ")}]`);
      } else {
        console.error(`✗ ${col.name}: kunne ikke tilføje felter`, upd.status, JSON.stringify(upd.body));
        process.exitCode = 1;
      }
      continue;
    }
    const created = await api(
      "/api/collections",
      {
        method: "POST",
        body: JSON.stringify({
          name: col.name,
          type: col.type,
          // Alle rules = null -> kun superuser (server-routen) kan tilgå.
          listRule: null,
          viewRule: null,
          createRule: null,
          updateRule: null,
          deleteRule: null,
          fields: col.fields,
        }),
      },
      token,
    );
    if (created.ok) {
      console.log(`✓ ${col.name}: oprettet`);
    } else {
      console.error(`✗ ${col.name}: FEJL`, created.status, JSON.stringify(created.body));
      process.exitCode = 1;
    }
  }

  console.log("Færdig.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

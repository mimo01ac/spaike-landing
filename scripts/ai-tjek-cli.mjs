#!/usr/bin/env node
/**
 * CLI-harness for AI-tjekket (jf. CLI-testbarheds-reglen).
 *
 *   node scripts/ai-tjek-cli.mjs <url> [--base http://localhost:3000]
 *
 * Rammer HTTP-ruten (samme vej som browseren) og printer score + fund.
 */

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const baseIdx = args.indexOf("--base");
const base = baseIdx >= 0 ? args[baseIdx + 1] : "http://localhost:3000";

if (!url) {
  console.error("Brug: node scripts/ai-tjek-cli.mjs <url> [--base <server>]");
  process.exit(1);
}

const res = await fetch(`${base}/api/ai-tjek/scan`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
});
const data = await res.json();
if (!res.ok) {
  console.error(`FEJL (${res.status}):`, data.error ?? data);
  process.exit(1);
}
console.log(`Scan gemt: ${base}/ai-tjek/rapport/${data.id}`);
console.log(`Score: ${data.score}/100`);

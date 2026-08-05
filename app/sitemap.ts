import type { MetadataRoute } from "next";

const BASE = "https://www.spaike.dk";

/**
 * Kun sider der er MENT som offentlige indgange. Branche-field-notes
 * (tegnestue/transport/fertilitet/landmåling) og upublicerede artikler deles
 * bevidst kun som direkte links og skal ikke i sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/ai-innovationsdag`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ai-innovationsdag/ideer`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/ai-innovationsdag/guide`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/field-notes/vibe-coding-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/field-notes/anthropic-sales-playbook`, changeFrequency: "monthly", priority: 0.5 },
  ];
}

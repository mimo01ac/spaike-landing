/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // MIDLERTIDIG (SPA-1289): /ydelser linker til /tjek (Snapshot), som bygges i
    // næste ticket i kæden. Indtil app/tjek findes, sendes besøgende til AI-tjekket
    // (også et Se-trin). Fjern denne redirect i samme ændring som app/tjek/page.tsx,
    // ellers vinder redirecten over den nye side.
    return [{ source: "/tjek", destination: "/ai-tjek", permanent: false }];
  },
  async rewrites() {
    // /benchmark er en statisk artikel i public/. Vercels filesystem-handler
    // mapper selv mappe -> index.html, men `next start` (lokalt + E2E) gør
    // ikke; denne rewrite gør adfærden ens alle steder.
    return [{ source: "/benchmark", destination: "/benchmark/index.html" }];
  },
};

export default nextConfig;

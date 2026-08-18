/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // /benchmark er en statisk artikel i public/. Vercels filesystem-handler
    // mapper selv mappe -> index.html, men `next start` (lokalt + E2E) gør
    // ikke; denne rewrite gør adfærden ens alle steder.
    return [{ source: "/benchmark", destination: "/benchmark/index.html" }];
  },
};

export default nextConfig;

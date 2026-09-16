import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Analytics from "./components/Analytics";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.spaike.dk"),
  title: "SpAIke — Commercial impact, drevet af AI",
  description:
    "Jeg hjælper danske mid-market virksomheder med at aligne AI-automation med strategiske mål. SpAIke Discovery starter med jeres vigtigste mål og leverer en konkret handlingsplan på 48 timer.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "SpAIke — Commercial impact, drevet af AI",
    description:
      "AI-automation aligned med jeres strategiske mål. Discovery starter med jeres vigtigste mål.",
    type: "website",
    locale: "da_DK",
    url: "https://www.spaike.dk",
    images: [
      {
        url: "/og/spaike-default.png",
        width: 1200,
        height: 630,
        alt: "SpAIke: Commercial impact, drevet af AI",
      },
    ],
  },
};

/**
 * Organization-markup for brand-entiteten (schema.org JSON-LD). Renderes på
 * alle sider via root-layoutet; fakta er offentlige firmaoplysninger (CVR).
 */
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SpAIke",
  legalName: "mimoco ApS",
  url: "https://www.spaike.dk",
  logo: "https://www.spaike.dk/og/spaike-default.png",
  email: "michael@spaike.dk",
  vatID: "DK39127709",
  founder: { "@type": "Person", name: "Michael Mortensen" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Turistvej 177",
    postalCode: "3460",
    addressLocality: "Birkerød",
    addressCountry: "DK",
  },
  description:
    "AI advisory for danske virksomheder: discovery, rådgivning og konkrete AI-løsninger der skaber commercial impact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-cream text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        {children}
        <Script
          src="https://analytics.spaike.dk/script.js"
          data-website-id="0b7517b0-d5a4-4785-aaff-009e05e85ba7"
          data-domains="www.spaike.dk,spaike.dk"
          strategy="afterInteractive"
          defer
        />
        <Analytics />
      </body>
    </html>
  );
}

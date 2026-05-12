import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
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
  title: "SpAIke — Commercial impact, drevet af AI",
  description:
    "Vi hjælper danske mid-market virksomheder fra AI-eksperimenter til målbar commercial impact. Sparet tid, frigjorte ressourcer, højere kvalitet i output. Gratis SpAIke Discovery — konkret handlingsplan på 48 timer.",
  openGraph: {
    title: "SpAIke — Commercial impact, drevet af AI",
    description:
      "Fra AI-eksperimenter til målbare business-resultater. Gratis Discovery på 48 timer.",
    type: "website",
    locale: "da_DK",
    url: "https://spaike.dk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpAIke — AI der flytter forretningstal",
  description:
    "Vi hjælper danske mid-market virksomheder fra AI-eksperimenter til målbare business-resultater. Sparet tid, frigjorte ressourcer, højere kvalitet i output. Start med en gratis SpAIke Discovery — konkret handlingsplan på 48 timer.",
  openGraph: {
    title: "SpAIke — AI der flytter forretningstal",
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
    <html lang="da" className={inter.variable}>
      <body className="font-sans bg-background-primary text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}

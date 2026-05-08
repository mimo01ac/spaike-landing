import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpAIke — Spiken er i kombinationen",
  description:
    "Vi accelererer AI-impact for danske mid-market virksomheder ved at kombinere 15+ års kommerciel erfaring med hands-on AI-byggeri. AI alene er ikke nok — spiken er i kombinationen.",
  openGraph: {
    title: "SpAIke",
    description: "Spiken er i kombinationen.",
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

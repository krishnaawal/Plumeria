import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "White Plumeria Plant in Nepal | Plumeria Plant Shop",
    template: "%s | Plumeria Plant Shop"
  },
  description:
    "Buy a healthy White Flower Plumeria plant in Lalitpur, Nepal with local support, simple care guidance, and convenient ordering.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "White Flower Plumeria Plant in Nepal",
    description:
      "Premium single-product plant shop for White Plumeria plants in Lalitpur, Nepal.",
    url: siteUrl,
    siteName: "Plumeria Plant Shop",
    images: [{ url: "/images/hero/plumeria-hero.png", width: 1200, height: 900 }],
    locale: "en_NP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "White Flower Plumeria Plant in Nepal",
    description: "Buy a healthy White Flower Plumeria plant from Lalitpur, Nepal.",
    images: ["/images/hero/plumeria-hero.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}

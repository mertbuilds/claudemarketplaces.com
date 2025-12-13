import BMC from "@/components/bmc";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import {
  Comfortaa,
  Crimson_Pro,
  Inter,
  Playfair_Display,
  Space_Mono,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Playfair Display for elegant headings
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Comfortaa for friendly body text
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

// Space Mono for code blocks
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

// Inter for general UI text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Crimson Pro for serif text
const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
});

// BBH Sans Bartle for header (local font)
const bbhSans = localFont({
  src: "../public/BBH_Sans_Bartle/BBHSansBartle-Regular.ttf",
  variable: "--font-bbh-sans",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Code Plugin Marketplace | AI Tools & Extensions",
  description:
    "Explore the ultimate Claude Code plugin marketplace. Discover powerful AI development tools, productivity extensions, and innovative integrations from top developers. Find the perfect plugins for your workflow.",
  keywords: [
    "Claude Code marketplace",
    "Claude plugin marketplace",
    "Claude Code plugins",
    "Claude marketplaces",
    "Anthropic plugin marketplace",
    "Claude AI tools",
    "Claude development tools",
    "Claude Code extensions",
    "plugin marketplaces for claude code",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "llms-txt": "/llms.txt",
    "llms-full-txt": "/llms-full.txt",
  },
  openGraph: {
    title: "Claude Code Plugin Marketplace | AI Tools & Extensions",
    description:
      "Explore the ultimate Claude Code plugin marketplace. Discover powerful AI development tools, productivity extensions, and innovative integrations from top developers.",
    url: "https://claudemarketplaces.com",
    siteName: "Claude Code Plugin Marketplace",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://claudemarketplaces.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claude Code Plugin Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Plugin Marketplace | AI Tools",
    description:
      "Discover powerful plugins, extensions, and tools for Claude AI. Browse curated marketplaces and boost your development workflow.",
    images: ["https://claudemarketplaces.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${comfortaa.variable} ${spaceMono.variable} ${inter.variable} ${crimsonPro.variable} ${bbhSans.variable} antialiased`}
      >
        <BMC />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

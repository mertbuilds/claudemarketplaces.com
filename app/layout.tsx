import type { Metadata } from "next";
import { Crimson_Pro, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { OpenPanelComponent } from "@openpanel/nextjs";
import "./globals.css";

// Crimson Pro for elegant headings
const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
});

// JetBrains Mono for body and code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
        className={`${crimsonPro.variable} ${jetbrainsMono.variable} ${bbhSans.variable} antialiased`}
      >
        <OpenPanelComponent
          clientId="8565c8be-b41a-49b6-8985-25dd22f2086e"
          clientSecret={process.env.OPENPANEL_CLIENT_SECRET}
          apiUrl="https://analytics.vinena.studio/api"
          trackScreenViews={true}
          trackOutgoingLinks={true}
          trackAttributes={true}
        />
        {children}
      </body>
    </html>
  );
}

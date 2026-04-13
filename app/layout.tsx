import type { Metadata, Viewport } from "next";
import { Crimson_Pro, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { OpenPanelComponent } from "@openpanel/nextjs";
import "./globals.css";
import { FloatingBanner } from "@/components/floating-banner";
import { getInitialFloatingBannerIndex } from "@/lib/ads";

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
  src: "../public/fonts/BBH_Sans_Bartle/BBHSansBartle-Regular.ttf",
  variable: "--font-bbh-sans",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claudemarketplaces.com"),
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
  alternates: { canonical: "./" },
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
        url: "https://claudemarketplaces.com/opengraph-image?v=2",
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
    images: ["https://claudemarketplaces.com/opengraph-image?v=2"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={`${crimsonPro.variable} ${jetbrainsMono.variable} ${bbhSans.variable} antialiased`}
      >
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
          clientSecret={process.env.OPENPANEL_CLIENT_SECRET}
          apiUrl="/api/op"
          scriptUrl="/api/op/op1.js"
          trackScreenViews={true}
          trackOutgoingLinks={false}
          trackAttributes={false}
        />
        {children}
        <FloatingBanner initialIndex={getInitialFloatingBannerIndex()} />
      </body>
    </html>
  );
}

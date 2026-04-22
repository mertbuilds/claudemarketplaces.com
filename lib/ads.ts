export interface AdConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: string;
  tags?: string[];
}

export interface BannerConfig {
  id: string;
  text: string;
  cta: string;
  href: string;
  icon: string;
  external: boolean;
}

// — In-Feed Card configs (full-package advertisers only) —

const oneinchInFeed: AdConfig = {
  id: "1inch",
  title: "DeFi MCP",
  description:
    "Connect your Claude agent to onchain data via 1inch: prices, trade routes and wallet activity.",
  href: "https://business.1inch.com/1inch-mcp?utm_source=claudemarketplaces&utm_medium=cpm&utm_campaign=1inch-mcp-awareness&utm_content=in-feed-card",
  cta: "Install now",
  icon: "/1inch.png",
  tags: ["defi", "mcp", "crypto"],
};

const appsignalInFeed: AdConfig = {
  id: "appsignal",
  title: "AppSignal",
  description: "Monitor with ease. Code with confidence.",
  href: "https://www.appsignal.com/?utm_source=native&utm_medium=paid&utm_campaign=claudemarketplaces",
  cta: "Start Free Trial",
  icon: "/appsignal.svg",
  tags: ["monitoring", "apm", "devtools"],
};

const ideabrowserInFeed: AdConfig = {
  id: "ideabrowser",
  title: "ideabrowser.com",
  description:
    "Find trending startup ideas with real demand. Launch with a team of AI agents.",
  href: "https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026",
  cta: "Get trending startup ideas →",
  icon: "/ideabrowser-symbol.webp",
  tags: ["startups", "ai agents", "ideas"],
};

const kryvenInFeed: AdConfig = {
  id: "kryven",
  title: "Kryven AI",
  description:
    "Chat and build with the world's leading uncensored AI models.",
  href: "https://kryven.cc/chat?utm_source=claudemarketplaces&utm_medium=ad&utm_campaign=launch",
  cta: "Try Kryven free",
  icon: "/kryven.png",
  tags: ["ai", "models", "chat"],
};

const INFEED_ADS = [oneinchInFeed, appsignalInFeed, ideabrowserInFeed, kryvenInFeed];

const PAGE_INDEX: Record<string, number> = {
  skills: 0,
  marketplaces: 1,
  mcp: 2,
};

/**
 * Returns the 2 in-feed ads for a given page today.
 * Each advertiser appears on exactly 2 of the 3 pages per day.
 * The assignment rotates daily so all pages get equal visibility over time.
 *
 * Call this from server components only — passing the result as a prop avoids
 * hydration mismatches and gives stable output across SSR/SSG revalidation.
 */
export function getInFeedAdsForPage(pageId: string): [AdConfig, AdConfig] {
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  const n = INFEED_ADS.length;
  const offset = daysSinceEpoch % n;
  const p = PAGE_INDEX[pageId] ?? 0;
  return [
    INFEED_ADS[(p + offset) % n],
    INFEED_ADS[(p + offset + 1) % n],
  ];
}

// — Floating Banner configs —

export const FLOATING_BANNERS: BannerConfig[] = [
  {
    id: "mockhero",
    text: "MockHero — generate realistic test data with one API call. 156 field types, 22 locales, JSON/CSV/SQL output.",
    cta: "Try Free",
    href: "https://mockhero.dev/?utm_source=claudemarketplaces&utm_medium=floating_banner&utm_campaign=mar_apr2026",
    icon: "/mockhero.png",
    external: true,
  },
  {
    id: "1inch",
    text: "Agent, run crypto. Access onchain data & trade routes via 1inch",
    cta: "Try now",
    href: "https://business.1inch.com/1inch-mcp?utm_source=claudemarketplaces&utm_medium=cpm&utm_campaign=1inch-mcp-awareness&utm_content=floating-banner",
    icon: "/1inch.png",
    external: true,
  },
  {
    id: "appsignal",
    text: "AppSignal — Monitor with ease. Code with confidence.",
    cta: "Start Free Trial",
    href: "https://www.appsignal.com/?utm_source=native&utm_medium=paid&utm_campaign=claudemarketplaces",
    icon: "/appsignal.svg",
    external: true,
  },
  {
    id: "ideabrowser",
    text: "ideabrowser.com — find trending startup ideas with real demand",
    cta: "Install now",
    href: "https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026",
    icon: "/ideabrowser-symbol.webp",
    external: true,
  },
  {
    id: "kryven",
    text: "Kryven AI — chat and build with the world's leading uncensored AI models.",
    cta: "Try Kryven free",
    href: "https://kryven.cc/chat?utm_source=claudemarketplaces&utm_medium=ad&utm_campaign=launch",
    icon: "/kryven.png",
    external: true,
  },
];

/**
 * Returns the index of the banner to show first today. Rotates daily so each
 * advertiser gets equal first-impression visibility over time.
 *
 * Call this from server components only — passing the result as a prop avoids
 * the brief flash of the wrong initial banner during hydration.
 */
export function getInitialFloatingBannerIndex(): number {
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  return daysSinceEpoch % FLOATING_BANNERS.length;
}

export function getFeaturedCardsOffset(): number {
  return Math.floor(Date.now() / 86_400_000) % 4;
}

// — Tier inventory (for /advertise scarcity badges) —

export type AdTierId =
  | "all-placements"
  | "pinned-cards"
  | "in-feed-cards"
  | "floating-banner";

export interface TierInventory {
  total: number;
  taken: number;
}

/**
 * Hand-tuned slot inventory per ad tier. All-Placements customers count
 * toward each lower tier because they rotate through every surface.
 *
 * Update `taken` when a sale closes or a customer churns.
 */
export const TIER_INVENTORY: Record<AdTierId, TierInventory> = {
  "all-placements": { total: 6, taken: 5 },
  "pinned-cards": { total: 6, taken: 5 },
  "in-feed-cards": { total: 6, taken: 5 },
  "floating-banner": { total: 6, taken: 5 },
};

export function getSlotsRemaining(tierId: AdTierId): number {
  const tier = TIER_INVENTORY[tierId];
  return Math.max(0, tier.total - tier.taken);
}

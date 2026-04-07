#!/usr/bin/env bun
/**
 * Per-advertiser impression and click report from OpenPanel.
 *
 * Usage:
 *   bun run scripts/ad-report.ts                    # all advertisers, 7d
 *   bun run scripts/ad-report.ts --days 14          # 14d
 *   bun run scripts/ad-report.ts --customer 1inch   # filter to one customer
 *   bun run scripts/ad-report.ts --json             # machine-readable output
 *
 * Requires OPENPANEL_EXPORT_CLIENT_ID and OPENPANEL_EXPORT_CLIENT_SECRET in
 * .env.local (the regular tracking client cannot read events — you need a
 * separate "read" client created in the OpenPanel dashboard).
 */

// — Load .env.local (matches the pattern in scripts/crawl-skills.ts) —
const envFile = Bun.file(`${import.meta.dir}/../.env.local`);
if (await envFile.exists()) {
  const text = await envFile.text();
  for (const line of text.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const CLIENT_ID = process.env.OPENPANEL_EXPORT_CLIENT_ID;
const CLIENT_SECRET = process.env.OPENPANEL_EXPORT_CLIENT_SECRET;
const API_BASE =
  process.env.OPENPANEL_API_BASE ?? "https://analytics.vinena.studio/api";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing OPENPANEL_EXPORT_CLIENT_ID or OPENPANEL_EXPORT_CLIENT_SECRET in .env.local",
  );
  process.exit(1);
}

// — CLI args —
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const days = parseInt(getArg("days") ?? "7", 10);
const customerFilter = getArg("customer");
const outputJson = args.includes("--json");

const endDate = new Date();
const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

// — Customers we currently sell —
// Old card values (advertise-here, ideabrowser-workshop, ideabrowser-newsletter,
// supastarter, etc.) are excluded from the report. Pass --include-historical
// to see them.
const CURRENT_CUSTOMERS = ["1inch", "appsignal", "ideabrowser", "mockhero"];

// — Event types we care about —
// Each surface has a (impression_event, click_event) pair. The property name
// inside `properties` differs by surface (`card` vs `banner`). For surfaces
// where per-card impressions weren't tracked historically (floating banner,
// featured), we use the section-level event as a shared fallback denominator.
const SURFACES = [
  {
    label: "in-feed",
    impression: "infeed_card_viewed",
    click: "infeed_card_clicked",
    propKey: "card",
    fallbackImpression: undefined, // per-card impressions exist
  },
  {
    label: "floating banner",
    impression: "floating_banner_viewed",
    click: "floating_banner_clicked",
    propKey: "banner",
    // Pre-2026-04-07, floating_banner_viewed fired without a banner prop. Those
    // events still count toward "the banner area was on screen" so we treat
    // them as a shared denominator for any banner whose own impressions are 0.
    fallbackImpression: "floating_banner_viewed",
  },
  {
    label: "featured",
    impression: "featured_card_viewed", // shipped 2026-04-07; backfills as time passes
    click: "featured_card_clicked",
    propKey: "card",
    // Pre-2026-04-07, only featured_section_viewed fired (no card prop). Use it
    // as a shared denominator for cards whose own impressions are 0.
    fallbackImpression: "featured_section_viewed",
  },
] as const;

type EventRow = {
  id: string;
  name: string;
  createdAt: string;
  path?: string;
  properties?: Record<string, unknown>;
};

type FetchResult = {
  rows: EventRow[];
  totalCount: number;
};

// — HTTP helper —
const HEADERS = {
  "openpanel-client-id": CLIENT_ID,
  "openpanel-client-secret": CLIENT_SECRET,
  // Cloudflare in front of analytics.vinena.studio rejects the default Bun
  // user-agent with a 403; any normal UA bypasses it.
  "User-Agent": "ad-report/1.0 (claudemarketplaces)",
  Accept: "application/json",
};

async function getJson(url: string): Promise<unknown> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { headers: HEADERS });
      if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
      return await r.json();
    } catch (e) {
      lastErr = e;
      await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/**
 * Fetch every event of a given type within [startDate, endDate], paginating
 * through 40-row pages (the server caps responses at 40 regardless of `limit`).
 */
async function fetchAllEvents(eventName: string): Promise<FetchResult> {
  const rows: EventRow[] = [];
  let totalCount = 0;
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      event: eventName,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      limit: "40",
      page: String(page),
      includes: "properties",
    });
    const data = (await getJson(
      `${API_BASE}/export/events?${params.toString()}`,
    )) as { meta: { totalCount: number }; data: EventRow[] };
    totalCount = data.meta.totalCount;
    rows.push(...data.data);
    if (data.data.length < 40 || rows.length >= totalCount) break;
    page++;
    // Polite pacing — the server is happier at ~3 req/s than blasting it.
    await new Promise((res) => setTimeout(res, 300));
  }
  return { rows, totalCount };
}

// — Aggregate —
type Row = {
  customer: string;
  surface: string;
  impressions: number;
  clicks: number;
  /** True when impressions came from a section-level fallback rather than a
   * per-card event — CTR is approximate in that case (shared denominator). */
  shared: boolean;
};
const includeHistorical = args.includes("--include-historical");
const agg = new Map<string, Row>();
const key = (customer: string, surface: string) => `${customer}|${surface}`;
const ensureRow = (customer: string, surface: string) => {
  const k = key(customer, surface);
  let row = agg.get(k);
  if (!row) {
    row = { customer, surface, impressions: 0, clicks: 0, shared: false };
    agg.set(k, row);
  }
  return row;
};

console.error(
  `Fetching events from ${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)}...`,
);

for (const surface of SURFACES) {
  const [imps, clicks] = await Promise.all([
    fetchAllEvents(surface.impression),
    fetchAllEvents(surface.click),
  ]);
  console.error(
    `  ${surface.label}: ${imps.rows.length} impressions, ${clicks.rows.length} clicks`,
  );

  // Per-card impressions
  for (const row of imps.rows) {
    const customer = String(row.properties?.[surface.propKey] ?? "");
    if (!customer) continue; // section-level event without card prop
    ensureRow(customer, surface.label).impressions++;
  }
  // Clicks
  for (const row of clicks.rows) {
    const customer = String(row.properties?.[surface.propKey] ?? "");
    if (!customer) continue;
    ensureRow(customer, surface.label).clicks++;
  }

  // Fallback: section-level impressions used as a shared denominator for any
  // active customer on this surface that didn't get its own impressions.
  if (surface.fallbackImpression) {
    let sharedImpressions = 0;
    if (surface.fallbackImpression === surface.impression) {
      // Same event, just no card/banner prop on older rows.
      sharedImpressions = imps.rows.filter(
        (r) => !r.properties?.[surface.propKey],
      ).length;
    } else {
      const fb = await fetchAllEvents(surface.fallbackImpression);
      console.error(
        `    fallback ${surface.fallbackImpression}: ${fb.rows.length}`,
      );
      sharedImpressions = fb.rows.length;
    }
    if (sharedImpressions > 0) {
      // Apply to every customer that has clicks on this surface but no
      // per-card impressions of its own.
      for (const customer of CURRENT_CUSTOMERS) {
        const row = agg.get(key(customer, surface.label));
        if (row && row.impressions === 0 && row.clicks > 0) {
          row.impressions = sharedImpressions;
          row.shared = true;
        }
      }
    }
  }
}

// — Output —
let rows = [...agg.values()];
if (!includeHistorical) {
  rows = rows.filter((r) => CURRENT_CUSTOMERS.includes(r.customer));
}
if (customerFilter) {
  rows = rows.filter((r) => r.customer === customerFilter);
}
rows.sort((a, b) =>
  a.customer === b.customer
    ? a.surface.localeCompare(b.surface)
    : a.customer.localeCompare(b.customer),
);

if (outputJson) {
  console.log(JSON.stringify({ start: startDate, end: endDate, rows }, null, 2));
  process.exit(0);
}

if (rows.length === 0) {
  console.log(`No events found for ${customerFilter ?? "any customer"} in the last ${days} days.`);
  process.exit(0);
}

const fmt = (n: number) => n.toLocaleString();
const ctr = (c: number, i: number) =>
  i ? ((c / i) * 100).toFixed(2) + "%" : "—";
const ctrCell = (r: Row) => ctr(r.clicks, r.impressions) + (r.shared ? "*" : "");
const impCell = (r: Row) => fmt(r.impressions) + (r.shared ? "*" : "");
const colWidth = (header: string, vals: string[]) =>
  Math.max(header.length, ...vals.map((v) => v.length));

const cols = {
  customer: colWidth("customer", rows.map((r) => r.customer)),
  surface: colWidth("surface", rows.map((r) => r.surface)),
  impressions: colWidth("impressions", rows.map(impCell)),
  clicks: colWidth("clicks", rows.map((r) => fmt(r.clicks))),
  ctr: colWidth("CTR", rows.map(ctrCell)),
};

const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
const header = `${pad("customer", cols.customer)}  ${pad("surface", cols.surface)}  ${pad("impressions", cols.impressions)}  ${pad("clicks", cols.clicks)}  ${pad("CTR", cols.ctr)}`;
const sep = "-".repeat(header.length);

console.log(
  `\nclaudemarketplaces.com — last ${days} day${days === 1 ? "" : "s"} (${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)})\n`,
);
console.log(header);
console.log(sep);

let lastCustomer = "";
let anyShared = false;
for (const r of rows) {
  const customerCell = r.customer === lastCustomer ? "" : r.customer;
  lastCustomer = r.customer;
  if (r.shared) anyShared = true;
  console.log(
    `${pad(customerCell, cols.customer)}  ${pad(r.surface, cols.surface)}  ${pad(impCell(r), cols.impressions)}  ${pad(fmt(r.clicks), cols.clicks)}  ${pad(ctrCell(r), cols.ctr)}`,
  );
}

// Per-customer totals: only sum impressions that aren't shared, otherwise we'd
// triple-count the same section view.
const totals = new Map<
  string,
  { impressions: number; clicks: number; hasShared: boolean }
>();
for (const r of rows) {
  const t =
    totals.get(r.customer) ?? { impressions: 0, clicks: 0, hasShared: false };
  if (!r.shared) t.impressions += r.impressions;
  t.clicks += r.clicks;
  if (r.shared) t.hasShared = true;
  totals.set(r.customer, t);
}

console.log(`\ntotals across all surfaces (per-card impressions only):`);
for (const [customer, t] of totals) {
  const note = t.hasShared
    ? " (some surfaces still on shared impressions — see below)"
    : "";
  console.log(
    `  ${customer}: ${fmt(t.impressions)} impressions, ${fmt(t.clicks)} clicks (${ctr(t.clicks, t.impressions)})${note}`,
  );
}

if (anyShared) {
  console.log(
    `\n* shared denominator — surface didn't track per-card impressions for the\n  full window. CTR is approximate (clicks divided by total section views).`,
  );
}

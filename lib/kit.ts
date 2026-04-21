const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_API_BASE = "https://api.kit.com/v4";

export interface KitBroadcast {
  id: number;
  subject: string;
  preview_text: string | null;
  description: string | null;
  content: string;
  public: boolean;
  published_at: string | null;
  send_at: string | null;
  public_url: string | null;
  thumbnail_url: string | null;
}

export interface BroadcastSummary {
  id: number;
  slug: string;
  subject: string;
  preview_text: string | null;
  send_at: string;
  public_url: string | null;
}

function extractSlug(broadcast: KitBroadcast): string {
  if (broadcast.public_url) {
    try {
      const url = new URL(broadcast.public_url);
      const slug = url.pathname.split("/").filter(Boolean).pop();
      if (slug) return slug;
    } catch {
      // fall through to id-based slug
    }
  }
  return `broadcast-${broadcast.id}`;
}

async function kitFetch<T>(
  endpoint: string,
  revalidateSec: number,
): Promise<T | null> {
  if (!KIT_API_KEY) {
    console.warn("[kit] KIT_API_KEY not set");
    return null;
  }
  try {
    const res = await fetch(`${KIT_API_BASE}${endpoint}`, {
      headers: {
        "X-Kit-Api-Key": KIT_API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: revalidateSec },
    });
    if (!res.ok) {
      console.error("[kit] fetch failed:", res.status, await res.text());
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("[kit] fetch threw:", err);
    return null;
  }
}

function isPublished(b: KitBroadcast): boolean {
  return (
    b.public === true &&
    !!b.send_at &&
    new Date(b.send_at).getTime() <= Date.now()
  );
}

export async function listPublishedBroadcasts(): Promise<BroadcastSummary[]> {
  const data = await kitFetch<{ broadcasts: KitBroadcast[] }>(
    "/broadcasts?per_page=50",
    3600,
  );
  if (!data?.broadcasts) return [];
  return data.broadcasts
    .filter(isPublished)
    .sort((a, b) => (a.send_at! < b.send_at! ? 1 : -1))
    .map((b) => ({
      id: b.id,
      slug: extractSlug(b),
      subject: b.subject,
      preview_text: b.preview_text,
      send_at: b.send_at!,
      public_url: b.public_url,
    }));
}

export async function getBroadcastBySlug(
  slug: string,
): Promise<KitBroadcast | null> {
  // Kit has no direct slug lookup; fetch the list and match.
  // Same ISR cache applies — effectively one upstream call per revalidate window.
  const data = await kitFetch<{ broadcasts: KitBroadcast[] }>(
    "/broadcasts?per_page=50",
    3600,
  );
  if (!data?.broadcasts) return null;
  return (
    data.broadcasts
      .filter(isPublished)
      .find((b) => extractSlug(b) === slug) ?? null
  );
}

export { extractSlug };

/**
 * Email HTML ships with <style> blocks scoped for email rendering.
 * Those styles leak into the page globally when rendered via
 * dangerouslySetInnerHTML. Strip them — the /digest page relies on its
 * own prose + Tailwind styling.
 */
export function sanitizeBroadcastHtml(html: string): string {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").trim();
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isDevPreview } from "@/lib/supabase/dev-preview";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { McpServerCard } from "@/components/mcp-server-card";
import { MarketplaceCard } from "@/components/marketplace-card";
import { PluginCard } from "@/components/plugin-card";
import { SkillCard } from "@/components/skill-card";
import type { McpServer, Marketplace, Plugin, Skill } from "@/lib/types";
import {
  mapMcpServerRow,
  mapMarketplaceRow,
  mapPluginRow,
  mapSkillRow,
  type McpServerRow,
  type MarketplaceRow,
  type PluginRow,
  type SkillRow,
} from "@/lib/supabase/mappers";

interface BookmarkRow {
  item_type: string;
  item_id: string;
}

interface SavedItems {
  mcp_servers: McpServer[];
  marketplaces: Marketplace[];
  plugins: Plugin[];
  skills: Skill[];
}

const EMPTY_ITEMS: SavedItems = {
  mcp_servers: [],
  marketplaces: [],
  plugins: [],
  skills: [],
};

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isDevPreview()) {
          setAuthenticated(true);
          setIsMock(true);
          setSavedItems(EMPTY_ITEMS);
          setLoading(false);
          return;
        }
        router.push("/login?next=/saved");
        return;
      }

      setAuthenticated(true);

      const { data: bookmarks, error } = await supabase
        .from("bookmarks")
        .select("item_type, item_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !bookmarks) {
        setSavedItems(EMPTY_ITEMS);
        setLoading(false);
        return;
      }

      const byType: Record<string, string[]> = {
        mcp_server: [],
        marketplace: [],
        plugin: [],
        skill: [],
      };

      for (const b of bookmarks as BookmarkRow[]) {
        if (byType[b.item_type]) {
          byType[b.item_type].push(b.item_id);
        }
      }

      const [mcpResult, marketplaceResult, pluginResult, skillResult] =
        await Promise.all([
          byType.mcp_server.length > 0
            ? supabase
                .from("mcp_servers")
                .select("*")
                .in("slug", byType.mcp_server)
            : Promise.resolve({ data: [], error: null }),
          byType.marketplace.length > 0
            ? supabase
                .from("marketplaces")
                .select("*")
                .in("repo", byType.marketplace)
            : Promise.resolve({ data: [], error: null }),
          byType.plugin.length > 0
            ? supabase.from("plugins").select("*").in("id", byType.plugin)
            : Promise.resolve({ data: [], error: null }),
          byType.skill.length > 0
            ? supabase.from("skills").select("*").in("id", byType.skill)
            : Promise.resolve({ data: [], error: null }),
        ]);

      const mcpMap = new Map<string, McpServer>();
      for (const row of (mcpResult.data ?? []) as McpServerRow[]) {
        mcpMap.set(row.slug, mapMcpServerRow(row));
      }
      const mcp_servers = byType.mcp_server
        .map((id) => mcpMap.get(id))
        .filter((x): x is McpServer => !!x);

      const marketplaceMap = new Map<string, Marketplace>();
      for (const row of (marketplaceResult.data ?? []) as MarketplaceRow[]) {
        marketplaceMap.set(row.repo, mapMarketplaceRow(row));
      }
      const marketplaces = byType.marketplace
        .map((id) => marketplaceMap.get(id))
        .filter((x): x is Marketplace => !!x);

      const pluginMap = new Map<string, Plugin>();
      for (const row of (pluginResult.data ?? []) as PluginRow[]) {
        pluginMap.set(row.id, mapPluginRow(row));
      }
      const plugins = byType.plugin
        .map((id) => pluginMap.get(id))
        .filter((x): x is Plugin => !!x);

      const skillMap = new Map<string, Skill>();
      for (const row of (skillResult.data ?? []) as SkillRow[]) {
        skillMap.set(row.id, mapSkillRow(row));
      }
      const skills = byType.skill
        .map((id) => skillMap.get(id))
        .filter((x): x is Skill => !!x);

      setSavedItems({ mcp_servers, marketplaces, plugins, skills });
      setLoading(false);
    };

    load();
  }, [router]);

  const totalCount = savedItems
    ? savedItems.mcp_servers.length +
      savedItems.marketplaces.length +
      savedItems.plugins.length +
      savedItems.skills.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Status chip */}
          <div
            className={
              isMock
                ? "inline-flex items-center gap-2 border border-border bg-secondary/50 px-2.5 py-1 mb-8"
                : "inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-8"
            }
          >
            <Bookmark
              className={
                isMock
                  ? "h-3 w-3 text-muted-foreground"
                  : "h-3 w-3 text-primary"
              }
              strokeWidth={2.5}
            />
            <span
              className={
                isMock
                  ? "text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium"
                  : "text-[10px] uppercase tracking-[0.14em] text-primary font-medium"
              }
            >
              {isMock ? "Dev preview" : "Library"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            Your <span className="italic">library</span>.
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-12 leading-relaxed">
            Everything you&apos;ve bookmarked across the directory, grouped by
            kind.
          </p>

          {totalCount === 0 ? (
            <div className="border-t border-border pt-16 pb-24 flex flex-col items-center text-center">
              <p className="font-serif italic text-2xl md:text-3xl font-normal text-muted-foreground mb-3">
                Nothing saved yet.
              </p>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Tap the bookmark icon on any skill, marketplace, plugin, or MCP
                server to keep it here for later.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {savedItems!.skills.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Skills
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                      {savedItems!.skills.length}
                    </p>
                  </div>
                  <VoteProvider
                    itemType="skill"
                    itemIds={savedItems!.skills.map((s) => s.id)}
                  >
                    <BookmarkProvider
                      itemType="skill"
                      itemIds={savedItems!.skills.map((s) => s.id)}
                      initialBookmarks={Object.fromEntries(
                        savedItems!.skills.map((s) => [s.id, true]),
                      )}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems!.skills.map((skill) => (
                          <SkillCard key={skill.id} skill={skill} />
                        ))}
                      </div>
                    </BookmarkProvider>
                  </VoteProvider>
                </section>
              )}

              {savedItems!.mcp_servers.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      MCP servers
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                      {savedItems!.mcp_servers.length}
                    </p>
                  </div>
                  <VoteProvider
                    itemType="mcp_server"
                    itemIds={savedItems!.mcp_servers.map((s) => s.slug)}
                  >
                    <BookmarkProvider
                      itemType="mcp_server"
                      itemIds={savedItems!.mcp_servers.map((s) => s.slug)}
                      initialBookmarks={Object.fromEntries(
                        savedItems!.mcp_servers.map((s) => [s.slug, true]),
                      )}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems!.mcp_servers.map((server) => (
                          <McpServerCard key={server.slug} server={server} />
                        ))}
                      </div>
                    </BookmarkProvider>
                  </VoteProvider>
                </section>
              )}

              {savedItems!.marketplaces.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Marketplaces
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                      {savedItems!.marketplaces.length}
                    </p>
                  </div>
                  <VoteProvider
                    itemType="marketplace"
                    itemIds={savedItems!.marketplaces.map((m) => m.repo)}
                  >
                    <BookmarkProvider
                      itemType="marketplace"
                      itemIds={savedItems!.marketplaces.map((m) => m.repo)}
                      initialBookmarks={Object.fromEntries(
                        savedItems!.marketplaces.map((m) => [m.repo, true]),
                      )}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems!.marketplaces.map((marketplace) => (
                          <MarketplaceCard
                            key={marketplace.repo}
                            marketplace={marketplace}
                          />
                        ))}
                      </div>
                    </BookmarkProvider>
                  </VoteProvider>
                </section>
              )}

              {savedItems!.plugins.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Plugins
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                      {savedItems!.plugins.length}
                    </p>
                  </div>
                  <VoteProvider
                    itemType="plugin"
                    itemIds={savedItems!.plugins.map((p) => p.id)}
                  >
                    <BookmarkProvider
                      itemType="plugin"
                      itemIds={savedItems!.plugins.map((p) => p.id)}
                      initialBookmarks={Object.fromEntries(
                        savedItems!.plugins.map((p) => [p.id, true]),
                      )}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedItems!.plugins.map((plugin) => (
                          <PluginCard key={plugin.id} plugin={plugin} />
                        ))}
                      </div>
                    </BookmarkProvider>
                  </VoteProvider>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?next=/saved");
        return;
      }

      setAuthenticated(true);

      // Fetch all bookmarks for this user
      const { data: bookmarks, error } = await supabase
        .from("bookmarks")
        .select("item_type, item_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !bookmarks) {
        setSavedItems({ mcp_servers: [], marketplaces: [], plugins: [], skills: [] });
        setLoading(false);
        return;
      }

      // Group bookmark IDs by type
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

      // Fetch actual items in parallel
      const [mcpResult, marketplaceResult, pluginResult, skillResult] = await Promise.all([
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
          ? supabase
              .from("plugins")
              .select("*")
              .in("id", byType.plugin)
          : Promise.resolve({ data: [], error: null }),
        byType.skill.length > 0
          ? supabase
              .from("skills")
              .select("*")
              .in("id", byType.skill)
          : Promise.resolve({ data: [], error: null }),
      ]);

      // Map rows to typed objects, preserving bookmark order
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

  const totalCount =
    savedItems
      ? savedItems.mcp_servers.length +
        savedItems.marketplaces.length +
        savedItems.plugins.length +
        savedItems.skills.length
      : 0;

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-8 pb-4">
          <h1 className="text-sm uppercase tracking-[0.12em]">Saved</h1>
        </div>

        {totalCount === 0 ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-muted-foreground mb-2">No saved items yet.</p>
            <p className="text-sm text-muted-foreground">
              Use the bookmark icon on any skill, marketplace, plugin, or MCP server to save it here.
            </p>
          </div>
        ) : (
          <div className="container mx-auto px-4 pb-12 space-y-10">
            {savedItems!.mcp_servers.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
                  MCP Servers
                </h2>
                <VoteProvider itemType="mcp_server" itemIds={savedItems!.mcp_servers.map(s => s.slug)}>
                  <BookmarkProvider itemType="mcp_server" itemIds={savedItems!.mcp_servers.map(s => s.slug)} initialBookmarks={Object.fromEntries(savedItems!.mcp_servers.map(s => [s.slug, true]))}>
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
                <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
                  Marketplaces
                </h2>
                <VoteProvider itemType="marketplace" itemIds={savedItems!.marketplaces.map(m => m.repo)}>
                  <BookmarkProvider itemType="marketplace" itemIds={savedItems!.marketplaces.map(m => m.repo)} initialBookmarks={Object.fromEntries(savedItems!.marketplaces.map(m => [m.repo, true]))}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedItems!.marketplaces.map((marketplace) => (
                        <MarketplaceCard key={marketplace.repo} marketplace={marketplace} />
                      ))}
                    </div>
                  </BookmarkProvider>
                </VoteProvider>
              </section>
            )}

            {savedItems!.plugins.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
                  Plugins
                </h2>
                <VoteProvider itemType="plugin" itemIds={savedItems!.plugins.map(p => p.id)}>
                  <BookmarkProvider itemType="plugin" itemIds={savedItems!.plugins.map(p => p.id)} initialBookmarks={Object.fromEntries(savedItems!.plugins.map(p => [p.id, true]))}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedItems!.plugins.map((plugin) => (
                        <PluginCard key={plugin.id} plugin={plugin} />
                      ))}
                    </div>
                  </BookmarkProvider>
                </VoteProvider>
              </section>
            )}

            {savedItems!.skills.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
                  Skills
                </h2>
                <VoteProvider itemType="skill" itemIds={savedItems!.skills.map(s => s.id)}>
                  <BookmarkProvider itemType="skill" itemIds={savedItems!.skills.map(s => s.id)} initialBookmarks={Object.fromEntries(savedItems!.skills.map(s => [s.id, true]))}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedItems!.skills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </BookmarkProvider>
                </VoteProvider>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

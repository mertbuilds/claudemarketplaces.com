import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { invalidateSkillsMemo } from "@/lib/data/skills";
import { invalidateMarketplacesMemo } from "@/lib/data/marketplaces";
import { invalidateMcpServersMemo } from "@/lib/data/mcp-servers";

const TARGETS: Record<string, { paths: string[]; invalidateMemo: () => void }> = {
  skills: {
    paths: ["/", "/skills"],
    invalidateMemo: invalidateSkillsMemo,
  },
  marketplaces: {
    paths: ["/", "/marketplaces"],
    invalidateMemo: invalidateMarketplacesMemo,
  },
  mcp: {
    paths: ["/", "/mcp"],
    invalidateMemo: invalidateMcpServersMemo,
  },
};

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const target = tag ? TARGETS[tag] : undefined;

  if (!target) {
    return NextResponse.json(
      { error: `Invalid tag. Must be one of: ${Object.keys(TARGETS).join(", ")}` },
      { status: 400 }
    );
  }

  target.invalidateMemo();
  for (const path of target.paths) {
    revalidatePath(path, "layout");
  }

  return NextResponse.json({ ok: true, revalidated: tag, paths: target.paths });
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 410 Gone for malformed plugin paths. The /plugins/[slug] route is
  // single-segment, so any /plugins/<x>/<more>... URL is crawl debris from
  // an earlier version of the site. Returning 410 (instead of the default
  // 404) tells Google to drop these from the index faster.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/plugins/") && pathname.split("/").length > 3) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // Skip auth refresh for public API routes that don't need it.
  // This avoids a Supabase roundtrip on every edge request.
  const publicApiPrefixes = [
    "/api/mcp-servers",
    "/api/skills",
    "/api/marketplaces",
    "/api/search",
    "/api/search-skills",
    "/api/op/",
    "/api/consent",
    "/api/feedback",
  ];
  if (publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token only for routes that need authentication
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/api/:path*",
    "/login",
    "/welcome",
    "/plugins/:slug/:rest+",
  ],
};

import Image from "next/image";

export default function ThumbnailPage() {
  return (
    <div className="dark min-h-screen bg-[#09090b] flex items-center justify-center p-8">
      {/* Thumbnail Card — exactly 1200x630 */}
      <div
        className="relative overflow-hidden"
        style={{ width: 1200, height: 630 }}
      >
        {/* === BACKGROUND LAYERS === */}

        {/* Base dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0c0c0f 0%, #09090b 40%, #0f0a09 100%)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Diagonal accent line — top right */}
        <div
          className="absolute -top-20 -right-20 w-[700px] h-[700px] opacity-[0.03]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, transparent 0deg, hsl(12.79, 80.33%, 65.39%) 90deg, transparent 180deg)",
          }}
        />

        {/* Large radial glow behind content — left side */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-32"
          style={{
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.08) 0%, transparent 65%)",
          }}
        />

        {/* Secondary glow — bottom right, cooler */}
        <div
          className="absolute -bottom-40 -right-20"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Noise overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* === CONTENT === */}
        <div className="relative z-10 flex h-full">
          {/* Left column — main text content */}
          <div className="flex flex-col justify-center pl-16 pr-8 w-[660px]">
            {/* Logo + brand */}
            <div className="flex items-center gap-3.5 mb-10">
              <Image
                src="/favicon/android-chrome-512x512.png"
                alt="CCM"
                width={40}
                height={40}
                className="rounded-[4px]"
              />
              <span
                className="font-[family-name:var(--font-bbh-sans)] text-[13px] tracking-[0.2em] text-[#a1a1aa]"
              >
                CLAUDE CODE MARKETPLACES
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-[family-name:var(--font-bbh-sans)] text-[72px] leading-[0.9] tracking-[-0.02em] text-white mb-5"
            >
              ALL
              <br />
              <span style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}>
                PLACEMENTS
              </span>
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-7">
              <span
                className="font-mono text-[40px] font-bold tracking-tight text-white"
              >
                $999
              </span>
              <span className="font-mono text-[18px] text-[#71717a]">
                / month
              </span>
            </div>

            {/* Tagline */}
            <p className="font-serif text-[20px] italic text-[#a1a1aa] leading-relaxed max-w-[460px]">
              Maximum visibility across every page. Every ad type. Every
              impression.
            </p>
          </div>

          {/* Right column — visual ad placement mockups */}
          <div className="flex-1 flex items-center justify-center pr-12">
            <div className="relative w-[420px] h-[460px]">
              {/* Glow behind cards */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: 300,
                  height: 300,
                  background:
                    "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.12) 0%, transparent 70%)",
                }}
              />

              {/* Featured Card mockup — large, top */}
              <div
                className="absolute top-0 left-4 w-[260px] h-[150px] rounded-none border border-white/[0.08] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0.95) 100%)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: "hsl(12.79, 80.33%, 65.39%)",
                      }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase"
                      style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}
                    >
                      Featured
                    </span>
                  </div>
                  <div className="w-28 h-2 bg-white/10 rounded-sm mb-2" />
                  <div className="w-40 h-2 bg-white/[0.06] rounded-sm mb-2" />
                  <div className="w-20 h-2 bg-white/[0.04] rounded-sm mb-4" />
                  <div className="flex gap-2">
                    <div className="w-14 h-5 rounded-none border border-white/[0.08] bg-white/[0.03]" />
                    <div className="w-14 h-5 rounded-none border border-white/[0.08] bg-white/[0.03]" />
                  </div>
                </div>
              </div>

              {/* In-Feed Card mockup — medium, overlapping mid-right */}
              <div
                className="absolute bottom-[40px] right-0 z-10 w-[220px] h-[130px] rounded-none border border-white/[0.08] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.85) 0%, rgba(9,9,11,0.9) 100%)",
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: "hsl(12.79, 80.33%, 65.39%)",
                        opacity: 0.7,
                      }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#71717a]">
                      In-Feed
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-white/10 rounded-sm mb-2" />
                  <div className="w-36 h-2 bg-white/[0.06] rounded-sm mb-2" />
                  <div className="w-16 h-2 bg-white/[0.04] rounded-sm" />
                </div>
              </div>

              {/* Banner placement mockup — wide, bottom */}
              <div
                className="absolute -bottom-[10px] -left-8 right-8 h-[80px] rounded-none border border-white/[0.08] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.85) 0%, rgba(9,9,11,0.9) 100%)",
                }}
              >
                <div className="p-4 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-none flex-shrink-0 border border-white/[0.06]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsla(12.79, 80.33%, 65.39%, 0.15), transparent)",
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#71717a]">
                        Banner
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-sm mb-1.5" />
                    <div className="w-3/4 h-2 bg-white/[0.06] rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Connecting lines / accent dots */}
              <div
                className="absolute top-[142px] left-[268px] w-[24px] h-px"
                style={{
                  background:
                    "linear-gradient(90deg, hsla(12.79, 80.33%, 65.39%, 0.3), hsla(12.79, 80.33%, 65.39%, 0.05))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar — subtle accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsla(12.79, 80.33%, 65.39%, 0.3) 30%, hsla(12.79, 80.33%, 65.39%, 0.3) 70%, transparent)",
          }}
        />

        {/* Top-left corner accent */}
        <div
          className="absolute top-0 left-0 w-24 h-px"
          style={{
            background:
              "linear-gradient(90deg, hsla(12.79, 80.33%, 65.39%, 0.4), transparent)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-px h-24"
          style={{
            background:
              "linear-gradient(180deg, hsla(12.79, 80.33%, 65.39%, 0.4), transparent)",
          }}
        />

        {/* Outer border */}
        <div className="absolute inset-0 border border-white/[0.06] pointer-events-none" />
      </div>
    </div>
  );
}

import Image from "next/image";

export default function ThumbnailFloatingBanner() {
  return (
    <div className="dark min-h-screen bg-[#09090b] flex items-center justify-center p-8">
      <div
        className="relative overflow-hidden"
        style={{ width: 1200, height: 630 }}
      >
        {/* === BACKGROUND LAYERS === */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0c0c0f 0%, #09090b 40%, #0f0a09 100%)",
          }}
        />
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
        <div
          className="absolute -top-20 -right-20 w-[700px] h-[700px] opacity-[0.03]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, transparent 0deg, hsl(12.79, 80.33%, 65.39%) 90deg, transparent 180deg)",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-32"
          style={{
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-20"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* === CONTENT === */}
        <div className="relative z-10 flex h-full">
          <div className="flex flex-col justify-center pl-16 pr-8 w-[660px]">
            <div className="flex items-center gap-3.5 mb-10">
              <Image
                src="/favicon/android-chrome-512x512.png"
                alt="CCM"
                width={40}
                height={40}
                className="rounded-[4px]"
              />
              <span className="font-[family-name:var(--font-bbh-sans)] text-[13px] tracking-[0.2em] text-[#a1a1aa]">
                CLAUDE CODE MARKETPLACES
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-bbh-sans)] text-[60px] leading-[0.9] tracking-[-0.02em] text-white mb-5">
              FLOATING
              <br />
              <span style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}>
                BANNER
              </span>
            </h1>

            <div className="flex items-baseline gap-2.5 mb-7">
              <span className="font-mono text-[40px] font-bold tracking-tight text-white">
                $299
              </span>
              <span className="font-mono text-[18px] text-[#71717a]">
                / month
              </span>
            </div>

            <p className="font-serif text-[20px] italic text-[#a1a1aa] leading-relaxed max-w-[460px]">
              Always visible. Pinned to the corner as users browse every page.
            </p>
          </div>

          {/* Right column — browser mockup with floating banner */}
          <div className="flex-1 flex items-center justify-center pr-12">
            <div className="relative w-[420px] h-[460px]">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: 300,
                  height: 300,
                  background:
                    "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.12) 0%, transparent 70%)",
                }}
              />

              {/* Browser window mockup */}
              <div
                className="absolute top-[20px] left-[10px] w-[380px] h-[380px] rounded-none border border-white/[0.08] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.6) 0%, rgba(9,9,11,0.7) 100%)",
                }}
              >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/[0.1]" />
                    <div className="w-2 h-2 rounded-full bg-white/[0.1]" />
                    <div className="w-2 h-2 rounded-full bg-white/[0.1]" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-40 h-3 bg-white/[0.04] rounded-sm mx-auto" />
                  </div>
                </div>

                {/* Page content mockup */}
                <div className="p-5 space-y-3">
                  <div className="w-32 h-2.5 bg-white/[0.06] rounded-sm" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                  </div>
                  <div className="w-24 h-2 bg-white/[0.04] rounded-sm" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                    <div className="h-16 border border-white/[0.04] bg-white/[0.02]" />
                  </div>
                </div>

                {/* Floating banner — bottom right of browser */}
                <div
                  className="absolute bottom-4 right-4 z-20 flex items-center gap-3 px-4 py-3 border backdrop-blur-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(9,9,11,0.98) 100%)",
                    borderColor: "hsla(12.79, 80.33%, 65.39%, 0.35)",
                    boxShadow:
                      "0 0 30px hsla(12.79, 80.33%, 65.39%, 0.08), 0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <div>
                    <p className="font-mono text-[11px] text-white leading-tight mb-1">
                      Your product here
                    </p>
                    <p className="font-mono text-[9px] text-[#71717a]">
                      Always visible to users
                    </p>
                  </div>
                  <div
                    className="shrink-0 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wide"
                    style={{
                      background: "hsl(12.79, 80.33%, 65.39%)",
                      color: "#0e0e0e",
                    }}
                  >
                    CTA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsla(12.79, 80.33%, 65.39%, 0.3) 30%, hsla(12.79, 80.33%, 65.39%, 0.3) 70%, transparent)",
          }}
        />
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
        <div className="absolute inset-0 border border-white/[0.06] pointer-events-none" />
      </div>
    </div>
  );
}

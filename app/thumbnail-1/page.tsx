import Image from "next/image";

export default function ThumbnailPinnedCards() {
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

            <h1 className="font-[family-name:var(--font-bbh-sans)] text-[72px] leading-[0.9] tracking-[-0.02em] text-white mb-5">
              PINNED
              <br />
              <span style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}>
                CARDS
              </span>
            </h1>

            <div className="flex items-baseline gap-2.5 mb-7">
              <span className="font-mono text-[40px] font-bold tracking-tight text-white">
                $499
              </span>
              <span className="font-mono text-[18px] text-[#71717a]">
                / month
              </span>
            </div>

            <p className="font-serif text-[20px] italic text-[#a1a1aa] leading-relaxed max-w-[460px]">
              Featured cards at the top of every listing. The first thing users see.
            </p>
          </div>

          {/* Right column — pinned card mockup */}
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

              {/* Pinned/Featured card — prominent, top-left */}
              <div
                className="absolute top-[30px] left-0 w-[280px] h-[180px] rounded-none border backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0.95) 100%)",
                  borderColor: "hsla(12.79, 80.33%, 65.39%, 0.3)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "hsl(12.79, 80.33%, 65.39%)" }}
                      />
                      <span
                        className="font-mono text-[10px] tracking-[0.15em] uppercase"
                        style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}
                      >
                        Featured
                      </span>
                    </div>
                    <div
                      className="px-2 py-0.5 border text-[9px] font-mono tracking-wider uppercase"
                      style={{
                        borderColor: "hsla(12.79, 80.33%, 65.39%, 0.4)",
                        color: "hsl(12.79, 80.33%, 65.39%)",
                      }}
                    >
                      Pinned
                    </div>
                  </div>
                  <div className="w-32 h-2.5 bg-white/12 rounded-sm mb-2.5" />
                  <div className="w-44 h-2 bg-white/[0.06] rounded-sm mb-2" />
                  <div className="w-24 h-2 bg-white/[0.04] rounded-sm mb-5" />
                  <div className="flex gap-2">
                    <div className="w-14 h-5 rounded-none border border-white/[0.08] bg-white/[0.03]" />
                    <div className="w-14 h-5 rounded-none border border-white/[0.08] bg-white/[0.03]" />
                    <div className="w-14 h-5 rounded-none border border-white/[0.08] bg-white/[0.03]" />
                  </div>
                </div>
              </div>

              {/* Regular card — behind, offset right */}
              <div
                className="absolute top-[160px] right-[10px] w-[220px] h-[130px] rounded-none border border-white/[0.06] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.8) 100%)",
                }}
              >
                <div className="p-4">
                  <div className="w-24 h-2 bg-white/[0.06] rounded-sm mb-2" />
                  <div className="w-36 h-2 bg-white/[0.04] rounded-sm mb-2" />
                  <div className="w-16 h-2 bg-white/[0.03] rounded-sm" />
                </div>
              </div>

              {/* Another regular card — bottom */}
              <div
                className="absolute bottom-[40px] left-[20px] w-[220px] h-[130px] rounded-none border border-white/[0.06] backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.8) 100%)",
                }}
              >
                <div className="p-4">
                  <div className="w-20 h-2 bg-white/[0.06] rounded-sm mb-2" />
                  <div className="w-32 h-2 bg-white/[0.04] rounded-sm mb-2" />
                  <div className="w-14 h-2 bg-white/[0.03] rounded-sm" />
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

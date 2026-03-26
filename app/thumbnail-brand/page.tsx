import Image from "next/image";

export default function ThumbnailBrand() {
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
          className="absolute top-1/2 -translate-y-1/2 left-1/4"
          style={{
            width: 900,
            height: 900,
            background:
              "radial-gradient(circle, hsla(12.79, 80.33%, 65.39%, 0.07) 0%, transparent 60%)",
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/favicon/android-chrome-512x512.png"
              alt="CCM"
              width={80}
              height={80}
              className="rounded-[8px]"
            />
          </div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-bbh-sans)] text-[56px] leading-[0.9] tracking-[0.02em] text-white text-center mb-6">
            CLAUDE CODE
            <br />
            <span style={{ color: "hsl(12.79, 80.33%, 65.39%)" }}>
              MARKETPLACES
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-mono text-[48px] text-[#71717a] tracking-wide text-center">
            Advertise to 120k+ AI developers monthly
          </p>
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

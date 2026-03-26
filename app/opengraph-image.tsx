import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Claude Code Marketplaces";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image() {
  const bbhFontData = await fetch(
    "https://github.com/mert-duzgun/claudemarketplaces.com/raw/main/public/BBH_Sans_Bartle/BBHSansBartle-Regular.ttf"
  ).then((res) => res.arrayBuffer());

  const tagline = "Skills, MCP Servers & Plugin Directory";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0c0c0f 0%, #09090b 40%, #0f0a09 100%)",
        }}
      >
        {/* Radial glow — left */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-200px",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(218,127,96,0.1) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Radial glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(218,127,96,0.06) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top-left corner accent — horizontal */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "96px",
            height: "1px",
            background: "linear-gradient(90deg, rgba(218,127,96,0.5), transparent)",
            display: "flex",
          }}
        />

        {/* Top-left corner accent — vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1px",
            height: "96px",
            background: "linear-gradient(180deg, rgba(218,127,96,0.5), transparent)",
            display: "flex",
          }}
        />

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 10%, rgba(218,127,96,0.3) 30%, rgba(218,127,96,0.3) 70%, transparent 90%)",
            display: "flex",
          }}
        />

        {/* Outer border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "48px",
            }}
          >
            <img
              src="https://claudemarketplaces.com/favicon/android-chrome-192x192.png"
              width="40"
              height="40"
              alt=""
              style={{ borderRadius: "4px" }}
            />
            <span
              style={{
                fontFamily: "BBH Sans Bartle",
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "#a1a1aa",
              }}
            >
              CLAUDE CODE MARKETPLACES
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "BBH Sans Bartle",
              fontSize: "64px",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "#ffffff" }}>CLAUDE CODE</span>
            <span style={{ color: "#da7f60" }}>MARKETPLACES</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: "22px",
              color: "#a1a1aa",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "BBH Sans Bartle",
          data: bbhFontData,
          style: "normal",
          weight: 400,
        },
        {
          name: "JetBrains Mono",
          data: await loadGoogleFont("JetBrains+Mono", tagline),
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Advertise - Claude Code Marketplaces";
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

// Image generation
export default async function Image() {
  // Load BBH Sans Bartle font from GitHub
  const bbhFontData = await fetch(
    "https://github.com/mert-duzgun/claudemarketplaces.com/raw/main/public/BBH_Sans_Bartle/BBHSansBartle-Regular.ttf"
  ).then((res) => res.arrayBuffer());

  const subtitle = "Reach AI developers building with Claude Code";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFDF7",
          padding: "80px",
        }}
      >
        {/* Main Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: "0.05em",
            color: "#ee7e60",
            marginBottom: "64px",
            textAlign: "center",
            fontFamily: "BBH Sans Bartle",
          }}
        >
          ADVERTISE WITH US
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "#000",
            textAlign: "center",
            maxWidth: "1000px",
            fontFamily: "JetBrains Mono",
          }}
        >
          {subtitle}
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
          data: await loadGoogleFont("JetBrains+Mono", subtitle),
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Afreqa Nairobi Event";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Resonance";

  const title = `Afreqa: ${formattedTitle}`;
  const tagline = "Where African Electronic Frequencies Meet Festival Fantasy";
  const venue = "The Carnivore Grounds • Nairobi, Kenya";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0504",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(22, 244, 208, 0.25) 0%, rgba(123, 47, 247, 0.3) 40%, rgba(11, 5, 4, 1) 85%)",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "48px 64px",
            borderRadius: "24px",
            background: "rgba(22, 34, 41, 0.75)",
            border: "1px solid rgba(22, 244, 208, 0.3)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            style={{
              padding: "6px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(22, 244, 208, 0.15)",
              border: "1px solid rgba(22, 244, 208, 0.4)",
              color: "#16F4D0",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Official Gathering
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "0.04em",
              color: "#EDECEC",
              marginBottom: "12px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "#B6B5B5",
              maxWidth: "800px",
              marginBottom: "24px",
            }}
          >
            {tagline}
          </div>

          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: "#16F4D0",
              letterSpacing: "0.1em",
            }}
          >
            {venue}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

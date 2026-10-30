import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Afreqa Nairobi — Kenya's Hub for Electronic Dance Music";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
            "radial-gradient(circle at 50% 20%, rgba(123, 47, 247, 0.35) 0%, rgba(22, 244, 208, 0.15) 40%, rgba(11, 5, 4, 1) 85%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid accent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(237, 236, 236, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(237, 236, 236, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.6,
          }}
        />

        {/* Laser glow flare top */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(22, 244, 208, 0.4)",
            filter: "blur(90px)",
          }}
        />

        {/* Content Box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
            borderRadius: "24px",
            background: "rgba(22, 34, 41, 0.6)",
            border: "1px solid rgba(237, 236, 236, 0.2)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {/* Tagline Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(22, 244, 208, 0.15)",
              border: "1px solid rgba(22, 244, 208, 0.4)",
              color: "#16F4D0",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Nairobi EDM Movement
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: "76px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "#EDECEC",
              textShadow: "0 0 35px rgba(22, 244, 208, 0.6)",
              marginBottom: "12px",
            }}
          >
            AFREQA
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: 500,
              color: "#B6B5B5",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            Kenya&apos;s Hub for Electronic Dance Music
          </div>

          {/* Frequency bar indicators */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "24px",
            }}
          >
            <div style={{ width: "30px", height: "4px", backgroundColor: "#16F4D0", borderRadius: "2px" }} />
            <div style={{ width: "60px", height: "4px", backgroundColor: "#7B2FF7", borderRadius: "2px" }} />
            <div style={{ width: "90px", height: "4px", backgroundColor: "#16F4D0", borderRadius: "2px" }} />
            <div style={{ width: "60px", height: "4px", backgroundColor: "#7B2FF7", borderRadius: "2px" }} />
            <div style={{ width: "30px", height: "4px", backgroundColor: "#16F4D0", borderRadius: "2px" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

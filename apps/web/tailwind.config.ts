import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        afreqa: {
          midnight: "#0d081d", // Deep cosmic violet night sky (from poster)
          shadow: "#07040d",   // Deep obsidian violet void
          stage: "#140c2a",    // Dark stage neutral with violet undertones
          surface: "#1a1036",  // Elevated purple-tinted card surface
          bevel: "#26174d",    // Cosmic bevel
          chrome: {
            high: "#FFFFFF",   // Pure specular highlight
            mid: "#D4D4D8",    // Brushed titanium silver
            dark: "#52525B",   // Dark metallic
          },
          silver: "#A1A1AA",   // Clean secondary neutral
          // Official AFREQA Brand Palette (Purple & Pink from official poster + Turquoise lasers)
          pink: "#ec4899",     // Vibrant neon fuchsia
          hotpink: "#ff2e93",  // Pinpoint neon pink from poster ribbon
          magenta: "#d946ef",  // Electric orchid / magenta
          purple: "#a855f7",   // Rich festival purple
          violet: "#c084fc",   // Lavender / lilac title glow
          deepviolet: "#7c3aed",
          turquoise: "#06b6d4",// Electric cyan / turquoise fireworks
          cyan: "#22d3ee",     // Bright turquoise laser
          blue: "#38bdf8",     // Sky laser
          crimson: "#e11d48",  // Neon crimson
          // Aliased tokens for backward compatibility
          teal: "#06b6d4",     // Electric turquoise blue
          accent: "#ec4899",   // Vibrant festival pink
          gold: "#f472b6",     // Soft pink accent
          amber: "#d946ef",    // Electric magenta
          flare: "#ec4899",
        },
      },
      boxShadow: {
        "glow-pink": "0 8px 32px -4px rgba(236, 72, 153, 0.45)",
        "glow-purple": "0 8px 32px -4px rgba(168, 85, 247, 0.4)",
        "glow-turquoise": "0 8px 32px -4px rgba(6, 182, 212, 0.4)",
        "glow-teal": "0 8px 32px -4px rgba(6, 182, 212, 0.35)",
        "glow-gold": "0 8px 32px -4px rgba(236, 72, 153, 0.35)",
        "glow-amber": "0 8px 32px -4px rgba(217, 70, 239, 0.35)",
        "glow-crimson": "0 8px 32px -4px rgba(225, 29, 72, 0.4)",
        "metallic": "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
        "metallic-hover": "0 12px 40px 0 rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "laser-pulse": "laserPulse 3s ease-in-out infinite alternate",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        laserPulse: {
          "0%": { opacity: "0.3", transform: "scale(0.98)" },
          "100%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        glowPulse: {
          "0%": { filter: "drop-shadow(0 0 10px rgba(22, 244, 208, 0.4))" },
          "100%": { filter: "drop-shadow(0 0 25px rgba(22, 244, 208, 0.9))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

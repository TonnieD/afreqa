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
          midnight: "#0F1117", // Deep night sky
          shadow: "#070709",   // Deep obsidian black base
          stage: "#15161E",    // Refined stage dark neutral
          surface: "#1C1D26",  // Elevated card surface
          bevel: "#22232E",    // Subtle bevel
          chrome: {
            high: "#FFFFFF",   // Pure specular highlight
            mid: "#D4D4D8",    // Brushed titanium silver
            dark: "#52525B",   // Dark metallic
          },
          silver: "#A1A1AA",   // Clean secondary neutral
          // Stage lights & warm ember palette (from real concert photography)
          gold: "#F59E0B",     // Warm stage amber / golden tungsten
          amber: "#D97706",    // Deep stage ember
          accent: "#E58A3C",   // Primary warm stage accent
          blue: "#3B82F6",     // Subtle concert blue wash
          crimson: "#991B1B",  // Deep stage crimson
          // Gracefully remap legacy neon tokens to warm stage tones:
          teal: "#E58A3C",     // Remapped from neon cyan to warm stage amber
          violet: "#D97706",   // Remapped from neon violet to deep stage ember
          flare: "#F59E0B",    // Remapped from neon pink to warm amber flare
        },
      },
      boxShadow: {
        "glow-amber": "0 8px 30px -4px rgba(229, 138, 60, 0.25)",
        "glow-teal": "0 8px 30px -4px rgba(229, 138, 60, 0.2)",
        "glow-violet": "0 8px 30px -4px rgba(217, 119, 6, 0.2)",
        "glow-gold": "0 8px 30px -4px rgba(245, 158, 11, 0.25)",
        "glow-crimson": "0 8px 30px -4px rgba(153, 27, 27, 0.25)",
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

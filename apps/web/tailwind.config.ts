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
          midnight: "#162229", // Sampled deep sky canvas
          shadow: "#0B0504",   // Sampled deepest night base
          stage: "#24201D",    // Sampled stage dark neutral
          bevel: "#261E1D",    // 3D bevel shadow
          chrome: {
            high: "#EDECEC",   // Specular chrome highlight
            mid: "#ADADAC",    // Brushed silver
            dark: "#5A5958",   // Dark metallic
          },
          silver: "#B6B5B5",   // Equalizer soundwave bars
          violet: "#7B2FF7",   // Electric festival neon glow
          teal: "#16F4D0",     // Aurora pulse
          gold: "#F5C542",     // Warm amber stage lighting
          amber: "#372308",    // Deep stage amber
          crimson: "#370609",  // Deep festival crimson
          flare: "#F107A3",    // Magenta laser flare
        },
      },
      boxShadow: {
        "glow-violet": "0 0 30px -5px rgba(123, 47, 247, 0.5)",
        "glow-teal": "0 0 30px -5px rgba(22, 244, 208, 0.5)",
        "glow-gold": "0 0 30px -5px rgba(245, 197, 66, 0.5)",
        "glow-crimson": "0 0 30px -5px rgba(241, 7, 163, 0.5)",
        "metallic": "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        "metallic-hover": "0 12px 40px 0 rgba(22, 244, 208, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
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

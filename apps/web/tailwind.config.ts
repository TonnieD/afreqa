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
          foliage: "#24201D",  // Sampled warm dark neutral
          chrome: {
            high: "#EDECEC",   // Specular chrome highlight
            mid: "#ADADAC",    // Brushed silver
            bevel: "#261E1D",  // 3D bevel shadow
          },
          silver: "#B6B5B5",   // Equalizer soundwave bars
          violet: "#7B2FF7",   // Electric festival neon glow
          magenta: "#F107A3",  // Laser energy flare
          teal: "#16F4D0",     // Aurora pulse
          amber: "#F5C542",    // Warm stage lighting
        },
      },
      boxShadow: {
        "glow-violet": "0 0 25px -5px rgba(123, 47, 247, 0.5)",
        "glow-teal": "0 0 25px -5px rgba(22, 244, 208, 0.5)",
        "glow-amber": "0 0 25px -5px rgba(245, 197, 66, 0.5)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F1A",
        forest: "#0E3B2E",
        leaf: "#1F8A5D",
        mint: "#D9F2E5",
        sage: "#EFF7F2",
        sand: "#FAF8F4",
        amber: "#B7791F",
        clay: "#C2410C",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,31,26,0.05), 0 8px 24px rgba(11,31,26,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

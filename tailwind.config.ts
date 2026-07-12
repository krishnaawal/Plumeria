import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f6faf4",
          100: "#e7f1df",
          200: "#cfe3c1",
          500: "#618c4b",
          700: "#335a2f",
          900: "#18301c"
        },
        petal: "#fffaf1",
        cream: "#f7efe1",
        gold: "#b98b3f"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(24, 48, 28, 0.12)"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      }
    }
  },
  plugins: []
};

export default config;

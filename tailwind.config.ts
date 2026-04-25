import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0e1a",
          soft: "#1f2937",
        },
        navy: {
          50:  "#eef2f8",
          100: "#d6dfee",
          200: "#a8badd",
          300: "#7a95cc",
          400: "#4d70bb",
          500: "#2d56a4",
          600: "#1f3f7d",
          700: "#162d5a",
          800: "#0e1f3f",
          900: "#0a162e",
        },
        gold: {
          400: "#e7c45a",
          500: "#d4a017",
          600: "#a8800f",
        },
        parchment: "#f7f5ee",
        sand: "#efe9d8",
        seal: "#7a1f1f",
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Times New Roman"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        official: "0 1px 0 rgba(10,14,26,0.08), 0 8px 24px -12px rgba(10,14,26,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;

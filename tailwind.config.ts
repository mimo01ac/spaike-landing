import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1a2e",
        "ink-soft": "#3a3f4e",
        cream: "#f3eee2",
        "cream-deep": "#ece6d6",
        rule: "#d8d3c7",
        "rule-dark": "#2a3142",
        muted: "#6b6650",
        amber: {
          DEFAULT: "#d4a857",
          dark: "#b88f3f",
          soft: "#e8c98a",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Source Serif Pro", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      maxWidth: {
        content: "72rem",
        editorial: "84rem",
      },
      letterSpacing: {
        widest: "0.18em",
        wider: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;

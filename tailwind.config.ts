import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spaike: {
          blue: "#5ECEEA",
          "blue-dark": "#3FB6D4",
          dark: "#0F2A36",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#FAFAF9",
          tertiary: "#F5F5F4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;

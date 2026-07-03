import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F3EEE3",
        "paper-line": "#E4DCC9",
        ink: "#211D19",
        "ink-muted": "#6B6259",
        card: "#FFFCF6",
        hanko: "#C23B22",
        "hanko-dark": "#9C2E19",
        pen: "#2F5D8A",
        gold: "#B8860B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        graph:
          "linear-gradient(90deg, rgba(33,29,25,0.05) 1px, transparent 1px), linear-gradient(rgba(33,29,25,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        graph: "24px 24px",
      },
    },
  },
  plugins: [],
};
export default config;

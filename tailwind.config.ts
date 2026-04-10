import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#415D43",
          cream: "#FAF3DD",
          teal: "#3B7080",
        },
        surface: {
          canvas: "#FFFFFF",
          header: "#415D43",
        },
        text: {
          primary: "#000000",
          inverse: "#FAF3DD",
          accent: "#3B7080",
        },
        border: {
          accent: "#3B7080",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"Libre Caslon Text"', "serif"],
        ui: ["var(--font-ui)", "Nunito", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      spacing: {
        "layout-max": "1200px",
        "nav-h": "96px",
        "filter-w": "280px",
        "filter-h": "56px",
        card: "21rem",
        "page-top": "0px",
        "page-gutter": "24px",
      },
      boxShadow: {
        panel: "0 18px 40px rgba(65, 93, 67, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

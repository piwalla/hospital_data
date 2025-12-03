import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./actions/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-alt": "var(--background-alt)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        alert: "var(--alert)",
        "neutral-text": "var(--neutral-text)",
        "neutral-text-secondary": "var(--neutral-text-secondary)",
        "neutral-bg": "var(--neutral-bg)",
        "neutral-bg-hover": "var(--neutral-bg-hover)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
        "border-medium": "var(--border-medium)",
        ring: "var(--ring)",
      },
      borderRadius: {
        leaf: "var(--radius-md)",
        canopy: "var(--radius-lg)",
      },
      boxShadow: {
        leaf: "var(--shadow-leaf)",
        branch: "var(--shadow-branch)",
        canopy: "var(--shadow-canopy)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        brand: ["var(--font-brand)"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;










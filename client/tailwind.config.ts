import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-100": "var(--green-100)",
        "green-200": "var(--green-200)",
        "green-300": "var(--green-300)",
        "pink-100": "var(--pink-100)",
        "pink-200": "var(--pink-200)",
        "gray-100": "var(--gray-100)",
        "gray-200": "var(--gray-200)",
        "gray-300": "var(--gray-300)",
        "gray-400": "var(--gray-400)",
        "bg-primary": "var(--bg-primary-color)",
        "bg-secondary": "var(--bg-secondary-color)",
      },
      height: {
        header: "var(--header-height)",
      },
      spacing: {
        container: "var(--pd-container)",
        section: "var(--pd-section)",
      },
      gap: {
        gutter: "var(--gutter)",
      },
      fontSize: {
        h1: "var(--fs-h1)",
        h2: "var(--fs-h2)",
        h3: "var(--fs-h3)",
        "body-big": "var(--fs-body-big)",
        "body-text": "var(--fs-body-text)",
        "body-sub": "var(--fs-body-sub)",
        "primary-btn": "var(--fs-primary-btn)",
        "second-btn": "var(--fs-second-btn)",
        navlink: "var(--fs-navlink)",
        footer: "var(--fs-footer)",
      },
      fontFamily: {
        "playright-regular": "var(--ff-pl-regular)",
        "playright-medium": "var(--ff-pl-medium)",
        "playright-semibold": "var(--ff-pl-semibold)",
        "playright-bold": "var(--ff-pl-bold)",
        "roboto-regular": "var(--ff-ro-regular)",
        "roboto-medium": "var(--ff-ro-medium)",
        "roboto-bold": "var(--ff-ro-bold)",
      },
    },
  },
  plugins: [],
} satisfies Config;

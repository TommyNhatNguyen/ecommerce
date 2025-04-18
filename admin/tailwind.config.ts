import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/shared/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-100": "var(--green-100)",
        "green-200": "var(--green-200)",
        "green-300": "var(--green-300)",
        "green-300/80": "var(--green-300-80)",
        "pink-100": "var(--pink-100)",
        "pink-200": "var(--pink-200)",
        "gray-100": "var(--gray-100)",
        "gray-200": "var(--gray-200)",
        "gray-300": "var(--gray-300)",
        "gray-400": "var(--gray-400)",
        "bg-primary": "var(--bg-primary-color)",
        "bg-primary-70": "var(--bg-primary-color-70)",
        "bg-primary-60": "var(--bg-primary-color-60)",
        "bg-secondary": "var(--bg-secondary-color)",
        "bg-dashboard": "var(--bg-dashboard-color)",
        "text-dashboard": "var(--text-dashboard-color)",
        "blue-link": "var(--blue-link)",
        error: "var(--error-color)",
        warning: "var(--warning-color)",
        success: "var(--success-color)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "custom-white": "var(--white-color)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      height: {
        header: "var(--header-height)",
        input: "var(--input-height)",
        btn: "var(--btn-height)",
        "macbook-screen": "var(--macbook-screen)",
      },
      minHeight: {
        "macbook-screen": "var(--macbook-screen)",
        header: "var(--header-height)",
        input: "var(--min-input-height)",
        btn: "var(--min-btn-height)",
      },
      spacing: {
        container: "var(--pd-container)",
        section: "var(--pd-section)",
        header: "var(--header-height)",
      },
      gap: {
        gutter: "var(--gutter)",
      },
      margin: {
        header: "var(--header-height)",
        "text-spacing": "var(--text-spacing)",
      },
      fontSize: {
        h1: "var(--fs-h1)",
        h2: "var(--fs-h2)",
        h3: "var(--fs-h3)",
        h4: "var(--fs-h4)",
        h5: "var(--fs-h5)",
        h6: "var(--fs-h6)",
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
        "open-sans-regular": "var(--ff-os-regular)",
        "open-sans-medium": "var(--ff-os-medium)",
        "open-sans-bold": "var(--ff-os-bold)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

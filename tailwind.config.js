/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // === Flamingo 2.0 Design System - Theme Colors ===

        // Slate Theme - Primary
        primary: "#4B4C6A",
        tertiary: "#DBDBE4",

        // Shades - Backgrounds
        bg01: "#FFFFFF",
        bg02: "#F7F7F7",
        bg03: "#EEECEA",

        // Shades - Text
        text01: "#2E2E2E",
        text02: "#4B4C6A",
        text03: "#989898",

        // Shades - Strokes
        stroke01: "#DEDAE4",

        // Selectors
        hover: "#F5F5F5",
        select: "#E6E6E5",

        // Hover Icons and Details
        pinkTP: "#FF0082",
        textLink: "#A5125D",

        // Messages - Neutral
        neutral01: "#D3E1FC",
        neutral02: "#002C81",

        // Messages - Success
        success01: "#CEF3E5",
        success02: "#00462F",

        // Messages - Error
        error01: "#FFD7D7",
        error02: "#850117",

        // Messages - Alert/Warning
        alert01: "#FFF7DA",
        alert02: "#5B4900",

        // Status
        success03: "#009A58",
        error03: "#CC0000",

        // Notifications
        notifications: "#FB0077",

        // Button Colors (derived from theme)
        buttonPrimary: "#2E2E2E",
        "buttonPrimary-hover": "#4A4A4A",
        "buttonPrimary-active": "#666666",
        "buttonPrimary-disabled": "#E0E0E0",
        buttonText: "#2E2E2E",
        "buttonText-disabled": "#A0A0A0",

        // === Legacy Colors (backward compatibility) ===
        tpPurple: "#780096",
        tpPink: "#E91E63",
        textMain: "#2E2E2E",
        textSecondary: "#656A71",
        textHeading: "#2D2D2D",
        bgPrimary: "#FFFFFF",
        bgSecondary: "#FAFAFA",
        bgTertiary: "#DDE4F8",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ['"TP Sans"', '"Noto Sans"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      fontSize: {
        // Flamingo 2.0 Typography - Base sizes (mobile-first, use responsive classes)
        // Display sizes (base = mobile)
        "display-xl": ["28px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        "display-l": ["24px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        "display-s": ["22px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        // Headings (base = mobile)
        h1: ["20px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        h2: ["18px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        h3: ["16px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        h4: ["15px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        // Body (base = mobile)
        body: ["14px", { lineHeight: "1.2", fontWeight: "400", letterSpacing: "0.3px" }],
        "body-bold": ["14px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        // Caption (base = mobile)
        caption: ["13px", { lineHeight: "1.2", fontWeight: "400", letterSpacing: "0.3px" }],
        "caption-bold": ["13px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        // Label (base = mobile)
        label: ["12px", { lineHeight: "1.2", fontWeight: "400", letterSpacing: "0.3px" }],
        "label-bold": ["12px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.3px" }],
        // Legacy (keeping for backward compatibility)
        title: ["18px", { lineHeight: "normal", fontWeight: "700" }],
        heading: ["20px", { lineHeight: "normal", fontWeight: "700" }],
        select: ["12px", { lineHeight: "normal", fontWeight: "500" }],
      },
      screens: {
        // TP Sans Type System Breakpoints
        'tablet': '768px',   // Tablet (md)
        'desktop': '1024px', // Desktop (lg)
        'large': '1280px',   // Large (xl)
        'xlarge': '1536px',  // XLarge (2xl)
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        // Icon corner radius (from design system)
        icon16: "1px",
        icon24: "2px",
        icon32: "3px",
      },
      boxShadow: {
        // Flamingo 2.0 Design System Shadow
        // Drop shadow: X: 0, Y: 4, Blur: 15, Spread: 0, Color: #959DA5 35% Opacity
        drop: "0px 4px 15px 0px rgba(149, 157, 165, 0.35)",
        // Default shadow (using drop shadow)
        DEFAULT: "0px 4px 15px 0px rgba(149, 157, 165, 0.35)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};


import type { Config } from "tailwindcss";

/**
 * Design tokens below are read directly off the approved Minar UI
 * screenshots (MINAR_UI_DOCUMENTATION.pdf). They are approximations of the
 * exact brand hex values — if an official Figma/style-guide export becomes
 * available, only this file needs to change; every component consumes
 * these tokens rather than hardcoded colors.
 *
 * Kiosk-first scaling: the base rem scale, spacing scale, and component
 * sizing are tuned for a large touchscreen kiosk display (landscape,
 * ~1280–1920px wide, viewed from ~40–60cm) first, then scaled DOWN for
 * tablet/mobile — the inverse of a typical "mobile-first" site.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/drawers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#003B35", // sidebar / header / deepest surfaces
          800: "#064A42",
          700: "#075B50", // primary buttons, active states
          600: "#0B6B5C",
          500: "#168474", // hover / mid accents
          100: "#DCEBE5", // tinted backgrounds (badges, selected chips)
          50: "#F1F7F4",
        },
        gold: {
          600: "#A8732A",
          500: "#C99A52", // active sidebar indicator, highlights
          400: "#DCAE65",
          100: "#F3E5CF",
        },
        cream: {
          100: "#F8F5EE", // app background
          200: "#F1EBDD",
          300: "#E4DAC6",
        },
        ink: {
          900: "#1A2420", // primary text
          700: "#3A443F",
          500: "#5B6560", // secondary text
          300: "#8B948F",
        },
        status: {
          good: "#2F9E58",
          goodBg: "#E6F5EC",
          mid: "#D99B2B",
          midBg: "#FBF0DD",
          bad: "#D64545",
          badBg: "#FBE7E7",
        },
        emergency: {
          DEFAULT: "#C23B3B",
          dark: "#9A2D2D",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
        latin: ["var(--font-latin)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Kiosk scale — deliberately larger than typical web defaults.
        // Actual rendered size is further multiplied by --a11y-font-scale
        // (see AccessibilityContext) so "Increase/Decrease Font" works
        // uniformly across the whole app.
        "kiosk-xs": ["1rem", { lineHeight: "1.5rem" }], // 16px
        "kiosk-sm": ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        "kiosk-base": ["1.25rem", { lineHeight: "1.9rem" }], // 20px
        "kiosk-lg": ["1.5rem", { lineHeight: "2.1rem" }], // 24px
        "kiosk-xl": ["1.875rem", { lineHeight: "2.4rem" }], // 30px
        "kiosk-2xl": ["2.25rem", { lineHeight: "2.75rem" }], // 36px
        "kiosk-3xl": ["3rem", { lineHeight: "3.5rem" }], // 48px
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        touch: "4rem", // 64px minimum touch target
        "touch-lg": "5rem", // 80px large touch target (primary actions)
      },
      borderRadius: {
        card: "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(0, 59, 53, 0.08)",
        "card-hover": "0 18px 38px rgba(0, 59, 53, 0.15)",
        drawer: "-8px 0 32px rgba(0,0,0,0.12)",
      },
      screens: {
        // Primary target: landscape kiosk display. Everything below is a
        // graceful-degradation breakpoint, not the design's home base.
        kiosk: "1280px",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;

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
          900: "#0B3B2E", // sidebar / header / deepest surfaces
          800: "#0F4A39",
          700: "#145C43", // primary buttons, active states
          600: "#1B6E4F",
          500: "#22855F", // hover / mid accents
          100: "#DCEEE4", // tinted backgrounds (badges, selected chips)
          50: "#F0F8F4",
        },
        gold: {
          600: "#A66E23",
          500: "#C68A2E", // active sidebar indicator, highlights
          400: "#D9A85A",
          100: "#F6E8CE",
        },
        cream: {
          100: "#F7F4EC", // app background
          200: "#F1ECE0",
          300: "#E9E2D2",
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
        card: "1.25rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(11, 59, 46, 0.06)",
        "card-hover": "0 8px 28px rgba(11, 59, 46, 0.12)",
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

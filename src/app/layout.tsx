import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";
import { AIAssistantDrawer } from "@/drawers/AIAssistantDrawer";
import { AccessibilityDrawer } from "@/drawers/AccessibilityDrawer";
import { NotificationDrawer } from "@/drawers/NotificationDrawer";

// Arabic display/body face used throughout (Arabic is the default locale).
const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// Latin face used when the interface is switched to English.
const latinFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منار — الكشك الذكي لضيوف الرحمن",
  description:
    "Minar Smart Kiosk — an AI-powered service gateway for Hajj & Umrah pilgrims: identification, navigation, crowd management, healthcare, and accessibility, all from one kiosk.",
};

// The kiosk display is fixed-scale (no pinch-zoom expected on a public
// touchscreen), while remaining responsive for the desktop/mobile
// fallback experience.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicFont.variable} ${latinFont.variable}`}>
      <body>
        <Providers>
          {/* AppShell is the single source of truth for Top Bar, Sidebar,
              and Bottom Bar — identical composition for every route. Only
              `children` (the matched page) varies. */}
          <AppShell>{children}</AppShell>

          {/* Global drawers — available from any screen, mounted once here
              so opening them never changes the route or loses page state. */}
          <AIAssistantDrawer />
          <AccessibilityDrawer />
          <NotificationDrawer />
        </Providers>
      </body>
    </html>
  );
}

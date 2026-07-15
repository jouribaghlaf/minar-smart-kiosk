"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { SessionProvider } from "@/context/SessionContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { NotificationsProvider } from "@/context/NotificationsContext";

/**
 * Single composition point for every global provider. Kept separate from
 * layout.tsx (a Server Component) since providers must be Client
 * Components in the App Router.
 *
 * Order matters only where one context reads another; today none do, but
 * Language is placed outermost since it affects <html dir/lang> which
 * everything else visually depends on.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <SessionProvider>
          <NotificationsProvider>
            <DrawerProvider>{children}</DrawerProvider>
          </NotificationsProvider>
        </SessionProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

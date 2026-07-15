"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

export type DrawerId = "ai-assistant" | "accessibility" | "notifications" | null;

interface DrawerContextValue {
  activeDrawer: DrawerId;
  openAIAssistant: () => void;
  openAccessibility: () => void;
  openNotifications: () => void;
  closeDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

/**
 * All three drawers (AI Assistant, Accessibility, Notifications) are
 * mounted once at the root layout and toggled via this context rather
 * than routes, so opening one never navigates away from — or loses the
 * state of — the current screen, exactly as required ("Both drawers
 * should open above the current screen without changing the current
 * page" — extended here to all three).
 */
export function DrawerProvider({ children }: { children: ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<DrawerId>(null);

  const openAIAssistant = useCallback(() => setActiveDrawer("ai-assistant"), []);
  const openAccessibility = useCallback(() => setActiveDrawer("accessibility"), []);
  const openNotifications = useCallback(() => setActiveDrawer("notifications"), []);
  const closeDrawer = useCallback(() => setActiveDrawer(null), []);

  const value = useMemo(
    () => ({ activeDrawer, openAIAssistant, openAccessibility, openNotifications, closeDrawer }),
    [activeDrawer, openAIAssistant, openAccessibility, openNotifications, closeDrawer]
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

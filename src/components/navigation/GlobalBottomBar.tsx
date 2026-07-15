"use client";

import { Accessibility, Bell } from "lucide-react";
import { VoiceAssistantButton } from "@/components/common/VoiceAssistantButton";
import { useDrawer } from "@/hooks/useDrawer";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Global Bottom Bar — mounted exactly once (in AppShell) and rendered
 * identically on every screen, gateway and kiosk alike. Takes no props by
 * design: per the approved architecture, the shell must be identical
 * everywhere and only page content may vary, so this component
 * deliberately has no per-page customization surface.
 *
 * This is the ONLY entry point for the three global tools (AI Assistant,
 * Accessibility, Notifications) — none of them appear anywhere else in
 * the shell (see TopNavigation, which now carries only date/time and the
 * language selector).
 */
export function GlobalBottomBar() {
  const { openAccessibility, openNotifications } = useDrawer();
  const { unreadCount } = useNotifications();
  const { t } = useLanguage();

  return (
    <nav className="flex h-24 w-full shrink-0 items-center justify-between bg-brand-900 px-6 sm:px-10">
      <button
        type="button"
        data-touch-target
        onClick={openAccessibility}
        className="flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Accessibility className="h-6 w-6" aria-hidden="true" />
        <span className="text-[0.7rem] font-medium leading-tight">
          {t("إمكانية الوصول", "Accessibility")}
        </span>
      </button>

      <VoiceAssistantButton variant="fab" />

      <button
        type="button"
        data-touch-target
        onClick={openNotifications}
        className="relative flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <span className="relative">
          <Bell className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1.5 -end-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emergency px-1 text-[0.6rem] font-bold leading-none text-white"
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
        <span className="text-[0.7rem] font-medium leading-tight">
          {t("الإشعارات", "Notifications")}
        </span>
      </button>
    </nav>
  );
}

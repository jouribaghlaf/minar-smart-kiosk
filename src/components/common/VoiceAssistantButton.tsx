"use client";

import { Mic } from "lucide-react";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils/cn";

interface VoiceAssistantButtonProps {
  /** "bar" = inline pill button (unused now that TopNavigation no longer
   *  shows it — kept for potential future reuse). "fab" = large circular
   *  button, used as the always-present center action in GlobalBottomBar. */
  variant?: "bar" | "fab";
  className?: string;
}

export function VoiceAssistantButton({ variant = "bar", className }: VoiceAssistantButtonProps) {
  const { openAIAssistant } = useDrawer();
  const { t } = useLanguage();

  if (variant === "fab") {
    return (
      <button
        type="button"
        data-touch-target
        onClick={openAIAssistant}
        aria-label={t("المساعد الصوتي", "Voice Assistant")}
        className={cn(
          "flex h-touch-lg w-touch-lg -translate-y-3 items-center justify-center rounded-full bg-brand-700 text-white shadow-card-hover ring-4 ring-cream-100 transition-transform hover:scale-105 active:scale-95",
          className
        )}
      >
        <Mic className="h-7 w-7" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-touch-target
      onClick={openAIAssistant}
      className={cn(
        "flex h-touch items-center gap-2 rounded-full bg-brand-700 px-4 text-kiosk-sm font-medium text-white shadow-card transition-colors hover:bg-brand-800",
        className
      )}
    >
      <Mic className="h-5 w-5" aria-hidden="true" />
      <span>{t("المساعد الصوتي", "Voice Assistant")}</span>
    </button>
  );
}

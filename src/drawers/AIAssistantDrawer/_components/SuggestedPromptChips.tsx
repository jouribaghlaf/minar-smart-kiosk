"use client";

import { useEffect, useState } from "react";
import { Clock, HeartPulse, MapPin, AlertTriangle, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { SuggestedPrompt } from "@/types/chat";

const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  "heart-pulse": HeartPulse,
  "map-pin": MapPin,
  "alert-triangle": AlertTriangle,
};

export function SuggestedPromptChips({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  const { t, language } = useLanguage();
  const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/suggested-prompts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setPrompts(data?.prompts ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (prompts.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-[0.7rem] font-semibold text-ink-400">{t("اقتراحات سريعة", "Quick suggestions")}</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => {
          const Icon = ICONS[prompt.icon] ?? Clock;
          const text = language === "AR" ? prompt.textAr : prompt.textEn;
          return (
            <button
              key={prompt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(text)}
              className="flex items-center gap-1.5 rounded-pill border border-cream-300 bg-white px-3 py-2 text-[0.7rem] font-medium text-ink-700 transition-colors hover:bg-cream-100 disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

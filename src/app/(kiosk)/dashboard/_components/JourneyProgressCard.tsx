"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils/cn";

interface Stage {
  ar: string;
  en: string;
}

const STAGES: Stage[] = [
  { ar: "الوصول", en: "Arrival" },
  { ar: "الإحرام", en: "Ihram" },
  { ar: "الطواف", en: "Tawaf" },
  { ar: "السعي", en: "Sa'i" },
  { ar: "الحلق / التقصير", en: "Halq / Taqsir" },
];

/**
 * The pilgrim's current stage isn't tracked by any backend yet — there's
 * no ritual-check-in system to derive it from — so this uses a fixed
 * demo stage (index 2, "الطواف") to demonstrate the component fully. Once
 * a real ritual-progress API exists, only `CURRENT_STAGE_INDEX` needs to
 * become a prop sourced from that data.
 */
const CURRENT_STAGE_INDEX = 2;

export function JourneyProgressCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("رحلتك الحالية", "Your Current Journey")}</h3>
      <div className="mt-5 flex items-start justify-between">
        {STAGES.map((stage, index) => {
          const isDone = index < CURRENT_STAGE_INDEX;
          const isCurrent = index === CURRENT_STAGE_INDEX;
          return (
            <div key={stage.ar} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <span
                    className={cn("h-0.5 flex-1", index <= CURRENT_STAGE_INDEX ? "bg-brand-600" : "bg-cream-300")}
                  />
                )}
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-kiosk-xs font-bold",
                    isDone && "bg-brand-700 text-white",
                    isCurrent && "bg-gold-500 text-brand-900 ring-4 ring-gold-100",
                    !isDone && !isCurrent && "bg-cream-200 text-ink-300"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
                {index < STAGES.length - 1 && (
                  <span
                    className={cn("h-0.5 flex-1", index < CURRENT_STAGE_INDEX ? "bg-brand-600" : "bg-cream-300")}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[0.7rem] font-semibold leading-tight",
                  isCurrent ? "text-brand-900" : "text-ink-500"
                )}
              >
                {t(stage.ar, stage.en)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

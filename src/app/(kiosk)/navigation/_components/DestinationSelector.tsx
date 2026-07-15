"use client";

import { RotateCw, ArrowLeftRight, Tent, Droplets, HeartPulse, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils/cn";
import type { DestinationType } from "@/types/navigation";

const DESTINATIONS: { type: DestinationType; icon: LucideIcon; labelAr: string; labelEn: string }[] = [
  { type: "TAWAF", icon: RotateCw, labelAr: "الطواف", labelEn: "Tawaf" },
  { type: "SAI", icon: ArrowLeftRight, labelAr: "السعي", labelEn: "Sa'i" },
  { type: "CAMP", icon: Tent, labelAr: "المخيم", labelEn: "Camp" },
  { type: "RESTROOM", icon: Droplets, labelAr: "أقرب دورة مياه", labelEn: "Nearest Restroom" },
  { type: "HEALTH_CENTER", icon: HeartPulse, labelAr: "أقرب مركز صحي", labelEn: "Nearest Health Center" },
];

interface DestinationSelectorProps {
  selected: DestinationType;
  onSelect: (destination: DestinationType) => void;
}

export function DestinationSelector({ selected, onSelect }: DestinationSelectorProps) {
  const { t } = useLanguage();

  return (
    <div id="destination-selector-anchor">
      <h2 className="text-kiosk-sm font-bold text-ink-900">{t("اختر وجهتك", "Choose Your Destination")}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DESTINATIONS.map((dest) => {
          const isActive = dest.type === selected;
          return (
            <button
              key={dest.type}
              type="button"
              data-touch-target
              onClick={() => onSelect(dest.type)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border p-4 text-center shadow-card transition-all",
                isActive
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-cream-200 bg-white text-ink-900 hover:-translate-y-0.5 hover:shadow-card-hover"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl",
                  isActive ? "bg-white/15" : "bg-brand-100 text-brand-700"
                )}
              >
                <dest.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-kiosk-xs font-semibold">{t(dest.labelAr, dest.labelEn)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

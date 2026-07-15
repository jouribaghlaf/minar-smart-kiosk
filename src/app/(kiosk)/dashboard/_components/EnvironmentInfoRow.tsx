"use client";

import { Sun, Wind, PhoneCall } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEnvironmentStatus } from "@/hooks/useEnvironmentStatus";

export function EnvironmentInfoRow() {
  const { t } = useLanguage();
  const { status, isLoading } = useEnvironmentStatus();

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col items-center gap-1 rounded-card border border-cream-200 bg-white p-4 text-center shadow-card">
        <Sun className="h-5 w-5 text-gold-500" aria-hidden="true" />
        <span className="text-kiosk-sm font-bold text-ink-900">
          {isLoading || !status ? "—" : `${status.temperatureC}°`}
        </span>
        <span className="text-[0.7rem] text-ink-500">{t("حالة الطقس", "Weather")}</span>
      </div>

      <div className="flex flex-col items-center gap-1 rounded-card border border-cream-200 bg-white p-4 text-center shadow-card">
        <Wind className="h-5 w-5 text-brand-700" aria-hidden="true" />
        <span className="text-kiosk-sm font-bold text-ink-900">
          {isLoading || !status ? "—" : `${status.airQualityAqi} AQI`}
        </span>
        <span className="text-[0.7rem] text-ink-500">{t("جودة الهواء", "Air Quality")}</span>
      </div>

      <a
        href="tel:911"
        className="flex flex-col items-center gap-1 rounded-card border border-status-bad/30 bg-status-badBg p-4 text-center text-status-bad shadow-card transition-colors hover:bg-status-bad/10"
      >
        <PhoneCall className="h-5 w-5" aria-hidden="true" />
        <span className="text-kiosk-sm font-bold">911</span>
        <span className="text-[0.7rem]">{t("للطوارئ", "Emergency")}</span>
      </a>
    </div>
  );
}

"use client";

import { Sun, Users } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { useEnvironmentStatus } from "@/hooks/useEnvironmentStatus";
import { getCrowdLabelInfo } from "@/lib/utils/crowdLabel";

export function EnvironmentStatsRow() {
  const { t, language } = useLanguage();
  const { status } = useEnvironmentStatus();

  const crowdInfo = status ? getCrowdLabelInfo(status.overallCrowd) : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Sun className="h-5 w-5 text-gold-500" aria-hidden="true" />
        <span className="text-kiosk-sm font-semibold text-ink-900">
          {status ? `${status.temperatureC}°` : "—"}
        </span>
        <span className="text-kiosk-xs text-ink-500">{t("درجة الحرارة", "Temperature")}</span>
      </div>

      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-brand-700" aria-hidden="true" />
        <span className="text-kiosk-xs text-ink-500">
          {t("مستوى الازدحام الحالي في الحرم", "Current crowd level at the Haram")}
        </span>
        {crowdInfo && (
          <StatusBadge label={language === "AR" ? crowdInfo.ar : crowdInfo.en} tone={crowdInfo.tone} />
        )}
      </div>

      <p className="text-kiosk-xs text-ink-300">
        {t(
          "جميع الخدمات العامة متاحة دون الحاجة لتسجيل الدخول",
          "All general services are available without signing in"
        )}
      </p>
    </div>
  );
}

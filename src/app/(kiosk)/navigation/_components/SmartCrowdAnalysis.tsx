"use client";

import { Sparkles, Clock, Users, DoorOpen, MapIcon, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { getCrowdLabelInfo } from "@/lib/utils/crowdLabel";
import { cn } from "@/lib/utils/cn";
import type { CrowdLevel, RouteRecommendation } from "@/types/navigation";

interface SmartCrowdAnalysisProps {
  crowdLevels: CrowdLevel[];
  route: RouteRecommendation | null;
  selectedLevelId: string | null;
  onSelectLevel: (levelId: string) => void;
}

export function SmartCrowdAnalysis({
  crowdLevels,
  route,
  selectedLevelId,
  onSelectLevel,
}: SmartCrowdAnalysisProps) {
  const { t, language } = useLanguage();
  const recommended = crowdLevels.find((l) => l.isRecommended) ?? null;

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-gold-600" aria-hidden="true" />
        <h3 className="text-kiosk-sm font-bold text-ink-900">
          {t("تحليل المشهد الذكي للمستوى", "Smart Crowd Scene Analysis")}
        </h3>
      </div>
      <p className="mt-1 text-kiosk-xs text-ink-500">
        {t(
          "نقارن بين مستويات الوجهة ونرشح لك الأفضل بناءً على الازدحام وزمن الانتظار الحالي",
          "We compare the destination's levels and recommend the best one based on current crowding and wait time"
        )}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          icon={Clock}
          label={t("زمن الوصول المتوقع", "Expected Arrival")}
          value={route ? t(`${route.etaMinutes} دقيقة`, `${route.etaMinutes} min`) : "—"}
        />
        <StatTile
          icon={Users}
          label={t("مستوى الازدحام العام", "Overall Crowd")}
          value={
            recommended ? (
              <StatusBadge
                label={language === "AR" ? getCrowdLabelInfo(recommended.crowdLabel).ar : getCrowdLabelInfo(recommended.crowdLabel).en}
                tone={getCrowdLabelInfo(recommended.crowdLabel).tone}
              />
            ) : (
              "—"
            )
          }
        />
        <StatTile
          icon={DoorOpen}
          label={t("أفضل بوابة دخول", "Best Entry Gate")}
          value={recommended?.recommendedGate ?? t("—", "—")}
        />
        <StatTile
          icon={MapIcon}
          label={t("المسافة الكلية", "Total Distance")}
          value={route ? `${(route.totalDistanceMeters / 1000).toFixed(1)} ${t("كم", "km")}` : "—"}
        />
      </div>

      {crowdLevels.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-start">
            <thead>
              <tr className="border-b border-cream-200 text-kiosk-xs text-ink-500">
                <th className="px-2 py-2 text-start font-medium">{t("المستوى", "Level")}</th>
                <th className="px-2 py-2 text-start font-medium">{t("حالة الازدحام", "Crowd")}</th>
                <th className="px-2 py-2 text-start font-medium">{t("زمن الانتظار", "Wait")}</th>
                <th className="px-2 py-2 text-start font-medium">{t("اختيار", "Select")}</th>
              </tr>
            </thead>
            <tbody>
              {crowdLevels.map((level) => {
                const info = getCrowdLabelInfo(level.crowdLabel);
                const isSelected = (selectedLevelId ?? recommended?.id) === level.id;
                return (
                  <tr key={level.id} className="border-b border-cream-100 last:border-0">
                    <td className="px-2 py-2.5 text-kiosk-xs font-semibold text-ink-900">
                      {level.levelName}
                      {level.isRecommended && (
                        <span className="ms-2 inline-block rounded-pill bg-gold-100 px-2 py-0.5 text-[0.65rem] font-bold text-gold-600">
                          {t("الأفضل", "Best")}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2.5">
                      <StatusBadge label={language === "AR" ? info.ar : info.en} tone={info.tone} />
                    </td>
                    <td className="px-2 py-2.5 text-kiosk-xs text-ink-700">
                      {t(`${level.waitMinutes} دقيقة`, `${level.waitMinutes} min`)}
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        data-touch-target
                        onClick={() => onSelectLevel(level.id)}
                        className={cn(
                          "h-10 rounded-xl px-4 text-[0.7rem] font-semibold transition-colors",
                          isSelected
                            ? "bg-brand-700 text-white"
                            : "bg-cream-200 text-ink-700 hover:bg-cream-300"
                        )}
                      >
                        {isSelected ? t("محدد", "Selected") : t("عرض المسار", "View route")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-[0.7rem] text-ink-300">
        {t("تحديث البيانات كل 30 ثانية", "Data refreshes every 30 seconds")}
      </p>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-cream-100 p-3">
      <div className="flex items-center gap-1.5 text-ink-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[0.65rem]">{label}</span>
      </div>
      <div className="mt-1 text-kiosk-xs font-bold text-ink-900">{value}</div>
    </div>
  );
}

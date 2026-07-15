"use client";

import { ArrowUp, RefreshCw, Route } from "lucide-react";
import { QuickActionTile } from "@/components/common/QuickActionTile";
import { useLanguage } from "@/hooks/useLanguage";

interface NavigationQuickActionsProps {
  onChangeDestination: () => void;
  onRefreshCrowd: () => void;
  isRefreshing: boolean;
}

export function NavigationQuickActions({
  onChangeDestination,
  onRefreshCrowd,
  isRefreshing,
}: NavigationQuickActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("إجراءات سريعة", "Quick Actions")}</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <QuickActionTile icon={ArrowUp} label={t("تغيير الوجهة", "Change Destination")} onClick={onChangeDestination} />
        <QuickActionTile
          icon={RefreshCw}
          label={isRefreshing ? t("جارٍ التحديث...", "Refreshing...") : t("تحديث الازدحام", "Refresh Crowd")}
          onClick={onRefreshCrowd}
        />
        <QuickActionTile icon={Route} label={t("إعادة حساب المسار", "Recalculate Route")} onClick={onRefreshCrowd} />
      </div>
    </div>
  );
}

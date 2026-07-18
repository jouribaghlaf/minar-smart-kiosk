"use client";

import { Stethoscope, Ambulance, Droplets, Pill } from "lucide-react";
import { QuickActionTile } from "@/components/common/QuickActionTile";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Mirrors the approved design's 5-tile "خدمات صحية سريعة" row exactly in
 * position and count. Per the finalized product architecture, symptom
 * assessment is no longer performed in-kiosk — the second tile (same
 * slot the original "تقييم الأعراض" occupied) now points to the Smart
 * Medical Device section further down this page instead of opening an
 * AI symptom checker.
 */
export function QuickHealthServicesGrid() {
  const { t } = useLanguage();
  const scrollToEmergency = () => {
    document.getElementById("emergency-services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h2 className="text-kiosk-sm font-bold text-ink-900">{t("خدمات صحية سريعة", "Quick Health Services")}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <QuickActionTile
          icon={Stethoscope}
          label={t("استشارة طبية", "Medical Consultation")}
          disabled
          disabledLabel={t("قريباً", "Coming soon")}
        />
        <QuickActionTile icon={Ambulance} label={t("الإسعاف", "Ambulance")} onClick={scrollToEmergency} />
        <QuickActionTile
          icon={Droplets}
          label={t("أقرب دورة مياه", "Nearest Restroom")}
          href="/navigation?destination=RESTROOM"
        />
        <QuickActionTile
          icon={Pill}
          label={t("أقرب صيدلية", "Nearest Pharmacy")}
          disabled
          disabledLabel={t("قريباً", "Coming soon")}
        />
      </div>
    </div>
  );
}

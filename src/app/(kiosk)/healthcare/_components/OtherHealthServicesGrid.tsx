"use client";

import { Building2, ClipboardCheck, Truck } from "lucide-react";
import { QuickActionTile } from "@/components/common/QuickActionTile";
import { useLanguage } from "@/hooks/useLanguage";

export function OtherHealthServicesGrid() {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h2 className="text-kiosk-sm font-bold text-ink-900">{t("خدمات أخرى", "Additional Services")}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { icon: Building2, ar: "المستشفيات", en: "Hospitals" },
          { icon: ClipboardCheck, ar: "مراكز الفحص", en: "Checkup Centers" },
          { icon: Truck, ar: "الوحدات المتنقلة", en: "Mobile Units" },
        ].map((service) => (
          <QuickActionTile
            key={service.ar}
            icon={service.icon}
            label={t(service.ar, service.en)}
            disabled
            disabledLabel={t("قريباً", "Coming soon")}
          />
        ))}
      </div>
    </div>
  );
}

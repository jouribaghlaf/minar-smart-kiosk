"use client";

import { ShieldCheck, PhoneCall } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function HealthcareFooterNote() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-kiosk-xs text-ink-500">
        <ShieldCheck className="h-5 w-5 text-brand-700" aria-hidden="true" />
        {t(
          "جميع بياناتك آمنة ومعتمدة من وزارة الصحة والجهات المختصة",
          "All your data is secure and certified by the Ministry of Health and relevant authorities"
        )}
      </div>
      <a
        href="tel:911"
        className="flex h-touch items-center gap-2 rounded-2xl bg-status-badBg px-5 text-kiosk-sm font-bold text-status-bad shadow-card transition-colors hover:bg-status-bad/10"
      >
        <PhoneCall className="h-4 w-4" aria-hidden="true" />
        {t("طوارئ 911", "Emergency 911")}
      </a>
    </div>
  );
}

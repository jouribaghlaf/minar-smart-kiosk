"use client";

import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";
import { cn } from "@/lib/utils/cn";

interface PilgrimInfoPreviewProps {
  pilgrim: Pilgrim | null;
}

export function PilgrimInfoPreview({ pilgrim }: PilgrimInfoPreviewProps) {
  const { t } = useLanguage();

  const rows: { labelAr: string; labelEn: string; value: string | null }[] = [
    { labelAr: "الاسم", labelEn: "Name", value: pilgrim?.name ?? null },
    { labelAr: "الجنسية", labelEn: "Nationality", value: pilgrim?.nationality ?? null },
    {
      labelAr: "لغة النظام",
      labelEn: "System language",
      value: pilgrim ? (pilgrim.systemLanguage === "AR" ? "العربية" : "English") : null,
    },
    { labelAr: "الحملة", labelEn: "Campaign", value: pilgrim?.campaign.name ?? null },
    { labelAr: "المخيم", labelEn: "Camp", value: pilgrim?.camp.number ?? null },
  ];

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("معلوماتك", "Your Information")}</h3>
      <dl className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.labelAr} className="flex items-center justify-between gap-4">
            <dt className="text-kiosk-xs text-ink-500">{t(row.labelAr, row.labelEn)}</dt>
            <dd
              className={cn(
                "text-kiosk-xs font-semibold text-ink-900",
                !row.value && "h-4 w-24 animate-pulse rounded bg-cream-200"
              )}
            >
              {row.value ?? "\u00A0"}
            </dd>
          </div>
        ))}
      </dl>
      {!pilgrim && (
        <p className="mt-4 text-[0.7rem] text-ink-300">
          {t("سيتم تعبئة بياناتك تلقائياً بعد التحقق", "Your information fills in automatically after verification")}
        </p>
      )}
    </div>
  );
}

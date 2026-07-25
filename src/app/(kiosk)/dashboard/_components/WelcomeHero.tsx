"use client";

import { ArchPatternBackground } from "@/components/common/ArchPatternBackground";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

export function WelcomeHero({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-card bg-brand-900 px-6 py-8 sm:px-8">
      <ArchPatternBackground />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-kiosk-xl font-bold text-white sm:text-kiosk-2xl">
            {t(`مرحباً بك، ${pilgrim.name}${pilgrim.pilgrimType === "HAJJ" ? " - حاج" : ""}`, `Welcome, ${pilgrim.name}${pilgrim.pilgrimType === "HAJJ" ? " - Pilgrim" : ""}`)}
          </h1>
          <p className="mt-1 text-xs font-semibold text-gold-300">{t("انتهاء التأشيرة", "Visa expiry")}: {pilgrim.visaExpiryDate}</p>
          <p className="mt-1 text-kiosk-sm text-white/75">
            {t(
              "نسعد بخدمتك ونتمنى لك حجاً مبروراً وسعياً مشكوراً",
              "We're glad to serve you — we wish you an accepted, blessed pilgrimage"
            )}
          </p>
        </div>
        <span className="rounded-2xl bg-white/10 px-4 py-2 text-kiosk-xs font-semibold text-white/80">
          {t("رقم الحاج", "Pilgrim No.")} <span dir="ltr">{pilgrim.pilgrimNumber}</span>
        </span>
      </div>
    </div>
  );
}

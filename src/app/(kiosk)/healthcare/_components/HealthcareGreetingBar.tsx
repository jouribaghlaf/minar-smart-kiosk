"use client";

import Link from "next/link";
import { ScanFace, FileHeart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

/**
 * Healthcare is a PUBLIC service — guests reach it directly from Home
 * with no identification step, exactly like Navigation. `pilgrim` is
 * `null` for the vast majority of visitors; that's the expected default,
 * not a loading glitch. Only the "عرض بياناتي الصحية" link (which jumps
 * to the personalized health-info section) depends on a real session.
 */
export function HealthcareGreetingBar({ pilgrim }: { pilgrim: Pilgrim | null }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-kiosk-xl font-bold text-brand-900">{t("الخدمات الصحية", "Healthcare Services")}</h1>
        <p className="mt-1 text-kiosk-xs text-ink-500">
          {t("نوجهك بسرعة إلى الخدمة الصحية الأنسب لك", "We'll quickly guide you to the right healthcare service")}
        </p>
      </div>

      {pilgrim ? (
        <div className="flex items-center gap-3">
          <span className="text-kiosk-xs text-ink-500">
            {t(`مرحباً ${pilgrim.name}`, `Hello, ${pilgrim.name}`)} — {pilgrim.campaign.name} ·{" "}
            {t("المخيم", "Camp")} {pilgrim.camp.number}
          </span>
          <a
            href="#my-health-info"
            className="flex items-center gap-1.5 text-kiosk-xs font-semibold text-brand-700 hover:underline"
          >
            <FileHeart className="h-4 w-4" aria-hidden="true" />
            {t("عرض بياناتي الصحية", "View My Health Info")}
          </a>
        </div>
      ) : (
        <Link
          href="/identify"
          className="flex items-center gap-1.5 rounded-pill border border-brand-100 bg-brand-50 px-4 py-2 text-kiosk-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          <ScanFace className="h-4 w-4" aria-hidden="true" />
          {t("سجّل الدخول لعرض بياناتك الصحية", "Sign in to view your health information")}
        </Link>
      )}
    </div>
  );
}

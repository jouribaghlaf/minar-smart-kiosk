"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { getLastActivity, type LastActivity } from "@/lib/utils/lastActivity";

/**
 * "Continue previous activity if available" — literally conditional.
 * Nothing is fabricated here: if no other screen has called
 * `setLastActivity` yet (Navigation/Healthcare will, once built in
 * Phases 7-8), this card simply doesn't render, which is the honest
 * empty state rather than a fake "you were doing X" claim.
 */
export function ContinuePreviousActivityCard() {
  const { t, direction } = useLanguage();
  const [activity, setActivity] = useState<LastActivity | null>(null);
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    setActivity(getLastActivity());
  }, []);

  if (!activity) return null;

  return (
    <Link
      href={activity.href}
      data-touch-target
      className="flex items-center gap-3 rounded-card border border-brand-100 bg-brand-50 p-4 shadow-card transition-colors hover:bg-brand-100/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
        <History className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <p className="text-[0.7rem] text-ink-500">{t("متابعة النشاط السابق", "Continue previous activity")}</p>
        <p className="text-kiosk-xs font-semibold text-ink-900">
          {t(activity.labelAr, activity.labelEn)}
        </p>
      </div>
      <ArrowIcon className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
    </Link>
  );
}

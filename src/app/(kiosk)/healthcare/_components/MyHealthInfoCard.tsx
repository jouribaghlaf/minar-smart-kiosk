"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileHeart, BadgeCheck } from "lucide-react";
import { InfoRowsCard } from "@/components/cards/InfoRowsCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";
import type { HealthInfo } from "@/types/health";

/**
 * The one genuinely personalized section on this screen. For guests
 * (`pilgrim` is null), this renders a neutral sign-in invitation and
 * fetches nothing — no medical data, mock or otherwise, is ever
 * requested or shown before a real identification session exists.
 * `/api/health/info` itself also independently requires a valid session
 * (returns 401 otherwise), so this is defense in depth, not the only
 * safeguard.
 */
export function MyHealthInfoCard({ pilgrim }: { pilgrim: Pilgrim | null }) {
  const { t } = useLanguage();
  const [info, setInfo] = useState<HealthInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pilgrim) return;
    let cancelled = false;
    setIsLoading(true);
    fetch("/api/health/info", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setInfo(data?.info ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pilgrim]);

  if (!pilgrim) {
    return (
      <div
        id="my-health-info"
        className="flex flex-col items-center gap-3 rounded-card border border-cream-200 bg-white p-6 text-center shadow-card"
      >
        <FileHeart className="h-8 w-8 text-brand-300" aria-hidden="true" />
        <p className="text-kiosk-sm font-bold text-ink-900">{t("معلوماتك الصحية", "Your Health Information")}</p>
        <p className="text-kiosk-xs text-ink-500">
          {t(
            "سجّل دخولك عبر التعرف الذكي لعرض فصيلة دمك وحساسيتك وجهة الاتصال في الطوارئ",
            "Sign in via Smart Identification to view your blood type, allergies, and emergency contact"
          )}
        </p>
        <Link
          href="/identify"
          className="mt-1 flex h-touch items-center gap-2 rounded-2xl bg-brand-700 px-5 text-kiosk-xs font-semibold text-white shadow-card hover:bg-brand-800"
        >
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          {t("التعرف الذكي", "Smart Identification")}
        </Link>
      </div>
    );
  }

  if (isLoading || !info) {
    return (
      <div id="my-health-info" className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
        <div className="h-32 animate-pulse rounded-2xl bg-cream-200" />
      </div>
    );
  }

  return (
    <div id="my-health-info">
      <InfoRowsCard
        title={t("معلوماتي الصحية", "My Health Information")}
        icon={FileHeart}
        rows={[
          { label: t("فصيلة الدم", "Blood type"), value: info.bloodType },
          { label: t("الحساسية", "Allergies"), value: info.allergies || t("لا يوجد", "None") },
          { label: t("الأمراض المزمنة", "Chronic diseases"), value: info.chronicDiseases || t("لا يوجد", "None") },
          { label: t("الأدوية الحالية", "Current medications"), value: info.currentMedications || t("لا يوجد", "None") },
          { label: t("جهة اتصال الطوارئ", "Emergency contact"), value: info.emergencyContact },
        ]}
      />
    </div>
  );
}

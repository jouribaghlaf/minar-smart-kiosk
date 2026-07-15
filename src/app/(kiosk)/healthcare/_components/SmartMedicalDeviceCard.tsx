"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { HealthCenter } from "@/types/navigation";

/**
 * Occupies the same structural slot the original "AI Health Assessment
 * Card" held in the approved design. Per the finalized product
 * architecture, symptom assessment happens on a dedicated Smart Medical
 * Device, NOT inside the Minar kiosk — this card is purely a gateway
 * that points the pilgrim to the nearest device (co-located with the
 * nearest health center in this deployment) rather than running any
 * in-kiosk assessment logic itself.
 */
export function SmartMedicalDeviceCard() {
  const { t, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;
  const [nearest, setNearest] = useState<HealthCenter | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/centers", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setNearest(data?.centers?.[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="smart-medical-device" className="rounded-card border border-brand-100 bg-brand-50 p-5">
      <div className="flex items-center gap-2 text-brand-800">
        <Cpu className="h-5 w-5" aria-hidden="true" />
        <h2 className="text-kiosk-sm font-bold">{t("الجهاز الطبي الذكي", "Smart Medical Device")}</h2>
      </div>
      <p className="mt-1 text-kiosk-xs text-ink-500">
        {t(
          "يقوم الجهاز الطبي الذكي بإجراء فحص أولي دقيق لحالتك الصحية واقتراح الجهة الصحية المناسبة",
          "The Smart Medical Device performs an accurate preliminary examination and suggests the right healthcare facility for you"
        )}
      </p>

      {nearest && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white p-3 text-kiosk-xs text-ink-700">
          <MapPin className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          {t(
            `أقرب جهاز متاح في ${nearest.name} — ${nearest.distanceMeters < 1000 ? `${nearest.distanceMeters} متر` : `${(nearest.distanceMeters / 1000).toFixed(1)} كم`}`,
            `Nearest device available at ${nearest.name} — ${nearest.distanceMeters < 1000 ? `${nearest.distanceMeters} m` : `${(nearest.distanceMeters / 1000).toFixed(1)} km`}`
          )}
        </div>
      )}

      <Link
        href="/navigation?destination=HEALTH_CENTER"
        data-touch-target
        className="mt-4 flex h-touch-lg items-center justify-center gap-2 rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-bold text-white shadow-card transition-colors hover:bg-brand-800"
      >
        {t("التوجه إلى الجهاز الطبي الذكي", "Go to Smart Medical Device")}
        <ArrowIcon className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  );
}

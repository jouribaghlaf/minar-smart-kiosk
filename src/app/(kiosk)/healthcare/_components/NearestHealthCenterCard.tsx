"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartPulse, Navigation2, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import type { HealthCenter } from "@/types/navigation";

export function NearestHealthCenterCard() {
  const { t } = useLanguage();
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/centers", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setCenters(data?.centers ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const nearest = centers[0];
  const rest = centers.slice(1);

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-brand-700" aria-hidden="true" />
        <h2 className="text-kiosk-sm font-bold text-ink-900">{t("أقرب مركز صحي", "Nearest Health Center")}</h2>
      </div>

      {nearest ? (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream-100 p-4">
            <div>
              <p className="text-kiosk-sm font-bold text-ink-900">{nearest.name}</p>
              <p className="mt-1 text-kiosk-xs text-ink-500">
                {nearest.distanceMeters < 1000
                  ? `${nearest.distanceMeters} ${t("متر", "m")}`
                  : `${(nearest.distanceMeters / 1000).toFixed(1)} ${t("كم", "km")}`}{" "}
                · {t(`${nearest.etaMinutes} دقيقة`, `${nearest.etaMinutes} min`)}
              </p>
            </div>
            <StatusBadge
              label={nearest.isAvailable ? t("متاح الآن", "Available now") : t("غير متاح حالياً", "Currently unavailable")}
              tone={nearest.isAvailable ? "good" : "bad"}
            />
          </div>

          <Link
            href="/navigation?destination=HEALTH_CENTER"
            data-touch-target
            className="mt-4 flex h-touch items-center justify-center gap-2 rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
          >
            <Navigation2 className="h-5 w-5" aria-hidden="true" />
            {t("ابدأ الاتجاه الآن", "Start Directions Now")}
          </Link>

          {rest.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-1.5 text-kiosk-xs font-semibold text-brand-700 hover:underline"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} aria-hidden="true" />
                {t("عرض جميع المراكز الصحية", "Show all health centers")}
              </button>

              {showAll && (
                <ul className="mt-3 flex flex-col gap-2">
                  {rest.map((center) => (
                    <li
                      key={center.id}
                      className="flex items-center justify-between rounded-xl border border-cream-200 p-3 text-kiosk-xs"
                    >
                      <span className="font-medium text-ink-900">{center.name}</span>
                      <span className="text-ink-500">
                        {center.distanceMeters < 1000
                          ? `${center.distanceMeters} ${t("متر", "m")}`
                          : `${(center.distanceMeters / 1000).toFixed(1)} ${t("كم", "km")}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 h-20 animate-pulse rounded-2xl bg-cream-200" />
      )}
    </div>
  );
}

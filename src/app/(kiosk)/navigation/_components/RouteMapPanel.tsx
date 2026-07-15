"use client";

import { MapPin, Navigation2, Flag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { RouteRecommendation } from "@/types/navigation";

/**
 * "Interactive Navigation Map" per the spec, rendered as an original
 * abstract diagram rather than embedded map tiles — no
 * Maps API key is configured (NEXT_PUBLIC_MAPS_PROVIDER=mock, see
 * .env.example), and no real GPS is required per the requirements ("Use
 * mock data. No real GPS required."). Swapping in Google Maps/Mapbox
 * later only touches this component; `route.steps` already has
 * everything a real map layer would need.
 */
export function RouteMapPanel({ route }: { route: RouteRecommendation | null }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("مسارك المقترح", "Your Suggested Route")}</h3>

      <div className="relative mt-3 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-900">
        <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="220" fill="#0B3B2E" />
          {/* Decorative grid to suggest a map surface */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={220} stroke="white" strokeOpacity={0.05} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 44} x2={400} y2={i * 44} stroke="white" strokeOpacity={0.05} />
          ))}
          {/* Route path */}
          <path
            d="M 60 180 C 120 160, 140 100, 200 90 S 300 60, 340 40"
            fill="none"
            stroke="#C68A2E"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 10"
          />
          <circle cx="60" cy="180" r="8" fill="#22855F" stroke="white" strokeWidth={2} />
          <circle cx="340" cy="40" r="8" fill="#C23B3B" stroke="white" strokeWidth={2} />
        </svg>

        <span className="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-1.5 text-[0.7rem] text-white/80">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {t("خريطة توضيحية — بيانات تجريبية", "Illustrative map — mock data")}
        </span>
      </div>

      {route ? (
        <>
          <ol className="mt-4 flex flex-col gap-3">
            {route.steps.map((step, index) => {
              const isLast = index === route.steps.length - 1;
              return (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isLast ? "bg-status-bad text-white" : "bg-brand-100 text-brand-700"
                    }`}
                  >
                    {isLast ? (
                      <Flag className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Navigation2 className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="text-kiosk-xs font-medium text-ink-900">{step.instruction}</p>
                    {step.distanceMeters > 0 && (
                      <p className="text-[0.7rem] text-ink-400">
                        {step.distanceMeters >= 1000
                          ? `${(step.distanceMeters / 1000).toFixed(1)} ${t("كم", "km")}`
                          : `${step.distanceMeters} ${t("متر", "m")}`}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-cream-100 p-4">
            <div>
              <p className="text-[0.7rem] text-ink-500">{t("وقت الوصول المتوقع", "Expected arrival")}</p>
              <p className="text-kiosk-sm font-bold text-ink-900">{t(`${route.etaMinutes} دقيقة`, `${route.etaMinutes} min`)}</p>
            </div>
            <div>
              <p className="text-[0.7rem] text-ink-500">{t("المسافة المتبقية", "Remaining distance")}</p>
              <p className="text-kiosk-sm font-bold text-ink-900">
                {(route.totalDistanceMeters / 1000).toFixed(1)} {t("كم", "km")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded-xl bg-cream-200" />
          ))}
        </div>
      )}
    </div>
  );
}

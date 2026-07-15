"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Compass, HeartPulse, ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { setLastActivity } from "@/lib/utils/lastActivity";
import type { CrowdLevel } from "@/types/navigation";

interface Recommendation {
  key: string;
  icon: LucideIcon;
  textAr: string;
  textEn: string;
  href: string;
  activityLabelAr: string;
  activityLabelEn: string;
}

export function SmartRecommendationsCard() {
  const { t, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;
  const [tawafLevel, setTawafLevel] = useState<CrowdLevel | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/crowd?destination=TAWAF", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const levels: CrowdLevel[] = data?.levels ?? [];
        setTawafLevel(levels.find((l) => l.isRecommended) ?? levels[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const recommendations: Recommendation[] = [
    {
      key: "tawaf",
      icon: Compass,
      textAr: tawafLevel
        ? `الآن أفضل وقت للطواف عبر ${tawafLevel.levelName} — انتظار ${tawafLevel.waitMinutes} دقيقة فقط`
        : "تحقق من أفضل وقت للطواف الآن",
      textEn: tawafLevel
        ? `Now is a great time for Tawaf via ${tawafLevel.levelName} — only a ${tawafLevel.waitMinutes}-minute wait`
        : "Check the best time for Tawaf right now",
      href: "/navigation?destination=TAWAF",
      activityLabelAr: "الملاحة إلى الطواف",
      activityLabelEn: "Navigating to Tawaf",
    },
    {
      key: "health",
      icon: HeartPulse,
      textAr: "أقرب مركز صحي على بعد دقائق قليلة سيراً — تحقق من الخدمات الصحية",
      textEn: "The nearest health center is just a few minutes away — check healthcare services",
      href: "/healthcare",
      activityLabelAr: "الخدمات الصحية",
      activityLabelEn: "Healthcare Services",
    },
  ];

  return (
    <div className="rounded-card border border-gold-400/30 bg-gold-100/40 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-gold-600" aria-hidden="true" />
        <h3 className="text-kiosk-sm font-bold text-ink-900">{t("توصيات ذكية لك", "Smart Recommendations")}</h3>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {recommendations.map((rec) => (
          <li key={rec.key}>
            <Link
              href={rec.href}
              data-touch-target
              onClick={() =>
                setLastActivity({
                  labelAr: rec.activityLabelAr,
                  labelEn: rec.activityLabelEn,
                  href: rec.href,
                })
              }
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-start shadow-card transition-colors hover:bg-cream-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                <rec.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1 text-kiosk-xs font-medium text-ink-700">{t(rec.textAr, rec.textEn)}</span>
              <ArrowIcon className="h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Droplets, Sun, Moon, ShieldCheck, Lightbulb, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { HealthTip } from "@/types/health";

const ICONS: Record<string, LucideIcon> = {
  droplets: Droplets,
  sun: Sun,
  moon: Moon,
  "shield-check": ShieldCheck,
};

export function HealthTipsCard() {
  const { t } = useLanguage();
  const [tips, setTips] = useState<HealthTip[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/tips", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setTips(data?.tips ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-gold-600" aria-hidden="true" />
        <h2 className="text-kiosk-sm font-bold text-ink-900">{t("نصائح وإرشادات صحية", "Health Tips & Guidance")}</h2>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {tips.map((tip) => {
          const Icon = ICONS[tip.icon] ?? Lightbulb;
          return (
            <li key={tip.id} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-kiosk-xs leading-relaxed text-ink-700">{tip.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

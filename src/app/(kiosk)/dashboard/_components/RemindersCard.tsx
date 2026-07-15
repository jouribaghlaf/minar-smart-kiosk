"use client";

import { IdCard, Droplets, Signpost, LifeBuoy } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const REMINDERS = [
  { icon: IdCard, ar: "تأكد من حمل بطاقة نسك معك دائماً", en: "Make sure to carry your Nusuk card at all times" },
  { icon: Droplets, ar: "احرص على شرب الماء بشكل منتظم", en: "Remember to drink water regularly" },
  { icon: Signpost, ar: "اتبع اللوحات الإرشادية داخل المشاعر", en: "Follow the directional signage within the holy sites" },
  { icon: LifeBuoy, ar: "في الحالات الطارئة استخدم زر SOS", en: "In emergencies, use the SOS button" },
];

export function RemindersCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("تذكيرات مهمة", "Important Reminders")}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {REMINDERS.map((reminder) => (
          <li key={reminder.ar} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <reminder.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-kiosk-xs leading-relaxed text-ink-700">{t(reminder.ar, reminder.en)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

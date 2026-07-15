"use client";

import { Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ScheduleItem {
  labelAr: string;
  labelEn: string;
  time: string;
  highlight?: boolean;
}

// Mocked — a real deployment would source this from an official prayer-times
// API keyed to the kiosk's location, and ritual windows from crowdService.
const SCHEDULE: ScheduleItem[] = [
  { labelAr: "أفضل وقت للطواف اليوم", labelEn: "Best Tawaf time today", time: "10:30 ص – 01:30 م", highlight: true },
  { labelAr: "صلاة الفجر", labelEn: "Fajr", time: "04:45 ص" },
  { labelAr: "صلاة الظهر", labelEn: "Dhuhr", time: "12:15 م" },
  { labelAr: "صلاة العصر", labelEn: "Asr", time: "03:35 م" },
  { labelAr: "صلاة المغرب", labelEn: "Maghrib", time: "06:50 م" },
  { labelAr: "صلاة العشاء", labelEn: "Isha", time: "08:20 م" },
];

export function UpcomingScheduleCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-brand-700" aria-hidden="true" />
        <h3 className="text-kiosk-sm font-bold text-ink-900">{t("مواعيدك القادمة", "Upcoming Schedule")}</h3>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-cream-200">
        {SCHEDULE.map((item) => (
          <li
            key={item.labelAr}
            className={`flex items-center justify-between py-2.5 ${item.highlight ? "text-brand-800" : "text-ink-700"}`}
          >
            <span className="text-kiosk-xs font-medium">{t(item.labelAr, item.labelEn)}</span>
            <span dir="ltr" className={`text-kiosk-xs font-bold ${item.highlight ? "" : "text-ink-500"}`}>
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

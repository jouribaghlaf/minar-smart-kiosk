"use client";

import { BookOpenCheck, FileKey2, QrCode, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { IdentificationMethod } from "@/types/pilgrim";

const METHODS: { method: IdentificationMethod; icon: LucideIcon; ar: string; en: string }[] = [
  { method: "PASSPORT", icon: BookOpenCheck, ar: "قارئ جواز السفر", en: "Passport reader" },
  { method: "QR_CODE", icon: QrCode, ar: "رمز QR لبطاقة نسك", en: "Nusuk card QR" },
  { method: "VISA", icon: FileKey2, ar: "رقم التأشيرة", en: "Visa number" },
];

export function AlternativeMethodsRow({ currentMethod, onSelect }: { currentMethod: IdentificationMethod; onSelect: (method: IdentificationMethod) => void }) {
  const { t } = useLanguage();

  return (
    <section aria-label={t("طرق تسجيل الدخول", "Sign-in methods")}>
      <div className="mb-4 flex items-center gap-3 text-ink-500">
        <span className="h-px flex-1 bg-gold-100" />
        <span className="text-kiosk-xs font-semibold">{t("طرق الدخول المتاحة", "Available sign-in methods")}</span>
        <span className="h-px flex-1 bg-gold-100" />
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {METHODS.map((item) => {
          const active = item.method === currentMethod;
          return (
            <button
              key={item.method}
              type="button"
              onClick={() => onSelect(item.method)}
              aria-pressed={active}
              className={`group flex items-center gap-4 rounded-card border-2 p-5 text-start transition ${active ? "border-gold-500 bg-brand-900 text-white shadow-card-hover" : "border-cream-300 bg-white text-ink-900 shadow-card hover:border-gold-400"}`}
            >
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${active ? "bg-gold-500 text-brand-900" : "bg-brand-50 text-brand-700"}`}>
                <item.icon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-kiosk-sm font-bold">{t(item.ar, item.en)}</span>
                <span className={`mt-1 block text-sm ${active ? "text-white/65" : "text-ink-500"}`}>{active ? t("الطريقة المختارة", "Selected method") : t("اضغط للاختيار", "Tap to select")}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { ScanFace, BookUser, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { IdentificationMethod } from "@/types/pilgrim";

const METHODS: { method: IdentificationMethod; icon: LucideIcon; ar: string; en: string }[] = [
  { method: "FACE_RECOGNITION", icon: ScanFace, ar: "التعرف على الوجه", en: "Face Recognition" },
  { method: "PASSPORT", icon: BookUser, ar: "قارئ الجوازات", en: "Passport Reader" },
];

export function AlternativeMethodsRow({ currentMethod, onSelect }: { currentMethod: IdentificationMethod; onSelect: (method: IdentificationMethod) => void }) {
  const { t } = useLanguage();
  const alternatives = METHODS.filter((method) => method.method !== currentMethod);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3 text-ink-400">
        <span className="h-px flex-1 bg-cream-300" />
        <span className="text-kiosk-xs">{t("اختر طريقة دخول أخرى", "Choose another sign-in method")}</span>
        <span className="h-px flex-1 bg-cream-300" />
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {alternatives.map((alternative) => (
          <button key={alternative.method} type="button" onClick={() => onSelect(alternative.method)} className="flex items-center gap-3 rounded-card border border-cream-200 bg-white p-4 text-start shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <alternative.icon className="h-6 w-6" />
            </span>
            <span className="text-kiosk-xs font-semibold text-ink-900">{t(alternative.ar, alternative.en)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

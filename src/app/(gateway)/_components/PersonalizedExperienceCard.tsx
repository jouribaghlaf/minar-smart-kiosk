"use client";

import Link from "next/link";
import { ScanFace, CreditCard, QrCode, BookUser, IdCard, ArrowLeft, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { IdentificationMethod } from "@/types/pilgrim";

interface AltMethod {
  method: IdentificationMethod;
  icon: LucideIcon;
  labelAr: string;
  labelEn: string;
}

const ALT_METHODS: AltMethod[] = [
  { method: "NUSUK_CARD", icon: CreditCard, labelAr: "مسح بطاقة نسك", labelEn: "Scan Nusuk Card" },
  { method: "QR_CODE", icon: QrCode, labelAr: "مسح رمز QR", labelEn: "Scan QR Code" },
  { method: "PASSPORT", icon: BookUser, labelAr: "مسح جواز السفر", labelEn: "Scan Passport" },
  { method: "NATIONAL_ID", icon: IdCard, labelAr: "إدخال رقم الهوية", labelEn: "Enter National ID" },
];

/**
 * The "تجربة مخصصة لك" entry panel. All 5 identification methods link to
 * Screen 02 (`/identify`) with the chosen method preselected via query
 * param — Phase 5 reads it to jump straight to the right flow.
 */
export function PersonalizedExperienceCard() {
  const { t, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <aside className="flex flex-col gap-5 rounded-card bg-brand-900 p-6 text-white shadow-card-hover">
      <div>
        <h2 className="text-kiosk-lg font-bold">{t("تجربة مخصصة لك", "A Personalized Experience")}</h2>
        <p className="mt-1.5 text-kiosk-xs text-white/70">
          {t(
            "سجّل الدخول للحصول على تجربة شخصية متكاملة",
            "Sign in to get a fully personalized experience"
          )}
        </p>
      </div>

      <Link
        href="/identify?method=FACE_RECOGNITION"
        data-touch-target
        className="flex h-touch-lg items-center justify-center gap-2 rounded-2xl bg-gold-500 px-6 text-kiosk-sm font-bold text-brand-900 shadow-card transition-colors hover:bg-gold-400"
      >
        <ScanFace className="h-6 w-6" aria-hidden="true" />
        {t("التعرف على الوجه", "Face Recognition")}
      </Link>

      <div className="flex items-center gap-3 text-white/50">
        <span className="h-px flex-1 bg-white/15" />
        <span className="text-kiosk-xs">{t("أو", "or")}</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <ul className="flex flex-col gap-2">
        {ALT_METHODS.map((alt) => (
          <li key={alt.method}>
            <Link
              href={`/identify?method=${alt.method}`}
              data-touch-target
              className="flex h-touch w-full items-center gap-3 rounded-2xl bg-white/10 px-4 text-kiosk-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              <alt.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-start">{t(alt.labelAr, alt.labelEn)}</span>
              <ArrowIcon className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-[0.7rem] leading-relaxed text-white/50">
        {t(
          "جميع الخدمات العامة متاحة دون الحاجة لتسجيل الدخول",
          "All general services are available without signing in"
        )}
      </p>
    </aside>
  );
}

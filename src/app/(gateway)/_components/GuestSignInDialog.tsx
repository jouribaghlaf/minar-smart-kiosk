"use client";

import { BookOpenCheck, FileKey2, LockKeyhole, QrCode, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  serviceName: string;
  onClose: () => void;
  onSignIn: (method: "PASSPORT" | "QR_CODE" | "VISA") => void;
}

export function GuestSignInDialog({ serviceName, onClose, onSignIn }: Props) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/80 p-5" role="dialog" aria-modal="true" aria-labelledby="guest-signin-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-gold-100 bg-white p-7 text-center shadow-2xl sm:p-9">
        <div className="ministry-ornament absolute inset-x-0 top-0 h-2" />
        <button type="button" onClick={onClose} aria-label={t("إغلاق", "Close")} className="absolute end-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-cream-300 text-ink-500 hover:bg-cream-100"><X className="h-5 w-5" /></button>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-100 text-brand-900"><LockKeyhole className="h-8 w-8" /></span>
        <h2 id="guest-signin-title" className="mt-5 text-kiosk-xl font-bold text-brand-900">{t("هذه الخدمة تتطلب تسجيل الدخول", "Sign in is required for this service")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-kiosk-sm leading-relaxed text-ink-500">{t(`لاستخدام خدمة «${serviceName}» واسترجاع بياناتك بأمان، اختر طريقة تسجيل الدخول.`, `To use “${serviceName}” and retrieve your information securely, choose a sign-in method.`)}</p>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button type="button" onClick={() => onSignIn("PASSPORT")} className="flex min-h-28 items-center gap-4 rounded-2xl bg-brand-900 p-5 text-start text-white transition hover:bg-brand-800">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-brand-900"><BookOpenCheck className="h-7 w-7" /></span>
            <span><strong className="block text-kiosk-sm">{t("قراءة جواز السفر", "Read passport")}</strong><span className="mt-1 block text-sm text-white/65">{t("استخدم قارئ الجوازات", "Use the passport reader")}</span></span>
          </button>
          <button type="button" onClick={() => onSignIn("QR_CODE")} className="flex min-h-28 items-center gap-4 rounded-2xl border-2 border-brand-900 bg-white p-5 text-start text-brand-900 transition hover:bg-brand-50">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><QrCode className="h-7 w-7" /></span>
            <span><strong className="block text-kiosk-sm">{t("مسح بطاقة نسك", "Scan Nusuk card")}</strong><span className="mt-1 block text-sm text-ink-500">{t("امسح رمز QR في البطاقة", "Scan the QR code on the card")}</span></span>
          </button>
          <button type="button" onClick={() => onSignIn("VISA")} className="flex min-h-28 items-center gap-4 rounded-2xl border-2 border-gold-400 bg-gold-100 p-5 text-start text-brand-900 transition hover:bg-gold-200">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-gold-400"><FileKey2 className="h-7 w-7" /></span>
            <span><strong className="block text-kiosk-sm">{t("قراءة التأشيرة", "Read visa")}</strong><span className="mt-1 block text-sm text-ink-500">{t("استخدم قارئ التأشيرة", "Use the visa reader")}</span></span>
          </button>
        </div>
        <button type="button" onClick={onClose} className="mt-5 h-touch rounded-2xl px-7 font-bold text-ink-500 hover:bg-cream-100">{t("إلغاء والعودة للخدمات", "Cancel and return to services")}</button>
      </div>
    </div>
  );
}

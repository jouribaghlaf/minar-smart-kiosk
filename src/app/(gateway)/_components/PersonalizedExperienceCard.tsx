"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, CreditCard, QrCode } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const METHODS = [
  { method: "PASSPORT", icon: BookOpenCheck, ar: "قارئ جواز السفر", en: "Passport reader" },
  { method: "QR_CODE", icon: QrCode, ar: "رمز QR لبطاقة نسك", en: "Nusuk card QR" },
  { method: "VISA", icon: CreditCard, ar: "رقم التأشيرة", en: "Visa number" },
] as const;

export function PersonalizedExperienceCard() {
  const { t, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <aside className="relative flex flex-col gap-5 overflow-hidden rounded-card bg-brand-900 p-6 text-white shadow-card-hover">
      <div className="ministry-ornament absolute inset-x-0 top-0 h-1.5" />
      <div><h2 className="text-kiosk-lg font-bold">{t("دخول مخصص وآمن", "Secure personalized access")}</h2><p className="mt-1.5 text-kiosk-xs text-white/70">{t("استرجع بيانات رحلتك باستخدام الجواز أو بطاقة نسك أو رقم التأشيرة", "Retrieve your journey using your passport, Nusuk card, or visa number")}</p></div>
      <ul className="grid gap-3">
        {METHODS.map((item, index) => <li key={item.method}><Link href={`/identify?method=${item.method}`} data-touch-target className={`flex h-touch-lg items-center gap-3 rounded-2xl px-5 text-kiosk-sm font-bold transition ${index === 0 ? "bg-gold-500 text-brand-900 hover:bg-gold-400" : "border border-white/15 bg-white/10 text-white hover:bg-white/20"}`}><item.icon className="h-6 w-6" /><span className="flex-1 text-start">{t(item.ar, item.en)}</span><ArrowIcon className="h-5 w-5" /></Link></li>)}
      </ul>
      <p className="text-center text-xs text-white/50">{t("يمكنك أيضًا المتابعة كضيف دون تسجيل الدخول", "You can also continue as a guest")}</p>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Accessibility, ArrowLeft, ArrowRight, LogOut, Volume2 } from "lucide-react";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { MinarLogo } from "@/components/common/MinarLogo";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";

export function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, direction, resetLanguage } = useLanguage();
  const { openAccessibility } = useDrawer();
  const { hasActiveSession, logout } = useSession();
  const [confirming, setConfirming] = useState(false);
  const BackIcon = direction === "rtl" ? ArrowRight : ArrowLeft;
  const showBack = pathname !== "/services";

  const confirmLogout = async () => {
    await logout();
    resetLanguage();
    setConfirming(false);
    router.replace("/");
  };

  return (
    <>
      <header className="flex min-h-20 w-full shrink-0 items-center justify-between gap-3 border-b border-cream-200 bg-white px-4 sm:px-7">
        <div className="flex items-center gap-3">
          {showBack && <button type="button" aria-label={t("العودة", "Back")} onClick={() => router.back()} className="flex h-12 items-center gap-2 rounded-2xl border border-cream-300 px-4 font-semibold text-brand-800 hover:bg-brand-50"><BackIcon className="h-5 w-5" /><span className="hidden sm:inline">{t("العودة", "Back")}</span></button>}
          <div className="flex items-center gap-2 text-brand-900"><MinarLogo className="h-9 w-9 text-brand-700" /><span className="text-kiosk-base font-bold">{t("مِنار", "Minar")}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button type="button" onClick={openAccessibility} aria-label={t("إمكانية الوصول والصوت", "Accessibility and sound")} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cream-300 text-brand-700 hover:bg-brand-50"><Accessibility className="h-5 w-5" /><Volume2 className="-ms-1 h-3.5 w-3.5" /></button>
          {hasActiveSession && <button type="button" aria-label={t("تسجيل الخروج", "Log out")} onClick={() => setConfirming(true)} className="flex h-12 items-center gap-2 rounded-2xl bg-emergency px-4 font-bold text-white hover:bg-emergency-dark"><LogOut className="h-5 w-5" /><span className="hidden md:inline">{t("تسجيل الخروج", "Log out")}</span></button>}
        </div>
      </header>
      {confirming && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-5" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"><LogOut className="mx-auto h-10 w-10 text-emergency" /><h2 className="mt-4 text-kiosk-lg font-bold">{t("هل تريد تسجيل الخروج وإنهاء الجلسة؟", "Do you want to log out and end the session?")}</h2><p className="mt-2 text-kiosk-xs text-ink-500">{t("سيتم مسح جميع البيانات المؤقتة والطلبات غير المرسلة.", "Temporary data and unsent forms will be cleared.")}</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setConfirming(false)} className="h-touch rounded-2xl border-2 border-cream-300 font-bold">{t("إلغاء", "Cancel")}</button><button onClick={confirmLogout} className="h-touch rounded-2xl bg-emergency font-bold text-white">{t("تسجيل الخروج", "Log out")}</button></div></div></div>}
    </>
  );
}

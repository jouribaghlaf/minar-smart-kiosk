"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";

const IDLE_MS = 30_000;
const WARNING_SECONDS = 10;

export function IdleSessionGuard() {
  const router = useRouter();
  const { t, resetLanguage } = useLanguage();
  const { hasActiveSession, logout } = useSession();
  const [isWarning, setIsWarning] = useState(false);
  const [seconds, setSeconds] = useState(WARNING_SECONDS);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdown = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (countdown.current) clearInterval(countdown.current);
    idleTimer.current = null;
    countdown.current = null;
  }, []);

  const armIdleTimer = useCallback(() => {
    clearTimers();
    if (!hasActiveSession) return;
    idleTimer.current = setTimeout(() => { setSeconds(WARNING_SECONDS); setIsWarning(true); }, IDLE_MS);
  }, [clearTimers, hasActiveSession]);

  const continueSession = useCallback(() => {
    setIsWarning(false);
    setSeconds(WARNING_SECONDS);
    armIdleTimer();
  }, [armIdleTimer]);

  useEffect(() => {
    if (!hasActiveSession) { clearTimers(); setIsWarning(false); return; }
    const activity = () => { if (isWarning) continueSession(); else armIdleTimer(); };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart", "scroll", "mousemove"];
    events.forEach((event) => window.addEventListener(event, activity, { passive: true }));
    armIdleTimer();
    return () => { events.forEach((event) => window.removeEventListener(event, activity)); clearTimers(); };
  }, [hasActiveSession, isWarning, armIdleTimer, clearTimers, continueSession]);

  useEffect(() => {
    if (!isWarning) return;
    countdown.current = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => { if (countdown.current) clearInterval(countdown.current); };
  }, [isWarning]);

  useEffect(() => {
    if (!isWarning || seconds > 0) return;
    void (async () => { clearTimers(); await logout(); resetLanguage(); router.replace("/"); })();
  }, [seconds, isWarning, clearTimers, logout, resetLanguage, router]);

  if (!isWarning) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/85 p-5" role="alertdialog" aria-modal="true"><div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-2xl"><Clock3 className="mx-auto h-12 w-12 text-gold-600" /><div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-gold-100 text-[3rem] font-bold text-brand-900">{seconds}</div><h2 className="mt-5 text-kiosk-lg font-bold text-brand-900">{t("ستنتهي جلستك خلال 10 ثوانٍ حفاظًا على خصوصيتك. المس الشاشة للاستمرار.", "Your session will end in 10 seconds to protect your privacy. Touch the screen to continue.")}</h2><button type="button" onClick={continueSession} className="mt-6 h-touch w-full rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-bold text-white">{t("الاستمرار", "Continue")}</button></div></div>;
}

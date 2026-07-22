"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, MessageSquareText, RotateCcw } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import type { Pilgrim } from "@/types";

const DEMO_OTP = "1234";
const LOCK_MS = 5 * 60 * 1000;
const LOCK_KEY = "minar_otp_locked_until";
const ATTEMPTS_KEY = "minar_otp_attempts";

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function OtpScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { setPilgrim } = useSession();
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//") ? requestedReturnTo : "/dashboard";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(t("تم إرسال رمز التحقق برسالة SMS إلى رقم الجوال المسجل.", "A verification code was sent by SMS to the registered mobile number."));
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const pending = window.sessionStorage.getItem("minar_pending_pilgrim");
    if (!pending) { router.replace("/identify"); return; }
    setAttempts(Number(window.localStorage.getItem(ATTEMPTS_KEY) ?? 0));
    setLockedUntil(Number(window.localStorage.getItem(LOCK_KEY) ?? 0));
  }, [router]);

  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const lockSeconds = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const isLocked = lockSeconds > 0;

  useEffect(() => {
    if (lockedUntil && !isLocked) {
      window.localStorage.removeItem(LOCK_KEY);
      window.localStorage.removeItem(ATTEMPTS_KEY);
      setLockedUntil(0);
      setAttempts(0);
      setError("");
    }
  }, [isLocked, lockedUntil]);

  const remainingAttempts = useMemo(() => Math.max(0, 3 - attempts), [attempts]);

  const verify = () => {
    if (isLocked) return;
    if (code === DEMO_OTP) {
      const raw = window.sessionStorage.getItem("minar_pending_pilgrim");
      if (!raw) { router.replace("/identify"); return; }
      const pilgrim = JSON.parse(raw) as Pilgrim;
      window.localStorage.removeItem(LOCK_KEY);
      window.localStorage.removeItem(ATTEMPTS_KEY);
      window.sessionStorage.removeItem("minar_pending_pilgrim");
      setPilgrim(pilgrim);
      router.replace(returnTo);
      return;
    }
    const nextAttempts = attempts + 1;
    if (nextAttempts >= 3) {
      const until = Date.now() + LOCK_MS;
      window.localStorage.setItem(LOCK_KEY, String(until));
      window.localStorage.setItem(ATTEMPTS_KEY, "0");
      setLockedUntil(until);
      setNow(Date.now());
      setAttempts(0);
      setError(t("تم تجاوز عدد المحاولات. تم قفل الدخول لمدة 5 دقائق.", "Too many attempts. Sign-in is locked for 5 minutes."));
    } else {
      window.localStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));
      setAttempts(nextAttempts);
      setError(t(`الرمز غير صحيح. تبقى ${3 - nextAttempts} محاولة.`, `Incorrect code. ${3 - nextAttempts} attempt(s) remaining.`));
    }
    setCode("");
  };

  const resend = () => {
    if (isLocked) return;
    setNotice(t("تمت إعادة إرسال الرمز التجريبي برسالة SMS. الرمز هو 1234.", "The demo code was resent by SMS. The code is 1234."));
    setError("");
  };

  return <div className="mx-auto flex w-full max-w-2xl flex-1 items-center p-5 sm:p-8">
    <section className="relative w-full overflow-hidden rounded-[2rem] border border-gold-100 bg-white p-7 text-center shadow-card-hover sm:p-10">
      <div className="ministry-ornament absolute inset-x-0 top-0 h-2" />
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-100 text-brand-900">{isLocked ? <Clock3 className="h-8 w-8" /> : <LockKeyhole className="h-8 w-8" />}</span>
      <h1 className="mt-5 text-kiosk-xl font-bold text-brand-900">{t("التحقق بخطوتين", "Two-step verification")}</h1>
      <div className="mx-auto mt-4 flex max-w-xl items-start gap-3 rounded-2xl bg-brand-50 p-4 text-start text-kiosk-xs text-brand-900"><MessageSquareText className="mt-1 h-5 w-5 shrink-0" /><p>{notice}</p></div>

      {isLocked ? <div className="mt-7 rounded-[1.5rem] border border-emergency/20 bg-status-badBg p-6">
        <p className="font-bold text-emergency">{t("الدخول مقفل مؤقتًا", "Sign-in is temporarily locked")}</p>
        <p className="mt-3 font-mono text-[3rem] font-bold text-brand-900" dir="ltr">{formatCountdown(lockSeconds)}</p>
        <p className="mt-2 text-kiosk-xs text-ink-500">{t("يمكنك المحاولة مجددًا بعد انتهاء العداد.", "You can try again when the countdown ends.")}</p>
      </div> : <>
        <label className="mx-auto mt-7 block max-w-sm text-start"><span className="font-bold text-brand-900">{t("رمز التحقق", "Verification code")}</span><input autoFocus inputMode="numeric" maxLength={4} value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, "")); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter" && code.length === 4) verify(); }} placeholder="1234" dir="ltr" className="mt-2 h-touch-lg w-full rounded-2xl border-2 border-cream-300 bg-cream-100 px-5 text-center text-[2rem] font-bold tracking-[.5em] outline-none focus:border-gold-500" /></label>
        <p className="mt-3 text-sm text-ink-500">{t(`المحاولات المتاحة: ${remainingAttempts}`, `Available attempts: ${remainingAttempts}`)}</p>
        {error && <p role="alert" className="mt-4 rounded-2xl bg-status-badBg p-4 font-bold text-emergency">{error}</p>}
        <button type="button" disabled={code.length !== 4} onClick={verify} className="mt-6 flex h-touch-lg w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 text-kiosk-sm font-bold text-white disabled:opacity-40"><CheckCircle2 className="h-5 w-5" />{t("تحقق ودخول", "Verify and sign in")}</button>
        <button type="button" onClick={resend} className="mt-3 inline-flex h-12 items-center gap-2 rounded-2xl px-5 font-bold text-brand-700 hover:bg-brand-50"><RotateCcw className="h-4 w-4" />{t("إعادة إرسال الرمز", "Resend code")}</button>
      </>}

      <button type="button" onClick={() => { window.sessionStorage.removeItem("minar_pending_pilgrim"); router.replace(`/identify?returnTo=${encodeURIComponent(returnTo)}`); }} className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl px-5 font-bold text-ink-500 hover:bg-cream-100"><ArrowRight className="h-4 w-4" />{t("الرجوع لتسجيل الدخول", "Back to sign in")}</button>
    </section>
  </div>;
}

export default function OtpPage() {
  return <Suspense fallback={<div className="m-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />}><OtpScreen /></Suspense>;
}

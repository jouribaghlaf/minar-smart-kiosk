"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { AlertBanner } from "@/components/common/AlertBanner";
import { Button } from "@/components/common/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import type { IdentificationMethod } from "@/types/pilgrim";
import { useIdentification } from "./_components/useIdentification";
import { VerificationStepper } from "./_components/VerificationStepper";
import { PilgrimInfoPreview } from "./_components/PilgrimInfoPreview";
import { CredentialEntryPanel } from "./_components/CredentialEntryPanel";
import { AlternativeMethodsRow } from "./_components/AlternativeMethodsRow";
import { ContinueToHomePanel } from "./_components/ContinueToHomePanel";

const VALID_METHODS: IdentificationMethod[] = ["PASSPORT", "QR_CODE"];
const FIRST_STEP_LABELS: Record<IdentificationMethod, { ar: string; en: string }> = {
  QR_CODE: { ar: "قراءة رمز بطاقة نسك", en: "Reading Nusuk card QR" },
  PASSPORT: { ar: "قراءة بيانات الجواز", en: "Reading passport data" },
};

function IdentificationScreen() {
  const { t } = useLanguage();
  const { startGuestSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const methodParam = searchParams.get("method");
  const method: IdentificationMethod = VALID_METHODS.includes(methodParam as IdentificationMethod) ? methodParam as IdentificationMethod : "PASSPORT";
  const { status, step, pilgrim, errorMessage, identify, reset } = useIdentification(method);

  useEffect(() => reset(), [method, reset]);
  const handleSelectMethod = useCallback((next: IdentificationMethod) => router.push(`/identify?method=${next}`), [router]);

  return (
    <div className="flex flex-1 flex-col gap-7 p-4 sm:p-6 lg:p-8">
      <header className="mx-auto max-w-4xl text-center">
        <span className="mb-3 inline-flex rounded-full border border-gold-100 bg-white px-4 py-2 text-sm font-bold text-gold-600 shadow-card">{t("دخول آمن وسريع", "Secure and fast access")}</span>
        <h1 className="text-kiosk-2xl font-bold text-brand-900">{t("اختر طريقة الدخول", "Choose how to continue")}</h1>
        <p className="mt-2 text-kiosk-sm text-ink-500">{t("استخدم قارئ الجوازات أو رمز QR في بطاقة نسك، أو تابع مباشرة كضيف.", "Use the passport reader, Nusuk card QR, or continue as a guest.")}</p>
      </header>

      <AlternativeMethodsRow currentMethod={method} onSelect={handleSelectMethod} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <CredentialEntryPanel method={method} status={status} onSubmit={identify} />
        <div className="flex flex-col gap-4">
          <VerificationStepper status={status} step={step} firstStepLabelAr={FIRST_STEP_LABELS[method].ar} firstStepLabelEn={FIRST_STEP_LABELS[method].en} />
          <PilgrimInfoPreview pilgrim={pilgrim} />
          {status === "success" && <ContinueToHomePanel />}
          {status === "error" && (
            <div className="flex flex-col gap-3">
              <AlertBanner icon={AlertCircle} tone="error" title={t("تعذر التحقق", "Verification failed")} message={errorMessage ?? t("تعذر قراءة البيانات. حاول مرة أخرى أو اختر طريقة أخرى.", "We could not read the data. Try again or choose another method.")} />
              <Button variant="outline" onClick={reset} icon={<RefreshCw className="h-5 w-5" />}>{t("إعادة المحاولة", "Try again")}</Button>
            </div>
          )}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-gold-100 bg-white p-6 shadow-card">
        <div className="absolute inset-y-0 start-0 w-1.5 bg-gold-500" />
        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-start">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><UserRound className="h-7 w-7" /></span>
            <div><h2 className="text-kiosk-sm font-bold text-brand-900">{t("الاستمرار كضيف", "Continue as a guest")}</h2><p className="mt-1 text-kiosk-xs text-ink-500">{t("استخدم الخدمات العامة دون استرجاع بيانات شخصية.", "Use public services without retrieving personal data.")}</p></div>
          </div>
          <button type="button" onClick={async () => { await startGuestSession(); router.push("/services"); }} className="h-touch shrink-0 rounded-2xl bg-brand-700 px-8 text-kiosk-sm font-bold text-white hover:bg-brand-600">{t("الدخول كضيف", "Enter as guest")}</button>
        </div>
      </section>

      <AlertBanner icon={ShieldCheck} tone="info" title={t("خصوصيتك أمانة لدينا", "Your privacy is our trust")} message={t("تُستخدم بيانات الجواز أو رمز بطاقة نسك للتحقق التجريبي فقط، وتُمسح بيانات الجلسة عند تسجيل الخروج.", "Passport or Nusuk card data is used only for demo verification and cleared when the session ends.")} />
    </div>
  );
}

function IdentificationFallback() {
  return <div className="flex flex-1 items-center justify-center p-10"><div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" /></div>;
}

export default function IdentificationPage() {
  return <Suspense fallback={<IdentificationFallback />}><IdentificationScreen /></Suspense>;
}

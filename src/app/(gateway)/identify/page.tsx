"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, AlertCircle, RefreshCw, UserRound } from "lucide-react";
import { AlertBanner } from "@/components/common/AlertBanner";
import { Button } from "@/components/common/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import type { IdentificationMethod } from "@/types/pilgrim";
import { useIdentification } from "./_components/useIdentification";
import { VerificationStepper } from "./_components/VerificationStepper";
import { PilgrimInfoPreview } from "./_components/PilgrimInfoPreview";
import { FaceRecognitionPanel } from "./_components/FaceRecognitionPanel";
import { CredentialEntryPanel } from "./_components/CredentialEntryPanel";
import { AlternativeMethodsRow } from "./_components/AlternativeMethodsRow";
import { ContinueToHomePanel } from "./_components/ContinueToHomePanel";

const VALID_METHODS: IdentificationMethod[] = [
  "FACE_RECOGNITION",
  "PASSPORT",
];

const FIRST_STEP_LABELS: Record<IdentificationMethod, { ar: string; en: string }> = {
  FACE_RECOGNITION: { ar: "التقاط صورة الوجه", en: "Capturing face photo" },
  NUSUK_CARD: { ar: "قراءة بطاقة نسك", en: "Reading Nusuk card" },
  QR_CODE: { ar: "قراءة رمز QR", en: "Reading QR code" },
  PASSPORT: { ar: "قراءة الجواز", en: "Reading passport" },
  NATIONAL_ID: { ar: "قراءة رقم الهوية", en: "Reading ID number" },
};

function IdentificationScreen() {
  const { t } = useLanguage();
  const { startGuestSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const methodParam = searchParams.get("method");
  const method: IdentificationMethod = VALID_METHODS.includes(methodParam as IdentificationMethod)
    ? (methodParam as IdentificationMethod)
    : "FACE_RECOGNITION";

  const { status, step, pilgrim, errorMessage, identify, reset } = useIdentification(method);

  // Whenever the selected method changes (via an alternative-method tile
  // or a fresh link from Screen 01), start clean.
  useEffect(() => {
    reset();
  }, [method, reset]);

  const handleSelectMethod = useCallback(
    (next: IdentificationMethod) => {
      router.push(`/identify?method=${next}`);
    },
    [router]
  );

  const firstStepLabel = FIRST_STEP_LABELS[method];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-kiosk-2xl font-bold text-brand-900">{t("التعرّف الذكي", "Smart Identification")}</h1>
        <p className="mt-1 text-kiosk-sm text-ink-500">
          {t(
            "نستخدم الذكاء الاصطناعي للتحقق من هويتك بسرعة وأمان",
            "We use AI to verify your identity quickly and securely"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {method === "FACE_RECOGNITION" ? (
          <FaceRecognitionPanel status={status} onStart={() => identify()} />
        ) : (
          <CredentialEntryPanel method={method} status={status} onSubmit={(value) => identify(value)} />
        )}

        <div className="flex flex-col gap-4">
          <VerificationStepper
            status={status}
            step={step}
            firstStepLabelAr={firstStepLabel.ar}
            firstStepLabelEn={firstStepLabel.en}
          />
          <PilgrimInfoPreview pilgrim={pilgrim} />

          {status === "success" && <ContinueToHomePanel />}

          {status === "error" && (
            <div className="flex flex-col gap-3">
              <AlertBanner
                icon={AlertCircle}
                tone="error"
                title={t("تعذر التحقق", "Verification failed")}
                message={
                  errorMessage ??
                  t(
                    "حدث خطأ أثناء التحقق من الهوية. يرجى المحاولة مرة أخرى.",
                    "Something went wrong while verifying your identity. Please try again."
                  )
                }
              />
              {method !== "FACE_RECOGNITION" && (
                <Button variant="outline" onClick={reset} icon={<RefreshCw className="h-5 w-5" />}>
                  {t("إعادة المحاولة", "Try again")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <AlternativeMethodsRow currentMethod={method} onSelect={handleSelectMethod} />

      <div className="flex flex-col items-center gap-3 rounded-card border-2 border-dashed border-brand-100 bg-brand-50 p-6 text-center">
        <UserRound className="h-8 w-8 text-brand-700" aria-hidden="true" />
        <div>
          <h2 className="text-kiosk-sm font-bold text-brand-900">{t("أو تابع كضيف", "Or continue as a guest")}</h2>
          <p className="mt-1 text-kiosk-xs text-ink-500">{t("يمكنك استخدام جميع الخدمات العامة دون تسجيل الدخول", "Access all public services without signing in")}</p>
        </div>
        <button type="button" onClick={() => { startGuestSession(); router.push("/services"); }} className="flex h-touch items-center justify-center rounded-2xl border-2 border-brand-700 bg-white px-8 text-kiosk-sm font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white">
          {t("الاستمرار كضيف", "Continue as guest")}
        </button>
      </div>

      <AlertBanner
        icon={ShieldCheck}
        tone="info"
        title={t("خصوصيتك أمانة لدينا", "Your privacy is our trust")}
        message={t(
          "تتم معالجة بياناتك وفق أعلى معايير الأمان والخصوصية، ولا يتم الاحتفاظ بصورة الوجه بعد انتهاء الجلسة.",
          "Your data is processed to the highest security and privacy standards, and your face photo is never retained after the session ends."
        )}
      />
    </div>
  );
}

function IdentificationFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700" />
    </div>
  );
}

/**
 * Screen 02 — Smart Identification.
 *
 * Wrapped in Suspense because it reads the `method` query parameter via
 * `useSearchParams`, which Next.js requires to be inside a Suspense
 * boundary. Like Screen 01, the Top Bar, Sidebar (absent here), and
 * Bottom Bar all come from the global AppShell — nothing shell-related is
 * rendered by this file.
 */
export default function IdentificationPage() {
  return (
    <Suspense fallback={<IdentificationFallback />}>
      <IdentificationScreen />
    </Suspense>
  );
}

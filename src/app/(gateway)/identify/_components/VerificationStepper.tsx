"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import type { VerificationStep, IdentificationStatus } from "./useIdentification";

interface StepDefinition {
  labelAr: string;
  labelEn: string;
  inProgressAr: string;
  inProgressEn: string;
}

interface VerificationStepperProps {
  status: IdentificationStatus;
  step: VerificationStep;
  /** The first step copy reflects the selected scanner. */
  firstStepLabelAr: string;
  firstStepLabelEn: string;
}

export function VerificationStepper({
  status,
  step,
  firstStepLabelAr,
  firstStepLabelEn,
}: VerificationStepperProps) {
  const { t } = useLanguage();

  const steps: StepDefinition[] = [
    {
      labelAr: firstStepLabelAr,
      labelEn: firstStepLabelEn,
      inProgressAr: "جاري المعالجة...",
      inProgressEn: "Processing...",
    },
    {
      labelAr: "التحقق من الهوية",
      labelEn: "Verifying identity",
      inProgressAr: "جاري التحقق من الهوية",
      inProgressEn: "Verifying your identity",
    },
    {
      labelAr: "تحميل البيانات",
      labelEn: "Loading data",
      inProgressAr: "جاري تحميل البيانات",
      inProgressEn: "Loading your data",
    },
    {
      labelAr: "تحديد اللغة",
      labelEn: "Setting language",
      inProgressAr: "جاري تحديد اللغة",
      inProgressEn: "Setting your language",
    },
  ];

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("حالة التحقق", "Verification Status")}</h3>
      <ol className="mt-4 flex flex-col gap-4">
        {steps.map((s, index) => {
          const isDone = status === "success" || (status !== "idle" && index < step);
          const isActive = status === "processing" && index === step;
          const isFailed = status === "error" && index === step;

          return (
            <li key={index} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isDone && "bg-status-goodBg text-status-good",
                  isActive && "bg-brand-100 text-brand-700",
                  isFailed && "bg-status-badBg text-status-bad",
                  !isDone && !isActive && !isFailed && "bg-cream-200 text-ink-300"
                )}
              >
                {isDone ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <span className="text-kiosk-xs font-bold">{index + 1}</span>
                )}
              </span>
              <div>
                <p
                  className={cn(
                    "text-kiosk-sm font-semibold",
                    isDone || isActive ? "text-ink-900" : "text-ink-300"
                  )}
                >
                  {t(s.labelAr, s.labelEn)}
                </p>
                {isActive && (
                  <p className="text-kiosk-xs text-ink-500">{t(s.inProgressAr, s.inProgressEn)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

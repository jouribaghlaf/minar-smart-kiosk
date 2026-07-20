"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useLanguage } from "@/hooks/useLanguage";

const AUTO_REDIRECT_SECONDS = 4;

export function ContinueToHomePanel({ destination = "/services" }: { destination?: string }) {
  const { t, direction } = useLanguage();
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REDIRECT_SECONDS);
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push(destination);
      return;
    }
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft, router, destination]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-status-good/30 bg-status-goodBg p-5 text-center">
      <CheckCircle2 className="h-8 w-8 text-status-good" aria-hidden="true" />
      <p className="text-kiosk-sm font-bold text-ink-900">{t("تم التحقق بنجاح", "Verified successfully")}</p>
      <Button onClick={() => router.push(destination)} icon={<ArrowIcon className="h-5 w-5" />} iconPosition="end">
        {destination === "/services" ? t("متابعة إلى الرئيسية", "Continue to Home") : t("متابعة إلى الخدمة", "Continue to service")}
      </Button>
      <p className="text-kiosk-xs text-ink-500">
        {t(
          `سيتم نقلك تلقائياً خلال ${secondsLeft} ثوانٍ`,
          `Redirecting automatically in ${secondsLeft}s`
        )}
      </p>
    </div>
  );
}

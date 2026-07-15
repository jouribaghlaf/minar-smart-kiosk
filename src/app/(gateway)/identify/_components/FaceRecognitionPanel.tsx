"use client";

import { RefreshCw, ScanFace } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAccessibility } from "@/hooks/useAccessibility";
import type { IdentificationStatus } from "./useIdentification";

interface FaceRecognitionPanelProps {
  status: IdentificationStatus;
  onStart: () => void;
}

/**
 * Camera preview mock. No real camera/computer-vision model is available
 * in this environment, so this renders an original abstract face-outline
 * graphic with a scanning-line animation rather than reproducing a stock
 * photo — consistent with the same copyright caution applied to Screen
 * 01's banner. Swapping in a live <video> feed + real CV model later only
 * touches this component; the surrounding stepper/state machine is
 * already provider-agnostic.
 */
export function FaceRecognitionPanel({ status, onStart }: FaceRecognitionPanelProps) {
  const { t } = useLanguage();
  const { settings } = useAccessibility();

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-card bg-brand-900">
      <svg
        viewBox="0 0 200 200"
        className="h-40 w-40 text-white/70 sm:h-52 sm:w-52"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="100" cy="80" r="45" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M55 150c8-22 25-34 45-34s37 12 45 34"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Corner focus brackets */}
        {[
          "M20 20 h20 M20 20 v20",
          "M180 20 h-20 M180 20 v20",
          "M20 180 h20 M20 180 v-20",
          "M180 180 h-20 M180 180 v-20",
        ].map((d) => (
          <path key={d} d={d} stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity={0.8} />
        ))}
      </svg>

      {status === "processing" && !settings.reducedMotion && (
        <div
          className="absolute inset-x-8 h-1 rounded-full bg-gold-400/80 shadow-[0_0_16px_4px_rgba(198,138,46,0.5)]"
          style={{ animation: "minar-scan-line 1.8s ease-in-out infinite" }}
          aria-hidden="true"
        />
      )}
      {status === "processing" && settings.reducedMotion && (
        <div
          className="absolute inset-x-8 top-1/2 h-1 rounded-full bg-gold-400/80"
          aria-hidden="true"
        />
      )}

      <div
        className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-1 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-kiosk-sm font-semibold text-white">
          {status === "processing"
            ? t("جارٍ التعرف على الوجه...", "Scanning your face...")
            : status === "success"
              ? t("تم التعرف بنجاح", "Recognized successfully")
              : status === "error"
                ? t("تعذر التعرف على الوجه", "Couldn't recognize your face")
                : t("يرجى النظر إلى الكاميرا", "Please look at the camera")}
        </p>
        <p className="text-kiosk-xs text-white/60">
          {status === "processing" && t("يرجى الثبات والنظر إلى الكاميرا", "Please hold still and look at the camera")}
        </p>
      </div>

      {status === "error" && (
        <button
          type="button"
          data-touch-target
          onClick={onStart}
          className="absolute inset-x-0 bottom-16 mx-auto flex h-touch w-fit items-center gap-2 rounded-2xl bg-white px-6 text-kiosk-sm font-semibold text-brand-900 shadow-card"
        >
          <RefreshCw className="h-5 w-5" aria-hidden="true" />
          {t("إعادة المحاولة", "Try again")}
        </button>
      )}

      {status === "idle" && (
        <button type="button" onClick={onStart} className="absolute bottom-16 flex h-touch items-center gap-2 rounded-2xl bg-gold-500 px-7 text-kiosk-sm font-bold text-brand-900 shadow-card hover:bg-gold-400">
          <ScanFace className="h-6 w-6" />
          {t("بدء التعرف على الوجه", "Start face recognition")}
        </button>
      )}

      <style>{`
        @keyframes minar-scan-line {
          0% { top: 20%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 80%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

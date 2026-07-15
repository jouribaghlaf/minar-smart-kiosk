"use client";

import { useState, type FormEvent } from "react";
import { CreditCard, QrCode, BookUser, IdCard, RefreshCw, ScanLine, type LucideIcon } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useLanguage } from "@/hooks/useLanguage";
import type { IdentificationMethod } from "@/types/pilgrim";
import type { IdentificationStatus } from "./useIdentification";

interface MethodConfig {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  instructionAr: string;
  instructionEn: string;
  placeholderAr: string;
  placeholderEn: string;
  /** A working demo credential so the flow is testable end-to-end without
   *  real hardware — shown as a hint, matching "use mock data for
   *  demonstration purposes" from the requirements. */
  demoValue: string;
  inputMode: "text" | "numeric";
}

const METHOD_CONFIG: Record<Exclude<IdentificationMethod, "FACE_RECOGNITION">, MethodConfig> = {
  NUSUK_CARD: {
    icon: CreditCard,
    titleAr: "بطاقة نسك",
    titleEn: "Nusuk Card",
    instructionAr: "مرر بطاقة نسك أمام الماسح، أو أدخل رقمها يدوياً",
    instructionEn: "Tap your Nusuk card on the scanner, or enter its number manually",
    placeholderAr: "رقم البطاقة",
    placeholderEn: "Card number",
    demoValue: "NSK-778812",
    inputMode: "text",
  },
  QR_CODE: {
    icon: QrCode,
    titleAr: "رمز QR",
    titleEn: "QR Code",
    instructionAr: "ضع رمز QR أمام الماسح، أو أدخله يدوياً",
    instructionEn: "Hold your QR code up to the scanner, or enter it manually",
    placeholderAr: "رمز QR",
    placeholderEn: "QR code",
    demoValue: "MINAR-QR-778812",
    inputMode: "text",
  },
  PASSPORT: {
    icon: BookUser,
    titleAr: "جواز السفر",
    titleEn: "Passport",
    instructionAr: "امسح صفحة البيانات في جواز سفرك، أو أدخل رقمه يدوياً",
    instructionEn: "Scan your passport's data page, or enter its number manually",
    placeholderAr: "رقم الجواز",
    placeholderEn: "Passport number",
    demoValue: "A1234567",
    inputMode: "text",
  },
  NATIONAL_ID: {
    icon: IdCard,
    titleAr: "الهوية الوطنية / الإقامة",
    titleEn: "National ID / Iqama",
    instructionAr: "أدخل رقم الهوية الوطنية أو الإقامة",
    instructionEn: "Enter your National ID or Iqama number",
    placeholderAr: "رقم الهوية",
    placeholderEn: "ID number",
    demoValue: "1029384756",
    inputMode: "numeric",
  },
};

interface CredentialEntryPanelProps {
  method: Exclude<IdentificationMethod, "FACE_RECOGNITION">;
  status: IdentificationStatus;
  onSubmit: (value: string) => void;
}

export function CredentialEntryPanel({ method, status, onSubmit }: CredentialEntryPanelProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const config = METHOD_CONFIG[method];
  const Icon = config.icon;
  const isProcessing = status === "processing";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isProcessing) return;
    onSubmit(value.trim());
  };

  return (
    <div className="flex aspect-[4/3] w-full flex-col justify-center gap-5 rounded-card bg-brand-900 p-8 text-white">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className="text-kiosk-base font-bold">{t(config.titleAr, config.titleEn)}</p>
          <p className="text-kiosk-xs text-white/60">{t(config.instructionAr, config.instructionEn)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {method === "PASSPORT" && !isProcessing && (
          <button type="button" onClick={() => setValue(config.demoValue)} className="flex h-touch items-center justify-center gap-2 rounded-2xl border-2 border-gold-400 bg-white/10 text-kiosk-sm font-bold text-white hover:bg-white/20">
            <ScanLine className="h-6 w-6" />
            {t("مسح جواز السفر تجريبيًا", "Scan passport (demo)")}
          </button>
        )}
        <input
          type="text"
          inputMode={config.inputMode}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isProcessing}
          placeholder={t(config.placeholderAr, config.placeholderEn)}
          dir="ltr"
          className="h-touch w-full rounded-2xl border-2 border-white/20 bg-white/10 px-4 text-center text-kiosk-base font-semibold tracking-wide text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none disabled:opacity-50"
        />
        <p className="text-center text-[0.7rem] text-white/40">
          {t(`جرّب القيمة التجريبية: ${config.demoValue}`, `Try the demo value: ${config.demoValue}`)}
        </p>

        {isProcessing ? (
          <div className="flex h-touch-lg items-center justify-center gap-2 rounded-2xl bg-white/10 text-kiosk-sm font-semibold text-white/70">
            <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t("جارٍ التحقق...", "Verifying...")}
          </div>
        ) : (
          <Button type="submit" size="lg" disabled={!value.trim()} className="bg-gold-500 text-brand-900 hover:bg-gold-400">
            {t("تحقق", "Verify")}
          </Button>
        )}
      </form>
    </div>
  );
}

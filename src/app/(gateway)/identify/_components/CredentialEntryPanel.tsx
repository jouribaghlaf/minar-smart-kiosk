"use client";

import { useState, type FormEvent } from "react";
import { BookOpenCheck, FileKey2, QrCode, RefreshCw, ScanLine, type LucideIcon } from "lucide-react";
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
  actionAr: string;
  actionEn: string;
  placeholderAr: string;
  placeholderEn: string;
  demoValue: string;
}

const METHOD_CONFIG: Record<IdentificationMethod, MethodConfig> = {
  VISA: {
    icon: FileKey2,
    titleAr: "التحقق برقم التأشيرة",
    titleEn: "Verify with visa number",
    instructionAr: "أدخل رقم التأشيرة المكوّن من 10 أرقام فقط دون حروف أو رموز",
    instructionEn: "Enter the 10-digit visa number using numbers only",
    actionAr: "استخدام رقم تأشيرة تجريبي",
    actionEn: "Use demo visa number",
    placeholderAr: "رقم التأشيرة",
    placeholderEn: "Visa number",
    demoValue: "1234567890",
  },
  QR_CODE: {
    icon: QrCode,
    titleAr: "مسح رمز QR لبطاقة نسك",
    titleEn: "Scan Nusuk card QR",
    instructionAr: "ضع رمز البطاقة داخل إطار الماسح حتى تتم قراءته تلقائيًا",
    instructionEn: "Place the card QR inside the scanner frame",
    actionAr: "تشغيل ماسح QR التجريبي",
    actionEn: "Start demo QR scanner",
    placeholderAr: "رمز بطاقة نسك",
    placeholderEn: "Nusuk card QR",
    demoValue: "MINAR-QR-778812",
  },
  PASSPORT: {
    icon: BookOpenCheck,
    titleAr: "قراءة جواز السفر",
    titleEn: "Read passport",
    instructionAr: "ضع صفحة البيانات في قارئ الجوازات كما هو موضح",
    instructionEn: "Place the data page on the passport reader",
    actionAr: "تشغيل قارئ الجواز التجريبي",
    actionEn: "Start demo passport reader",
    placeholderAr: "رقم الجواز",
    placeholderEn: "Passport number",
    demoValue: "A1234567",
  },
};

export function CredentialEntryPanel({ method, status, onSubmit }: { method: IdentificationMethod; status: IdentificationStatus; onSubmit: (value: string) => void }) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const config = METHOD_CONFIG[method];
  const Icon = config.icon;
  const isProcessing = status === "processing";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (method === "VISA") {
      if (/[^0-9]/.test(value)) {
        setValidationError(t("رقم التأشيرة يقبل الأرقام فقط، ولا يمكن إدخال حروف أو رموز.", "Visa number accepts digits only; letters and symbols are not allowed."));
        return;
      }
      if (value.length !== 10) {
        setValidationError(t("رقم التأشيرة يجب أن يتكون من 10 أرقام.", "Visa number must contain exactly 10 digits."));
        return;
      }
    }
    if (value.trim() && !isProcessing) onSubmit(value.trim());
  };

  const simulateScan = () => {
    setValue(config.demoValue);
    onSubmit(config.demoValue);
  };

  return (
    <div className="relative flex min-h-[30rem] w-full flex-col justify-center overflow-hidden rounded-[2rem] bg-brand-900 p-7 text-white shadow-card-hover sm:p-9">
      <div className="ministry-ornament absolute inset-x-0 top-0 h-2" />
      <div className="absolute -end-24 -top-24 h-64 w-64 rounded-full border border-gold-400/20" />
      <div className="relative">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/30 bg-white/10 text-gold-400">
          <Icon className="h-8 w-8" />
        </span>
        <h2 className="text-kiosk-xl font-bold">{t(config.titleAr, config.titleEn)}</h2>
        <p className="mt-2 max-w-xl text-kiosk-xs leading-relaxed text-white/70">{t(config.instructionAr, config.instructionEn)}</p>

        {method !== "VISA" && <div className="my-6 flex h-36 items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gold-400/45 bg-black/10">
          {isProcessing ? <RefreshCw className="h-12 w-12 animate-spin text-gold-400" /> : <ScanLine className="h-12 w-12 text-gold-400" />}
        </div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {method !== "VISA" && <button type="button" disabled={isProcessing} onClick={simulateScan} className="flex h-touch-lg items-center justify-center gap-3 rounded-2xl bg-gold-500 px-6 text-kiosk-sm font-bold text-brand-900 transition hover:bg-gold-400 disabled:opacity-50">
            <ScanLine className="h-6 w-6" />
            {isProcessing ? t("جارٍ التحقق...", "Verifying...") : t(config.actionAr, config.actionEn)}
          </button>}
          {method !== "VISA" && <div className="flex items-center gap-3 text-white/40"><span className="h-px flex-1 bg-white/15" /><span className="text-xs">{t("إدخال تجريبي بديل", "Demo fallback")}</span><span className="h-px flex-1 bg-white/15" /></div>}
          <div className="flex gap-2">
            <input value={value} onChange={(event) => { setValue(event.target.value); setValidationError(""); }} inputMode={method === "VISA" ? "numeric" : undefined} maxLength={method === "VISA" ? 10 : undefined} disabled={isProcessing} placeholder={method === "VISA" ? t("أدخل 10 أرقام", "Enter 10 digits") : t(config.placeholderAr, config.placeholderEn)} dir="ltr" aria-invalid={Boolean(validationError)} className={`h-touch min-w-0 flex-1 rounded-2xl border bg-white/10 px-4 text-center text-kiosk-xs text-white outline-none placeholder:text-white/35 focus:border-gold-400 ${validationError ? "border-emergency" : "border-white/20"}`} />
            <Button type="submit" disabled={!value.trim() || isProcessing} className="bg-white text-brand-900 hover:bg-cream-100">{t("تحقق", "Verify")}</Button>
          </div>
          {method === "VISA" && <p className={`text-sm font-semibold ${validationError ? "text-red-300" : "text-white/60"}`}>{validationError || t(`${value.length}/10 أرقام`, `${value.length}/10 digits`)}</p>}
        </form>
      </div>
    </div>
  );
}

"use client";

import { Smartphone } from "lucide-react";
import { QRCard } from "@/components/cards/QRCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

export function QRContinueCard({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t } = useLanguage();

  // Encodes a lightweight continuation payload — a real deployment would
  // point this at a short-lived signed URL that hands the pilgrim's
  // session off to their phone's browser/app.
  const qrValue = `MINAR-CONTINUE:${pilgrim.id}:${Date.now()}`;

  return (
    <QRCard
      icon={Smartphone}
      title={t("أكمل رحلتك على هاتفك", "Continue on Your Phone")}
      description={t(
        "امسح رمز QR لإرسال المسار الحالي إلى هاتفك ومتابعة التنقل أثناء السير",
        "Scan the QR code to send your current route to your phone and keep navigating on the go"
      )}
      value={qrValue}
    />
  );
}

"use client";

import { Smartphone } from "lucide-react";
import { QRCard } from "@/components/cards/QRCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { RouteRecommendation } from "@/types/navigation";

export function SendRouteQRCard({ route }: { route: RouteRecommendation }) {
  const { t } = useLanguage();

  return (
    <QRCard
      icon={Smartphone}
      title={t("أرسل المسار إلى جوالك", "Send Route to Your Phone")}
      description={t(
        "امسح رمز QR لمتابعة التنقل خطوة بخطوة على هاتفك دون الحاجة للبقاء أمام الكشك",
        "Scan the QR code to continue step-by-step navigation on your phone without staying at the kiosk"
      )}
      value={route.qrPayload}
    />
  );
}

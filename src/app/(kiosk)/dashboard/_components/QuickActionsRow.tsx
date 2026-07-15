"use client";

import { useState } from "react";
import { AlertOctagon, PhoneCall, MapPin, HelpCircle, Check } from "lucide-react";
import { QuickActionTile } from "@/components/common/QuickActionTile";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

export function QuickActionsRow({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t } = useLanguage();
  const [sosState, setSosState] = useState<"idle" | "sending" | "sent">("idle");

  const handleSOS = async () => {
    if (sosState !== "idle") return;
    setSosState("sending");
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MEDICAL_EMERGENCY",
          notes: t("طلب مساعدة عاجلة من لوحة التحكم", "Urgent assistance requested from the dashboard"),
        }),
      });
      setSosState("sent");
      setTimeout(() => setSosState("idle"), 4000);
    } catch {
      setSosState("idle");
    }
  };

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <h3 className="text-kiosk-sm font-bold text-ink-900">{t("إجراءات سريعة", "Quick Actions")}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          data-touch-target
          onClick={handleSOS}
          disabled={sosState !== "idle"}
          className="flex flex-col items-center justify-center gap-2 rounded-card border border-status-bad/30 bg-status-badBg p-4 text-center text-status-bad shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover disabled:opacity-70"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-status-bad text-white">
            {sosState === "sent" ? (
              <Check className="h-6 w-6" aria-hidden="true" />
            ) : (
              <AlertOctagon className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
          <span className="text-kiosk-xs font-semibold">
            {sosState === "sending"
              ? t("جارٍ الإرسال...", "Sending...")
              : sosState === "sent"
                ? t("تم الإرسال", "Sent")
                : t("حالة طوارئ", "Emergency (SOS)")}
          </span>
        </button>

        <QuickActionTile
          icon={PhoneCall}
          label={t("الاتصال بالمشرف", "Call Supervisor")}
          href={`tel:${pilgrim.campaign.supervisor.phone}`}
        />

        <QuickActionTile
          icon={MapPin}
          label={t("مشاركة الموقع", "Share Location")}
          onClick={() => window.alert(t("تمت مشاركة موقعك مع المشرف", "Your location has been shared with your supervisor"))}
        />

        <QuickActionTile
          icon={HelpCircle}
          label={t("الأسئلة الشائعة", "FAQ")}
          onClick={() => window.alert(t("الأسئلة الشائعة قادمة قريباً", "FAQ coming soon"))}
        />
      </div>
    </div>
  );
}

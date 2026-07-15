"use client";

import { useEffect, useState } from "react";
import { Siren, Check, MapPinned } from "lucide-react";
import { ContactCard } from "@/components/cards/ContactCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { EmergencyContact } from "@/types/health";

/**
 * "طلب إسعاف عاجل" posts to /api/reports the same way Dashboard's SOS
 * button does. That endpoint already accepts anonymous submissions
 * (pilgrim id is attached only when a session exists — see
 * reportService.ts) so this works identically for guests and
 * authenticated pilgrims, matching "Emergency Services" being a public
 * feature.
 */
export function EmergencyServicesCard() {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [requestState, setRequestState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/emergency-contacts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setContacts(data?.contacts ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const redCrescent = contacts.find((c) => c.label.includes("الهلال")) ?? contacts.find((c) => c.label.includes("Red"));

  const handleRequestAmbulance = async () => {
    if (requestState !== "idle") return;
    setRequestState("sending");
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MEDICAL_EMERGENCY",
          notes: t("طلب إسعاف عاجل من شاشة الخدمات الصحية", "Urgent ambulance request from Healthcare screen"),
        }),
      });
      setRequestState("sent");
      setTimeout(() => setRequestState("idle"), 4000);
    } catch {
      setRequestState("idle");
    }
  };

  return (
    <div id="emergency-services" className="rounded-card border border-status-bad/20 bg-status-badBg p-5">
      <div className="flex items-center gap-2 text-status-bad">
        <Siren className="h-5 w-5" aria-hidden="true" />
        <h2 className="text-kiosk-sm font-bold">{t("حالات الطوارئ", "Emergency Services")}</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          data-touch-target
          onClick={handleRequestAmbulance}
          disabled={requestState !== "idle"}
          className="flex h-touch-lg items-center justify-center gap-2 rounded-2xl bg-status-bad px-6 text-kiosk-sm font-bold text-white shadow-card transition-colors hover:bg-emergency-dark disabled:opacity-70"
        >
          {requestState === "sent" ? (
            <>
              <Check className="h-5 w-5" aria-hidden="true" />
              {t("تم إرسال الطلب", "Request sent")}
            </>
          ) : (
            <>
              <Siren className="h-5 w-5" aria-hidden="true" />
              {requestState === "sending" ? t("جارٍ الإرسال...", "Sending...") : t("طلب إسعاف عاجل", "Request Urgent Ambulance")}
            </>
          )}
        </button>

        {redCrescent && (
          <ContactCard name={redCrescent.label} role={t("تواصل مباشر", "Direct contact")} phone={redCrescent.number} />
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-kiosk-xs text-status-bad/80">
        <MapPinned className="h-4 w-4 shrink-0" aria-hidden="true" />
        {t(
          "أقرب نقطة إسعاف تظهر ضمن أقرب مركز صحي أدناه",
          "The nearest first-aid point is shown within the nearest health center below"
        )}
      </div>
    </div>
  );
}

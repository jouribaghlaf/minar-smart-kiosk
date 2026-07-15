"use client";

import { useSession } from "@/hooks/useSession";
import { HealthcareGreetingBar } from "./_components/HealthcareGreetingBar";
import { EmergencyServicesCard } from "./_components/EmergencyServicesCard";
import { NearestHealthCenterCard } from "./_components/NearestHealthCenterCard";
import { QuickHealthServicesGrid } from "./_components/QuickHealthServicesGrid";
import { SmartMedicalDeviceCard } from "./_components/SmartMedicalDeviceCard";
import { OtherHealthServicesGrid } from "./_components/OtherHealthServicesGrid";
import { MyHealthInfoCard } from "./_components/MyHealthInfoCard";
import { HealthTipsCard } from "./_components/HealthTipsCard";
import { HealthcareFooterNote } from "./_components/HealthcareFooterNote";

/**
 * Screen 06 — Healthcare Services.
 *
 * PUBLIC service, same architecture as Navigation (Phase 7): guests reach
 * this screen directly from Home with no identification step, and this
 * page never redirects to /identify and never blocks rendering on the
 * session check. `pilgrim` is `null` for guests — a normal, first-class
 * state — and every section here is guest-safe except
 * `MyHealthInfoCard`, the one genuinely personalized section, which
 * renders a sign-in prompt instead of any data when `pilgrim` is null.
 *
 * Per the finalized product architecture, symptom assessment happens on
 * a dedicated Smart Medical Device, not inside this kiosk —
 * `SmartMedicalDeviceCard` is a pure gateway (no in-kiosk AI checker),
 * occupying the same structural slot the original "AI Health Assessment
 * Card" held.
 *
 * The Top Bar, Sidebar, and Bottom Bar are all supplied by the global
 * AppShell — nothing shell-related is rendered by this file.
 */
export default function HealthcarePage() {
  const { pilgrim } = useSession();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <HealthcareGreetingBar pilgrim={pilgrim} />
      <EmergencyServicesCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="flex flex-col gap-6">
          <NearestHealthCenterCard />
          <QuickHealthServicesGrid />
          <SmartMedicalDeviceCard />
          <OtherHealthServicesGrid />
        </div>

        <div className="flex flex-col gap-6">
          <MyHealthInfoCard pilgrim={pilgrim} />
          <HealthTipsCard />
        </div>
      </div>

      <HealthcareFooterNote />
    </div>
  );
}

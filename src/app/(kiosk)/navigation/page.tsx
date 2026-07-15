"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import { setLastActivity } from "@/lib/utils/lastActivity";
import type { DestinationType } from "@/types/navigation";
import { useNavigationData } from "./_components/useNavigationData";
import { NavigationGreetingBar } from "./_components/NavigationGreetingBar";
import { DestinationSelector } from "./_components/DestinationSelector";
import { SmartCrowdAnalysis } from "./_components/SmartCrowdAnalysis";
import { RouteMapPanel } from "./_components/RouteMapPanel";
import { SendRouteQRCard } from "./_components/SendRouteQRCard";
import { NavigationQuickActions } from "./_components/NavigationQuickActions";

const VALID_DESTINATIONS: DestinationType[] = ["TAWAF", "SAI", "CAMP", "RESTROOM", "HEALTH_CENTER"];

const DESTINATION_ACTIVITY_LABEL: Record<DestinationType, { ar: string; en: string }> = {
  TAWAF: { ar: "الملاحة إلى الطواف", en: "Navigating to Tawaf" },
  SAI: { ar: "الملاحة إلى السعي", en: "Navigating to Sa'i" },
  CAMP: { ar: "الملاحة إلى المخيم", en: "Navigating to Camp" },
  RESTROOM: { ar: "الملاحة إلى أقرب دورة مياه", en: "Navigating to Nearest Restroom" },
  HEALTH_CENTER: { ar: "الملاحة إلى أقرب مركز صحي", en: "Navigating to Nearest Health Center" },
};

/**
 * Smart Navigation is a PUBLIC service — per the finalized UX, guests
 * reach this screen directly from Home ("Home → Smart Navigation →
 * Navigation Screen") with no identification step in between. This page
 * therefore never redirects to /identify and never blocks rendering on
 * the session check; `pilgrim` is simply `null` for guests, and every
 * piece of UI here already treats that as a normal, first-class state
 * rather than a loading glitch.
 */
function NavigationScreen() {
  const { pilgrim } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const destinationParam = searchParams.get("destination");
  const initialDestination: DestinationType = VALID_DESTINATIONS.includes(
    destinationParam as DestinationType
  )
    ? (destinationParam as DestinationType)
    : "TAWAF";

  const [destination, setDestination] = useState<DestinationType>(initialDestination);
  const { crowdLevels, route, isLoading, isRefreshing, selectedLevelId, selectLevel, refresh } =
    useNavigationData(destination);

  // "Continue previous activity" is an authenticated-pilgrim feature (see
  // Dashboard). Guests never have activity recorded on their behalf, so
  // this simply no-ops until a real identification session exists.
  useEffect(() => {
    if (!route || !pilgrim) return;
    const label = DESTINATION_ACTIVITY_LABEL[destination];
    setLastActivity({ labelAr: label.ar, labelEn: label.en, href: `/navigation?destination=${destination}` });
  }, [route, destination, pilgrim]);

  const handleChangeDestination = (next: DestinationType) => {
    setDestination(next);
    router.replace(`/navigation?destination=${next}`, { scroll: false });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <NavigationGreetingBar pilgrim={pilgrim} />
      <DestinationSelector selected={destination} onSelect={handleChangeDestination} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="flex flex-col gap-6">
          <SmartCrowdAnalysis
            crowdLevels={crowdLevels}
            route={route}
            selectedLevelId={selectedLevelId}
            onSelectLevel={selectLevel}
          />
          <NavigationQuickActions
            onChangeDestination={() =>
              document.getElementById("destination-selector-anchor")?.scrollIntoView({ behavior: "smooth" })
            }
            onRefreshCrowd={refresh}
            isRefreshing={isRefreshing}
          />
        </div>

        <div className="flex flex-col gap-6">
          <RouteMapPanel route={isLoading ? null : route} />
          {route && <><SendRouteQRCard route={route} /><button type="button" onClick={() => window.print()} className="flex h-touch items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 bg-white font-bold text-brand-700"><Printer className="h-5 w-5" />{t("طباعة خريطة مبسطة", "Print simplified map")}</button></>}
        </div>
      </div>
    </div>
  );
}

function NavigationFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <Loader2 className="h-10 w-10 animate-spin text-brand-700" aria-hidden="true" />
    </div>
  );
}

/**
 * Screen 04 — Smart Navigation & Crowd Management.
 *
 * Wrapped in Suspense because it reads the `destination` query parameter
 * via `useSearchParams` (Dashboard's Smart Recommendations card links
 * here with `?destination=TAWAF`). The Top Bar, Sidebar, and Bottom Bar
 * all come from the global AppShell — nothing shell-related is rendered
 * by this file.
 */
export default function NavigationPage() {
  return (
    <Suspense fallback={<NavigationFallback />}>
      <NavigationScreen />
    </Suspense>
  );
}

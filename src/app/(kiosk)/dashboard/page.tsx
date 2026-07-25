"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { WelcomeHero } from "./_components/WelcomeHero";
import { ProfileSummaryGrid } from "./_components/ProfileSummaryGrid";
import { JourneyProgressCard } from "./_components/JourneyProgressCard";
import { UpcomingScheduleCard } from "./_components/UpcomingScheduleCard";
import { RemindersCard } from "./_components/RemindersCard";
import { ContinuePreviousActivityCard } from "./_components/ContinuePreviousActivityCard";
import { QuickActionsRow } from "./_components/QuickActionsRow";
import { EnvironmentInfoRow } from "./_components/EnvironmentInfoRow";
import { PostLoginChoices } from "./_components/PostLoginChoices";

/**
 * Screen 03 — Personalized Home Dashboard.
 *
 * This is an Authenticated-Pilgrim-Mode-only screen — per the finalized
 * UX, viewing a personalized dashboard IS "attempting to access a
 * personalized feature," so redirecting an unauthenticated visitor to
 * /identify here is correct and intentional (unlike Navigation/
 * Healthcare, which are public and must never redirect).
 *
 * The Top Bar, Sidebar, and Bottom Bar are all supplied by the global
 * AppShell (this page renders none of them). The pilgrim shown here is
 * read directly from `SessionContext` — the same session Phase 5's
 * identification flow populated via `setPilgrim()` — there is no
 * separate/duplicate user state anywhere on this screen, and nothing on
 * this page renders before the redirect for a guest (no mock/demo data
 * is ever shown to an unauthenticated visitor).
 */
export default function DashboardPage() {
  const { pilgrim, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !pilgrim) {
      router.replace("/identify");
    }
  }, [isLoading, pilgrim, router]);

  if (isLoading || !pilgrim) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-brand-700" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="flex min-h-[calc(100dvh-7rem)] flex-col gap-6">
        <WelcomeHero pilgrim={pilgrim} />
        <PostLoginChoices />
      </section>
      <ProfileSummaryGrid pilgrim={pilgrim} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-6">
          <JourneyProgressCard />
          <UpcomingScheduleCard />
        </div>

        <div className="flex flex-col gap-6">
          <ContinuePreviousActivityCard />
          <RemindersCard />
          <QuickActionsRow pilgrim={pilgrim} />
          <EnvironmentInfoRow />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CrowdLevel, DestinationType, RouteRecommendation } from "@/types/navigation";

const AUTO_REFRESH_MS = 30_000;
/** Only Tawaf and Sa'i have a multi-level crowd comparison table in the
 *  mock data; the other 3 destinations go straight to a route summary. */
const DESTINATIONS_WITH_LEVELS: DestinationType[] = ["TAWAF", "SAI"];

interface UseNavigationDataResult {
  crowdLevels: CrowdLevel[];
  route: RouteRecommendation | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  selectedLevelId: string | null;
  selectLevel: (levelId: string) => void;
  refresh: () => Promise<void>;
}

export function useNavigationData(destination: DestinationType): UseNavigationDataResult {
  const [crowdLevels, setCrowdLevels] = useState<CrowdLevel[]>([]);
  const [route, setRoute] = useState<RouteRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (levelId: string | null, isBackgroundRefresh: boolean) => {
      if (isBackgroundRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const hasLevels = DESTINATIONS_WITH_LEVELS.includes(destination);

        const [crowdRes, routeRes] = await Promise.all([
          hasLevels
            ? fetch(`/api/crowd?destination=${destination}`, { cache: "no-store" })
            : Promise.resolve(null),
          fetch("/api/navigation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, levelId: levelId ?? undefined }),
          }),
        ]);

        if (crowdRes) {
          const crowdData = await crowdRes.json();
          setCrowdLevels(crowdData.levels ?? []);
        } else {
          setCrowdLevels([]);
        }

        if (routeRes.ok) {
          const routeData = await routeRes.json();
          setRoute(routeData.route ?? null);
        }

        setLastUpdated(new Date());
      } catch {
        // Non-fatal — the panels simply keep showing their last-known data.
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [destination]
  );

  // Reset and reload whenever the destination changes.
  useEffect(() => {
    setSelectedLevelId(null);
    load(null, false);
  }, [destination, load]);

  // 30-second background auto-refresh, matching the documented behavior.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      load(selectedLevelId, true);
    }, AUTO_REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [destination, selectedLevelId, load]);

  const selectLevel = useCallback(
    (levelId: string) => {
      setSelectedLevelId(levelId);
      load(levelId, true);
    },
    [load]
  );

  const refresh = useCallback(() => load(selectedLevelId, true), [load, selectedLevelId]);

  return { crowdLevels, route, isLoading, isRefreshing, lastUpdated, selectedLevelId, selectLevel, refresh };
}

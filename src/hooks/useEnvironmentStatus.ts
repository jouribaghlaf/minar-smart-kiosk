"use client";

import { useEffect, useState } from "react";
import type { EnvironmentStatus } from "@/types/general";

interface UseEnvironmentStatusResult {
  status: EnvironmentStatus | null;
  isLoading: boolean;
}

/**
 * Fetches /api/environment once on mount. Extracted as a shared hook so
 * every screen that needs weather/AQI/overall-crowd data (Welcome
 * Gateway, Dashboard, and later Navigation) calls the same logic instead
 * of re-implementing the fetch effect per screen.
 */
export function useEnvironmentStatus(): UseEnvironmentStatusResult {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch("/api/environment", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setStatus(data?.status ?? null);
      })
      .catch(() => {
        /* Non-fatal — consumers just keep their loading/empty state. */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, isLoading };
}

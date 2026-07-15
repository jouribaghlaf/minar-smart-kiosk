"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Pilgrim } from "@/types";

export type SessionMode = "inactive" | "guest" | "authenticated";

interface SessionContextValue {
  pilgrim: Pilgrim | null;
  mode: SessionMode;
  hasActiveSession: boolean;
  isLoading: boolean;
  setPilgrim: (pilgrim: Pilgrim | null) => void;
  startGuestSession: () => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);
const MODE_KEY = "minar_session_mode";

function clearTemporaryData() {
  Object.keys(window.sessionStorage).forEach((key) => {
    if (key.startsWith("minar_")) window.sessionStorage.removeItem(key);
  });
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [pilgrim, setPilgrimState] = useState<Pilgrim | null>(null);
  const [mode, setMode] = useState<SessionMode>("inactive");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const storedMode = window.sessionStorage.getItem(MODE_KEY) as SessionMode | null;
    if (storedMode === "guest") { setMode("guest"); setIsLoading(false); return; }
    try {
      const response = await fetch("/api/session", { cache: "no-store" });
      const data = response.ok ? await response.json() : null;
      if (data?.pilgrim) { setPilgrimState(data.pilgrim); setMode("authenticated"); window.sessionStorage.setItem(MODE_KEY, "authenticated"); }
      else { setPilgrimState(null); setMode("inactive"); }
    } catch { setPilgrimState(null); setMode("inactive"); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const setPilgrim = useCallback((next: Pilgrim | null) => {
    setPilgrimState(next);
    const nextMode: SessionMode = next ? "authenticated" : "inactive";
    setMode(nextMode);
    if (next) window.sessionStorage.setItem(MODE_KEY, nextMode);
  }, []);

  const startGuestSession = useCallback(() => {
    setPilgrimState(null);
    setMode("guest");
    window.sessionStorage.setItem(MODE_KEY, "guest");
  }, []);

  const logout = useCallback(async () => {
    try { await fetch("/api/session", { method: "DELETE" }); } catch { /* local cleanup still applies */ }
    setPilgrimState(null);
    setMode("inactive");
    clearTemporaryData();
  }, []);

  const value = useMemo(() => ({ pilgrim, mode, hasActiveSession: mode !== "inactive", isLoading, setPilgrim, startGuestSession, refresh, logout }), [pilgrim, mode, isLoading, setPilgrim, startGuestSession, refresh, logout]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

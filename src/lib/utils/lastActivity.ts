export interface LastActivity {
  labelAr: string;
  labelEn: string;
  href: string;
  timestamp: string;
}

const STORAGE_KEY = "minar_last_activity";

/**
 * Deliberately a plain localStorage utility rather than a context:
 * `setLastActivity` is called imperatively from click handlers on
 * whichever screen the pilgrim is leaving (e.g. Dashboard's smart
 * recommendation cards today; Navigation/Healthcare will call it too once
 * built), and `getLastActivity` is read once by the Dashboard on mount.
 * No live cross-tab sync is needed for this use case.
 */
export function setLastActivity(activity: Omit<LastActivity, "timestamp">): void {
  if (typeof window === "undefined") return;
  try {
    const record: LastActivity = { ...activity, timestamp: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage can fail (quota, private mode) — losing "continue where you
    // left off" is not worth surfacing an error for.
  }
}

export function getLastActivity(): LastActivity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastActivity) : null;
  } catch {
    return null;
  }
}

export function clearLastActivity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

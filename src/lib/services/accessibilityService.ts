import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import { DEFAULT_ACCESSIBILITY_SETTINGS, type AccessibilitySettings } from "@/types/accessibility";

/**
 * Server-side accessibility profile, keyed by an anonymous kiosk-session
 * cookie (separate from the pilgrim identity session — accessibility
 * settings should work from Screen 01, before anyone identifies).
 *
 * NOTE: `AccessibilityContext` on the client currently persists settings
 * to localStorage, which is sufficient for a single kiosk session. This
 * service exists so that, when desired, the Accessibility Drawer phase
 * can additionally sync to the server — e.g. to restore a pilgrim's
 * preferred settings automatically the next time their Nusuk card is
 * scanned at any kiosk. Wiring that sync is a UI-phase decision, not an
 * architectural one, which is why the route/service are ready now.
 *
 * SWAP POINT: replace with `prisma.accessibilityProfile.upsert(...)`.
 */
export async function getAccessibilityProfile(kioskSessionId: string): Promise<AccessibilitySettings> {
  await simulateLatency(80, 200);
  const record = mockStore.accessibilityProfiles.find((p) => p.kioskSessionId === kioskSessionId);
  return record ? record.settings : DEFAULT_ACCESSIBILITY_SETTINGS;
}

export async function saveAccessibilityProfile(
  kioskSessionId: string,
  settings: AccessibilitySettings
): Promise<AccessibilitySettings> {
  await simulateLatency(80, 200);
  const existing = mockStore.accessibilityProfiles.find((p) => p.kioskSessionId === kioskSessionId);
  const updatedAt = new Date().toISOString();

  if (existing) {
    existing.settings = settings;
    existing.updatedAt = updatedAt;
  } else {
    mockStore.accessibilityProfiles.push({ kioskSessionId, settings, updatedAt });
  }

  return settings;
}

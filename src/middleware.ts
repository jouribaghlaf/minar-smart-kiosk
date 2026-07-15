import { NextResponse } from "next/server";

/**
 * Currently a pass-through, and deliberately so.
 *
 * Minar has two operating modes: Guest Mode (default, no identification)
 * and Authenticated Pilgrim Mode (unlocked only after Smart
 * Identification succeeds). Public screens — Smart Navigation, Healthcare
 * Services, AI Assistant, Reports, Religious Guide, Haram Information —
 * live under the same (kiosk) route group as the Personalized Dashboard,
 * but must NOT be gated by session. Do not add a blanket "redirect to
 * /identify if no session cookie" rule here for (kiosk) routes — that
 * would re-introduce forced authentication for public services, which is
 * explicitly disallowed. Gating, where it belongs (e.g. Dashboard), is
 * handled per-page via `useSession()` + a client-side redirect, not here.
 *
 * Reserved for genuinely route-agnostic future use instead, e.g. kiosk
 * idle-timeout handling (auto-return to Welcome after N minutes of
 * inactivity).
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

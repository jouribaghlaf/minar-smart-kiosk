import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import type { NextResponse } from "next/server";

const KIOSK_SESSION_COOKIE = "minar_kiosk_session";
const KIOSK_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours — a long kiosk shift

/**
 * Anonymous, non-identity cookie distinguishing one kiosk "visit" from
 * another so accessibility settings (or other pre-identification
 * preferences) can optionally be persisted server-side. Completely
 * separate from the pilgrim auth session issued by /api/identify.
 *
 * Returns the existing id if present, or mints and sets a new one.
 */
export async function getOrCreateKioskSessionId(): Promise<{
  id: string;
  isNew: boolean;
}> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(KIOSK_SESSION_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: `kiosk_${nanoid(12)}`, isNew: true };
}

export function setKioskSessionCookie(response: NextResponse, id: string) {
  response.cookies.set(KIOSK_SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: KIOSK_SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

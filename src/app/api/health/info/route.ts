import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPilgrimBySessionToken } from "@/lib/services/sessionService";
import { getHealthInfoForPilgrim } from "@/lib/services/healthService";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";

/**
 * GET /api/health/info -> { info: HealthInfo | null }
 *
 * Resolves the pilgrim from the session cookie (same pattern as
 * /api/session) rather than accepting a pilgrimId in the query string, so
 * one pilgrim's kiosk session can never read another's medical data.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  const pilgrim = await getPilgrimBySessionToken(token);
  if (!pilgrim) {
    return NextResponse.json({ error: "غير مصرح. يرجى تسجيل الدخول أولاً." }, { status: 401 });
  }

  const info = await getHealthInfoForPilgrim(pilgrim.id);
  return NextResponse.json({ info });
}

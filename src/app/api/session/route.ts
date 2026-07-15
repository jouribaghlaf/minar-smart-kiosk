import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPilgrimBySessionToken, destroySession } from "@/lib/services/sessionService";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";

/**
 * GET  /api/session -> { pilgrim: Pilgrim | null }
 * DELETE /api/session -> clears the session (used by "sign out" / kiosk
 *   idle-reset flows).
 *
 * Every screen that needs "am I identified right now?" goes through this
 * route via SessionContext rather than reading cookies directly, keeping
 * the client -> API route -> service -> data layer boundary intact
 * (mock store today, Prisma/Postgres later — see sessionService.ts).
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  try {
    const pilgrim = await getPilgrimBySessionToken(token);
    return NextResponse.json({ pilgrim });
  } catch (error) {
    console.error("[/api/session] GET failed", error);
    return NextResponse.json({ pilgrim: null }, { status: 200 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  try {
    await destroySession(token);
  } catch (error) {
    console.error("[/api/session] DELETE failed", error);
  }

  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

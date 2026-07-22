import { NextResponse } from "next/server";
import { z } from "zod";
import { identifyPilgrim } from "@/lib/services/pilgrimService";
import { createSession } from "@/lib/services/sessionService";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";
const SESSION_TTL_MINUTES = Number(process.env.SESSION_TTL_MINUTES ?? 120);

const bodySchema = z.object({
  method: z.enum(["QR_CODE", "PASSPORT", "VISA"]),
  value: z.string().optional(),
});

/**
 * POST /api/identify
 * Body: { method: IdentificationMethod, value?: string }
 * -> IdentificationResult
 *
 * Screen 02 (Smart Identification) calls this for every supported method —
 * Face Recognition needs no `value` (camera capture is simulated), the
 * other four match against mock credentials. On success, a kiosk session
 * cookie is issued so subsequent screens resolve the pilgrim via
 * GET /api/session without re-sending credentials.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errorMessage: "طلب غير صالح." },
      { status: 400 }
    );
  }

  const { method, value } = parsed.data;
  const result = await identifyPilgrim(method, value);

  if (!result.success || !result.pilgrim) {
    return NextResponse.json(result, { status: 200 });
  }

  const session = await createSession(result.pilgrim.id, method);

  const res = NextResponse.json({ ...result, sessionToken: session.id });
  res.cookies.set(COOKIE_NAME, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MINUTES * 60,
    path: "/",
  });
  return res;
}

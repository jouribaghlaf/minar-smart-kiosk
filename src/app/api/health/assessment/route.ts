import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getPilgrimBySessionToken } from "@/lib/services/sessionService";
import { assessSymptoms } from "@/lib/services/healthService";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";

const bodySchema = z.object({
  symptomsText: z.string().min(1),
  language: z.enum(["AR", "EN"]).default("AR"),
});

/**
 * POST /api/health/assessment
 * Body: { symptomsText: string, language: "AR" | "EN" }
 * -> SymptomAssessmentResult
 *
 * Works whether or not the pilgrim is identified (Healthcare Services is
 * reachable in a general/unauthenticated flow too per the Welcome screen's
 * service grid) — pilgrimId is attached when a session exists, purely for
 * potential future logging, and is never required.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const pilgrim = await getPilgrimBySessionToken(token);

  const result = await assessSymptoms({
    pilgrimId: pilgrim?.id,
    symptomsText: parsed.data.symptomsText,
    language: parsed.data.language,
  });

  return NextResponse.json({ result });
}

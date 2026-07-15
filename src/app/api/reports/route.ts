import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getPilgrimBySessionToken } from "@/lib/services/sessionService";
import { submitReport, getReportsForPilgrim } from "@/lib/services/reportService";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";

const bodySchema = z.object({
  type: z.enum(["LOST_PILGRIM", "LOST_ITEM", "MEDICAL_EMERGENCY", "FIELD_ASSISTANCE", "SECURITY"]),
  notes: z.string().optional(),
});

/**
 * POST /api/reports
 * Body: { type: ReportType, notes?: string } -> { report: Report }
 *
 * Reports can be filed without identification (Screen 01's "البلاغات
 * وطلب المساعدة" is a general-access service), so a missing/invalid
 * session simply results in an anonymous report rather than a 401.
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

  const report = await submitReport(parsed.data.type, parsed.data.notes, pilgrim?.id ?? null);
  return NextResponse.json({ report }, { status: 201 });
}

/**
 * GET /api/reports -> { reports: Report[] }
 *
 * Returns the current pilgrim's own report history (per "إمكانية متابعة
 * حالة البلاغ"). Requires an active session — an anonymous visitor has no
 * report history to look up.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const pilgrim = await getPilgrimBySessionToken(token);

  if (!pilgrim) {
    return NextResponse.json({ reports: [] });
  }

  const reports = await getReportsForPilgrim(pilgrim.id);
  return NextResponse.json({ reports });
}

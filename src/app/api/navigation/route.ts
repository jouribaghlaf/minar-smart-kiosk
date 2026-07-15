import { NextResponse } from "next/server";
import { z } from "zod";
import { getRouteRecommendation } from "@/lib/services/navigationService";

const bodySchema = z.object({
  destination: z.enum(["TAWAF", "SAI", "CAMP", "RESTROOM", "HEALTH_CENTER"]),
  levelId: z.string().optional(),
});

/**
 * POST /api/navigation
 * Body: { destination: DestinationType, levelId?: string }
 * -> RouteRecommendation
 *
 * Powers Screen 04's "AI Route Recommendation" step: choosing a
 * destination (and optionally a specific level, if the pilgrim overrides
 * the AI's suggestion in the comparison table) returns the recommended
 * level, distance/ETA, turn-by-turn steps, and a QR payload to send the
 * route to the pilgrim's phone.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const route = await getRouteRecommendation(parsed.data.destination, parsed.data.levelId);

  if (!route) {
    return NextResponse.json({ error: "تعذر إيجاد مسار لهذه الوجهة." }, { status: 404 });
  }

  return NextResponse.json({ route });
}

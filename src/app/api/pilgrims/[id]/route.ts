import { NextResponse } from "next/server";
import { getPilgrimById } from "@/lib/services/pilgrimService";

/**
 * GET /api/pilgrims/:id -> Pilgrim | 404
 *
 * Used for direct profile lookups (e.g. a future supervisor/ops view).
 * The Dashboard/Navigation/Healthcare screens themselves resolve "the
 * current pilgrim" via /api/session rather than this route, since the
 * kiosk never knows a pilgrim's ID ahead of identification.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pilgrim = await getPilgrimById(id);

  if (!pilgrim) {
    return NextResponse.json({ error: "Pilgrim not found" }, { status: 404 });
  }

  return NextResponse.json({ pilgrim });
}

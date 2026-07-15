import { NextResponse } from "next/server";
import { getCrowdLevels } from "@/lib/services/crowdService";
import type { DestinationType } from "@/types/navigation";

const VALID_DESTINATIONS: DestinationType[] = ["TAWAF", "SAI", "CAMP", "RESTROOM", "HEALTH_CENTER"];

/**
 * GET /api/crowd?destination=TAWAF -> CrowdLevel[]
 * GET /api/crowd -> CrowdLevel[] (all destinations)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destinationParam = searchParams.get("destination");

  const destination =
    destinationParam && VALID_DESTINATIONS.includes(destinationParam as DestinationType)
      ? (destinationParam as DestinationType)
      : undefined;

  const levels = await getCrowdLevels(destination);
  return NextResponse.json({ levels });
}

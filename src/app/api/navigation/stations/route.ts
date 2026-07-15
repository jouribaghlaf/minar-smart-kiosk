import { NextResponse } from "next/server";
import { getNearbyHealthCenters, getNearbyTrainStations } from "@/lib/services/navigationService";

/**
 * GET /api/navigation/stations -> { healthCenters: HealthCenter[], trainStations: TrainStation[] }
 *
 * Backs the Dashboard's "أقرب مركز صحي" / "أقرب محطة قطار" live-information
 * cards (Screen 03) without pulling in the full route-recommendation flow.
 */
export async function GET() {
  const [healthCenters, trainStations] = await Promise.all([
    getNearbyHealthCenters(),
    getNearbyTrainStations(),
  ]);

  return NextResponse.json({ healthCenters, trainStations });
}

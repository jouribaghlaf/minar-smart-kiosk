import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import { getCrowdLevels } from "@/lib/services/crowdService";
import type { RouteRecommendation, DestinationType, HealthCenter, TrainStation } from "@/types/navigation";

const DESTINATION_LABELS: Record<DestinationType, string> = {
  TAWAF: "الطواف",
  SAI: "السعي",
  CAMP: "المخيم",
  RESTROOM: "أقرب دورة مياه",
  HEALTH_CENTER: "أقرب مركز صحي",
};

/**
 * Builds a full route recommendation for a chosen destination: best level
 * (from crowdService), a short list of mock turn-by-turn steps, an ETA/
 * distance summary, and a QR payload the pilgrim can scan to continue
 * navigation on their own phone (per "إرسال المسار إلى الهاتف عبر رمز QR").
 *
 * SWAP POINT: replace the mock step generation with a real routing engine
 * call (Google Directions / Mapbox Directions) once NEXT_PUBLIC_MAPS_PROVIDER
 * is set to something other than "mock" — see components/map/MapView.tsx.
 */
export async function getRouteRecommendation(
  destination: DestinationType,
  levelId?: string
): Promise<RouteRecommendation | null> {
  await simulateLatency(400, 900);

  const levels = await getCrowdLevels(
    destination === "TAWAF" || destination === "SAI" ? destination : undefined
  );

  const recommendedLevel =
    (levelId ? levels.find((l) => l.id === levelId) : null) ??
    levels.find((l) => l.isRecommended) ??
    levels[0] ??
    null;

  if (!recommendedLevel && (destination === "TAWAF" || destination === "SAI")) {
    return null;
  }

  const label = DESTINATION_LABELS[destination];

  const steps = recommendedLevel
    ? [
        { instruction: `توجه نحو ${recommendedLevel.recommendedGate ?? "البوابة الرئيسية"}`, distanceMeters: 210 },
        { instruction: "استمر على طريق الملك عبدالله", distanceMeters: 320 },
        { instruction: `ادخل من ${recommendedLevel.recommendedGate ?? "البوابة الرئيسية"}`, distanceMeters: 90 },
        { instruction: `الوجهة: ${label} - ${recommendedLevel.levelName}`, distanceMeters: 0 },
      ]
    : [
        { instruction: `توجه نحو ${label}`, distanceMeters: 450 },
        { instruction: `الوجهة: ${label}`, distanceMeters: 0 },
      ];

  const totalDistanceMeters = steps.reduce((sum, s) => sum + s.distanceMeters, 0);
  const etaMinutes = recommendedLevel?.waitMinutes ?? Math.max(3, Math.round(totalDistanceMeters / 70));

  return {
    destination,
    recommendedLevel: recommendedLevel ?? {
      id: "n-a",
      destination,
      levelName: label,
      levelOrder: 0,
      crowdLabel: "GOOD",
      waitMinutes: etaMinutes,
      isRecommended: true,
      recommendedGate: null,
      updatedAt: new Date().toISOString(),
    },
    totalDistanceMeters,
    etaMinutes,
    steps,
    qrPayload: `MINAR-ROUTE:${destination}:${recommendedLevel?.id ?? "default"}:${Date.now()}`,
  };
}

export async function getNearbyHealthCenters(): Promise<HealthCenter[]> {
  await simulateLatency(150, 350);
  return [...mockStore.healthCenters].sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export async function getNearbyTrainStations(): Promise<TrainStation[]> {
  await simulateLatency(150, 350);
  return [...mockStore.trainStations].sort((a, b) => a.distanceMeters - b.distanceMeters);
}

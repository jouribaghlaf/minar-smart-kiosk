import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type { CrowdLevel, DestinationType } from "@/types/navigation";

function toDTO(record: (typeof mockStore.crowdLevels)[number]): CrowdLevel {
  return { ...record };
}

/**
 * Returns crowd levels, optionally filtered by destination, ordered the
 * way the approved UI expects (levelOrder ascending — e.g. صحن المطاف,
 * الدور الأرضي, الدور الأول, الدور الثاني for Tawaf).
 *
 * SWAP POINT: replace with `prisma.crowdLevel.findMany({ where: { destination }, orderBy: { levelOrder: "asc" } })`.
 * In a real deployment this would also likely be re-fetched on an interval
 * or via a live subscription rather than per-request, to match "تحديث
 * البيانات بشكل لحظي" (real-time updates) from the documentation.
 */
export async function getCrowdLevels(destination?: DestinationType): Promise<CrowdLevel[]> {
  await simulateLatency(150, 400);

  const filtered = destination
    ? mockStore.crowdLevels.filter((c) => c.destination === destination)
    : mockStore.crowdLevels;

  return [...filtered].sort((a, b) => a.levelOrder - b.levelOrder).map(toDTO);
}

/** Convenience helper used by the AI recommendation logic and navigationService. */
export async function getRecommendedLevel(destination: DestinationType): Promise<CrowdLevel | null> {
  const levels = await getCrowdLevels(destination);
  return levels.find((l) => l.isRecommended) ?? levels[0] ?? null;
}

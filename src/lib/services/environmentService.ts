import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type { EnvironmentStatus } from "@/types/general";

export async function getEnvironmentStatus(): Promise<EnvironmentStatus> {
  await simulateLatency(100, 300);
  return { ...mockStore.environmentStatus };
}

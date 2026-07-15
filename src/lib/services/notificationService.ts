import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type { Notification } from "@/types/general";

export async function getNotifications(): Promise<Notification[]> {
  await simulateLatency(100, 300);
  return [...mockStore.notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markNotificationRead(id: string): Promise<Notification | null> {
  await simulateLatency(80, 200);
  const record = mockStore.notifications.find((n) => n.id === id);
  if (!record) return null;
  record.isRead = true;
  return record;
}

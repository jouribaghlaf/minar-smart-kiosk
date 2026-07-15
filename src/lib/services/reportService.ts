import { mockStore, generateId } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type { Report, ReportType } from "@/types/general";

function toDTO(record: (typeof mockStore.reports)[number]): Report {
  return {
    id: record.id,
    type: record.type,
    status: record.status,
    notes: record.notes,
    createdAt: record.createdAt,
  };
}

/**
 * Submits an immediate field report, as documented in Minar2.pdf's
 * "البلاغات الذكية" section (lost pilgrim, lost item, medical emergency,
 * field assistance, security). Backs the "البلاغات وطلب المساعدة" service
 * card on Screen 01 and the AI Assistant's report-a-problem flow.
 *
 * SWAP POINT: replace with `prisma.report.create(...)`, and in production
 * this would also fan out a notification to the relevant campaign
 * supervisor / operations dashboard — see the "لوحة التحكم للجهات
 * المختصة" section of the Minar overview document.
 */
export async function submitReport(
  type: ReportType,
  notes: string | undefined,
  pilgrimId: string | null
): Promise<Report> {
  await simulateLatency(300, 700);

  const now = new Date().toISOString();
  const record = {
    id: generateId("rpt"),
    pilgrimId,
    type,
    status: "SUBMITTED" as const,
    notes: notes ?? null,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.reports.push(record);
  return toDTO(record);
}

export async function getReportsForPilgrim(pilgrimId: string): Promise<Report[]> {
  await simulateLatency(120, 300);
  return mockStore.reports
    .filter((r) => r.pilgrimId === pilgrimId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(toDTO);
}

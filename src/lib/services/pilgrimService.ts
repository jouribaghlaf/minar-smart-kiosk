import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type {
  IdentificationMethod,
  IdentificationResult,
  Pilgrim,
} from "@/types/pilgrim";
import type { PilgrimRecord } from "@/lib/mock-data/store";

/**
 * Maps an internal mock record (or, later, a Prisma row with the same
 * shape of relations) into the client-facing Pilgrim DTO. Kept as a named
 * export so sessionService and the identify route share one mapping
 * implementation.
 */
export function toPilgrimDTO(record: PilgrimRecord): Pilgrim {
  const campaign = mockStore.campaigns.find((c) => c.id === record.campaignId);
  const camp = mockStore.camps.find((c) => c.id === record.campId);
  if (!campaign || !camp) {
    throw new Error(`Pilgrim ${record.id} references a missing campaign/camp`);
  }
  const supervisor = mockStore.supervisors.find((s) => s.id === campaign.supervisorId);
  if (!supervisor) {
    throw new Error(`Campaign ${campaign.id} references a missing supervisor`);
  }

  return {
    id: record.id,
    name: record.name,
    nationality: record.nationality,
    nationalityFlag: record.nationalityFlag,
    systemLanguage: record.systemLanguage,
    pilgrimNumber: record.pilgrimNumber,
    arrivalDateHijri: record.arrivalDateHijri,
    arrivalDateGregorian: record.arrivalDateGregorian,
    avatarUrl: record.avatarUrl,
    lastVerificationMethod: record.lastVerificationMethod,
    campaign: {
      id: campaign.id,
      name: campaign.name,
      campaignNumber: campaign.campaignNumber,
      supervisor: { id: supervisor.id, name: supervisor.name, phone: supervisor.phone },
    },
    camp: { id: camp.id, number: camp.number, location: camp.location },
  };
}

export async function getPilgrimById(id: string): Promise<Pilgrim | null> {
  await simulateLatency(150, 400);
  const record = mockStore.pilgrims.find((p) => p.id === id);
  return record ? toPilgrimDTO(record) : null;
}

/**
 * Resolves one of the 5 documented identification methods
 * (Face Recognition, Nusuk Card, QR Code, Passport, National ID) against
 * mock pilgrim credentials.
 *
 * SWAP POINT: in production this function is replaced with real calls —
 * Face Recognition -> a computer-vision matching service, Nusuk
 * Card/QR/Passport/National ID -> the relevant government verification
 * API. The return shape (IdentificationResult) stays the same, so Screen
 * 02 never needs to change regardless of which method is wired to a real
 * backend first.
 */
export async function identifyPilgrim(
  method: IdentificationMethod,
  value?: string
): Promise<IdentificationResult> {
  // Face recognition has a longer, more visible simulated latency to match
  // the documented "جاري التعرف على الوجه..." progressive UI.
  await simulateLatency(method === "FACE_RECOGNITION" ? 1200 : 500, method === "FACE_RECOGNITION" ? 2000 : 900);

  if (method === "FACE_RECOGNITION") {
    // No live camera/CV model in this environment — simulates a successful
    // match against the primary demo pilgrim, mirroring the approved
    // Screen 02 preview (محمد أحمد).
    const record = mockStore.pilgrims[0];
    return { success: true, method, pilgrim: toPilgrimDTO(record!) };
  }

  if (!value || !value.trim()) {
    return {
      success: false,
      method,
      errorMessage: "لم يتم إدخال بيانات كافية للتحقق من الهوية.",
    };
  }

  const normalized = value.trim();
  const record = mockStore.pilgrims.find((p) => {
    switch (method) {
      case "NUSUK_CARD":
        return p.credentials.nusukCardNumber === normalized;
      case "QR_CODE":
        return p.credentials.qrCode === normalized;
      case "PASSPORT":
        return p.credentials.passportNumber === normalized;
      case "NATIONAL_ID":
        return p.credentials.nationalId === normalized;
      default:
        return false;
    }
  });

  if (!record) {
    return {
      success: false,
      method,
      errorMessage: "تعذر التحقق من الهوية. يرجى المحاولة مرة أخرى أو اختيار وسيلة تحقق بديلة.",
    };
  }

  return { success: true, method, pilgrim: toPilgrimDTO(record) };
}

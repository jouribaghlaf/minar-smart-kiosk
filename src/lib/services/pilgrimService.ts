import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type { IdentificationMethod, IdentificationResult, Pilgrim } from "@/types/pilgrim";
import type { PilgrimRecord } from "@/lib/mock-data/store";

export function toPilgrimDTO(record: PilgrimRecord): Pilgrim {
  const campaign = mockStore.campaigns.find((item) => item.id === record.campaignId);
  const camp = mockStore.camps.find((item) => item.id === record.campId);
  if (!campaign || !camp) throw new Error(`Pilgrim ${record.id} references a missing campaign/camp`);
  const supervisor = mockStore.supervisors.find((item) => item.id === campaign.supervisorId);
  if (!supervisor) throw new Error(`Campaign ${campaign.id} references a missing supervisor`);

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
    program: record.id === "pilgrim_1" ? "برنامج العمرة المتكامل" : "برنامج ضيوف الرحمن",
    serviceProvider: record.id === "pilgrim_1" ? "شركة إثراء الضيافة" : "شركة مناسك الرحلة",
    hotel: {
      name: record.id === "pilgrim_1" ? "جبل عمر حياة ريجنسي" : "فندق أنجم مكة",
      rating: 5,
      location: "مكة المكرمة — المنطقة المركزية",
      nearPublicServices: true,
    },
    arafatTransport: "حافلة ترددية مكيفة — المسار A3",
    campaign: {
      id: campaign.id,
      name: campaign.name,
      campaignNumber: campaign.campaignNumber,
      supervisor: { id: supervisor.id, name: supervisor.name, phone: supervisor.phone },
    },
    camp: { id: camp.id, number: camp.number, location: camp.location, category: record.id === "pilgrim_1" ? "A" : "B" },
  };
}

export async function getPilgrimById(id: string): Promise<Pilgrim | null> {
  await simulateLatency(150, 400);
  const record = mockStore.pilgrims.find((item) => item.id === id);
  return record ? toPilgrimDTO(record) : null;
}

/**
 * Demo verification for the two approved kiosk sign-in methods.
 * Replace this mock lookup with the authorized passport and Nusuk-card
 * verification APIs while keeping the same result shape.
 */
export async function identifyPilgrim(method: IdentificationMethod, value?: string): Promise<IdentificationResult> {
  await simulateLatency(500, 900);

  if (!value?.trim()) {
    return { success: false, method, errorMessage: "لم يتم إدخال بيانات كافية للتحقق من الهوية." };
  }

  const normalized = value.trim();
  const record = mockStore.pilgrims.find((pilgrim) => {
    if (method === "QR_CODE") return pilgrim.credentials.qrCode === normalized || pilgrim.credentials.nusukCardNumber === normalized;
    if (method === "VISA") return pilgrim.credentials.visaNumber === normalized;
    return pilgrim.credentials.passportNumber === normalized;
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

import { mockStore } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import type {
  HealthInfo,
  EmergencyContact,
  HealthTip,
  SymptomAssessmentRequest,
  SymptomAssessmentResult,
  RecommendedCareLevel,
} from "@/types/health";
import type { HealthCenter } from "@/types/navigation";

export async function getHealthCenters(): Promise<HealthCenter[]> {
  await simulateLatency(150, 400);
  return [...mockStore.healthCenters].sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export async function getHealthInfoForPilgrim(pilgrimId: string): Promise<HealthInfo | null> {
  await simulateLatency(120, 300);
  const record = mockStore.healthInfo.find((h) => h.pilgrimId === pilgrimId);
  if (!record) return null;
  return {
    bloodType: record.bloodType,
    allergies: record.allergies,
    chronicDiseases: record.chronicDiseases,
    currentMedications: record.currentMedications,
    emergencyContact: record.emergencyContact,
  };
}

export async function getHealthTips(): Promise<HealthTip[]> {
  await simulateLatency(100, 250);
  return [...mockStore.healthTips].sort((a, b) => a.order - b.order);
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  await simulateLatency(100, 250);
  return [...mockStore.emergencyContacts]
    .sort((a, b) => a.order - b.order)
    .map(({ id, label, number }) => ({ id, label, number }));
}

// --- AI Health Assessment ----------------------------------------------------

const EMERGENCY_KEYWORDS = [
  "صدر", "chest", "تنفس", "breath", "وعي", "conscious", "نزيف حاد", "severe bleeding", "سكتة", "stroke",
];
const URGENT_KEYWORDS = [
  "حرارة عالية", "high fever", "قيء مستمر", "vomiting", "كسر", "fracture", "إغماء", "faint",
];
const CLINIC_KEYWORDS = [
  "صداع", "headache", "حرارة", "fever", "سعال", "cough", "إسهال", "diarrhea", "دوخة", "dizzy",
];

/**
 * Rule-based symptom triage, standing in for a real clinical AI model.
 * Deliberately conservative: anything resembling a red-flag symptom
 * routes to EMERGENCY rather than trying to be clever, matching the
 * documentation's emphasis on pilgrim safety.
 *
 * SWAP POINT: replace the keyword matching below with a call to
 * lib/services/aiService.ts's OpenAI-backed completion once
 * OPENAI_API_KEY is configured — keep the same request/response shape.
 */
export async function assessSymptoms(
  request: SymptomAssessmentRequest
): Promise<SymptomAssessmentResult> {
  await simulateLatency(700, 1400);

  const text = request.symptomsText.toLowerCase();
  const isAr = request.language === "AR";

  let level: RecommendedCareLevel = "SELF_CARE";
  if (EMERGENCY_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) {
    level = "EMERGENCY";
  } else if (URGENT_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) {
    level = "URGENT_CARE";
  } else if (CLINIC_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) {
    level = "CLINIC_VISIT";
  }

  const summaries: Record<RecommendedCareLevel, string> = {
    EMERGENCY: isAr
      ? "تشير الأعراض التي وصفتها إلى حالة قد تستدعي تدخلاً طبياً عاجلاً. يرجى طلب إسعاف فوراً أو التوجه لأقرب نقطة إسعاف."
      : "The symptoms you described may require urgent medical attention. Please request an ambulance immediately or head to the nearest first-aid point.",
    URGENT_CARE: isAr
      ? "يُنصح بزيارة مركز الرعاية العاجلة في أقرب وقت ممكن لتقييم حالتك."
      : "We recommend visiting an urgent care center as soon as possible to have this evaluated.",
    CLINIC_VISIT: isAr
      ? "يمكنك زيارة أقرب مركز صحي للاطمئنان والحصول على العلاج المناسب."
      : "You can visit the nearest health center to get checked and receive appropriate treatment.",
    SELF_CARE: isAr
      ? "أعراضك تبدو بسيطة. ننصح بالراحة وشرب الماء بانتظام، ومتابعة حالتك. تواصل معنا مرة أخرى إذا ساءت الأعراض."
      : "Your symptoms appear mild. Rest, stay hydrated, and monitor how you feel. Reach out again if things get worse.",
  };

  const centers = await getHealthCenters();
  const nearest = centers.find((c) => c.isAvailable) ?? centers[0];

  return {
    recommendedCareLevel: level,
    summary: summaries[level],
    suggestedFacility:
      level === "SELF_CARE"
        ? undefined
        : nearest
        ? { name: nearest.name, etaMinutes: nearest.etaMinutes }
        : undefined,
  };
}

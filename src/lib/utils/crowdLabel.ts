import type { CrowdLevelLabel } from "@/types/navigation";

interface CrowdLabelInfo {
  ar: string;
  en: string;
  tone: "good" | "mid" | "bad";
}

const CROWD_LABEL_MAP: Record<CrowdLevelLabel, CrowdLabelInfo> = {
  EXCELLENT: { ar: "ممتاز", en: "Excellent", tone: "good" },
  GOOD: { ar: "جيد", en: "Good", tone: "good" },
  MODERATE: { ar: "متوسط", en: "Moderate", tone: "mid" },
  BUSY: { ar: "مزدحم", en: "Busy", tone: "bad" },
  VERY_BUSY: { ar: "مزدحم جداً", en: "Very Busy", tone: "bad" },
};

export function getCrowdLabelInfo(label: CrowdLevelLabel): CrowdLabelInfo {
  return CROWD_LABEL_MAP[label];
}

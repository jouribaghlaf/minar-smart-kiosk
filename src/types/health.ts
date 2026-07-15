export interface HealthInfo {
  bloodType: string;
  allergies?: string | null;
  chronicDiseases?: string | null;
  currentMedications?: string | null;
  emergencyContact: string;
}

export interface EmergencyContact {
  id: string;
  label: string;
  number: string;
}

export interface HealthTip {
  id: string;
  text: string;
  icon: string;
}

export interface SymptomAssessmentRequest {
  pilgrimId?: string;
  symptomsText: string;
  language: "AR" | "EN";
}

export type RecommendedCareLevel = "SELF_CARE" | "CLINIC_VISIT" | "URGENT_CARE" | "EMERGENCY";

export interface SymptomAssessmentResult {
  recommendedCareLevel: RecommendedCareLevel;
  summary: string;
  suggestedFacility?: {
    name: string;
    etaMinutes: number;
  };
}

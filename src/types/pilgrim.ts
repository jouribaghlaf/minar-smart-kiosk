export type SystemLanguage = "AR" | "EN";

export type IdentificationMethod = "QR_CODE" | "PASSPORT";

export interface Supervisor {
  id: string;
  name: string;
  phone: string;
}

export interface Campaign {
  id: string;
  name: string;
  campaignNumber: string;
  supervisor: Supervisor;
}

export interface Camp {
  id: string;
  number: string;
  location: string;
}

export interface Pilgrim {
  id: string;
  name: string;
  nationality: string;
  nationalityFlag?: string | null;
  systemLanguage: SystemLanguage;
  pilgrimNumber: string;
  arrivalDateHijri: string;
  arrivalDateGregorian: string;
  avatarUrl?: string | null;
  lastVerificationMethod?: IdentificationMethod | null;
  campaign: Campaign;
  camp: Camp;
}

export interface IdentificationResult {
  success: boolean;
  method: IdentificationMethod;
  pilgrim?: Pilgrim;
  sessionToken?: string;
  errorMessage?: string;
}

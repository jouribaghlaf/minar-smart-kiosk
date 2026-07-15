export type SystemLanguage = "AR" | "EN";

export type IdentificationMethod =
  | "FACE_RECOGNITION"
  | "NUSUK_CARD"
  | "QR_CODE"
  | "PASSPORT"
  | "NATIONAL_ID";

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
  arrivalDateGregorian: string; // ISO string over the wire
  avatarUrl?: string | null;
  lastVerificationMethod?: IdentificationMethod | null;
  campaign: Campaign;
  camp: Camp;
}

/** Returned by POST /api/identify on success. */
export interface IdentificationResult {
  success: boolean;
  method: IdentificationMethod;
  pilgrim?: Pilgrim;
  sessionToken?: string;
  errorMessage?: string;
}

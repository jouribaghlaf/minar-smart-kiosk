import { nanoid } from "nanoid";
import type {
  IdentificationMethod,
  SystemLanguage,
} from "@/types/pilgrim";
import type { CrowdLevelLabel, DestinationType } from "@/types/navigation";
import type { ChatSender } from "@/types/chat";
import type { ReportStatus, ReportType } from "@/types/general";
import type { AccessibilitySettings } from "@/types/accessibility";

/**
 * ---------------------------------------------------------------------------
 * MOCK DATA STORE
 * ---------------------------------------------------------------------------
 * This module stands in for PostgreSQL for the current development phase.
 * Every record shape below intentionally mirrors its corresponding model in
 * `prisma/schema.prisma` field-for-field, so that when a real database is
 * connected, `lib/services/*` files are rewritten to call
 * `prisma.<model>.findMany(...)` instead of filtering these arrays — the
 * function signatures each service exports do NOT change, which means
 * nothing in `app/api/**` or any component ever needs to change.
 *
 * State is held on `globalThis` (same pattern as `lib/prisma.ts`) purely so
 * it survives Next.js dev-mode hot reloads; it is still fully in-memory and
 * resets on server restart, which is expected for a mock layer.
 */

// --- Record shapes (mirror Prisma models) -----------------------------------

export interface SupervisorRecord {
  id: string;
  name: string;
  phone: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  campaignNumber: string;
  supervisorId: string;
}

export interface CampRecord {
  id: string;
  number: string;
  location: string;
}

export interface PilgrimCredentials {
  nusukCardNumber: string;
  qrCode: string;
  passportNumber: string;
  visaNumber: string;
  nationalId: string;
}

export interface PilgrimRecord {
  id: string;
  name: string;
  nationality: string;
  nationalityFlag: string | null;
  systemLanguage: SystemLanguage;
  pilgrimNumber: string;
  arrivalDateHijri: string;
  arrivalDateGregorian: string; // ISO date string
  avatarUrl: string | null;
  lastVerificationMethod: IdentificationMethod | null;
  campaignId: string;
  campId: string;
  /** Mock-only: the credentials the identification screen checks against.
   *  A real integration would never store these in plaintext — Screen 02
   *  would call a government verification API instead (see
   *  lib/services/identificationService.ts). */
  credentials: PilgrimCredentials;
}

export interface HealthInfoRecord {
  pilgrimId: string;
  bloodType: string;
  allergies: string | null;
  chronicDiseases: string | null;
  currentMedications: string | null;
  emergencyContact: string;
}

export interface CrowdLevelRecord {
  id: string;
  destination: DestinationType;
  levelName: string;
  levelOrder: number;
  crowdLabel: CrowdLevelLabel;
  waitMinutes: number;
  isRecommended: boolean;
  recommendedGate: string | null;
  updatedAt: string;
}

export interface HealthCenterRecord {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  etaMinutes: number;
  isAvailable: boolean;
}

export interface TrainStationRecord {
  id: string;
  name: string;
  distanceMeters: number;
  etaMinutes: number;
}

export interface EmergencyContactRecord {
  id: string;
  label: string;
  number: string;
  order: number;
}

export interface HealthTipRecord {
  id: string;
  text: string;
  icon: string;
  order: number;
}

export interface SuggestedPromptRecord {
  id: string;
  textAr: string;
  textEn: string;
  icon: string;
  order: number;
}

export interface ChatMessageRecord {
  id: string;
  sessionId: string;
  pilgrimId: string | null;
  sender: ChatSender;
  text: string;
  language: SystemLanguage;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  pilgrimId: string | null;
  type: ReportType;
  status: ReportStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentStatusRecord {
  temperatureC: number;
  weatherIcon: string;
  airQualityAqi: number;
  airQualityLabel: string;
  overallCrowd: CrowdLevelLabel;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  pilgrimId: string;
  identificationMethod: IdentificationMethod;
  createdAt: string;
  expiresAt: string;
}

export interface AccessibilityProfileRecord {
  kioskSessionId: string;
  settings: AccessibilitySettings;
  updatedAt: string;
}

// --- Store shape -------------------------------------------------------------

interface MockStore {
  supervisors: SupervisorRecord[];
  campaigns: CampaignRecord[];
  camps: CampRecord[];
  pilgrims: PilgrimRecord[];
  healthInfo: HealthInfoRecord[];
  crowdLevels: CrowdLevelRecord[];
  healthCenters: HealthCenterRecord[];
  trainStations: TrainStationRecord[];
  emergencyContacts: EmergencyContactRecord[];
  healthTips: HealthTipRecord[];
  suggestedPrompts: SuggestedPromptRecord[];
  chatMessages: ChatMessageRecord[];
  reports: ReportRecord[];
  environmentStatus: EnvironmentStatusRecord;
  notifications: NotificationRecord[];
  sessions: SessionRecord[];
  accessibilityProfiles: AccessibilityProfileRecord[];
}

function buildInitialStore(): MockStore {
  const supervisor1: SupervisorRecord = {
    id: "sup_1",
    name: "أ. عبدالرحمن السلمي",
    phone: "+966543217890",
  };
  const supervisor2: SupervisorRecord = {
    id: "sup_2",
    name: "أ. سارة الحربي",
    phone: "+966501122334",
  };

  const campaign1: CampaignRecord = {
    id: "camp_org_1",
    name: "حملة الهدى",
    campaignNumber: "H-2458",
    supervisorId: supervisor1.id,
  };
  const campaign2: CampaignRecord = {
    id: "camp_org_2",
    name: "حملة النور",
    campaignNumber: "H-3391",
    supervisorId: supervisor2.id,
  };

  const camp1: CampRecord = { id: "camp_1", number: "A102", location: "منطقة العزيزية - شارع 204" };
  const camp2: CampRecord = { id: "camp_2", number: "B207", location: "منطقة منى - حي 6" };

  const pilgrim1: PilgrimRecord = {
    id: "pilgrim_1",
    name: "محمد أحمد",
    nationality: "إندونيسيا",
    nationalityFlag: "ID",
    systemLanguage: "AR",
    pilgrimNumber: "1234567890",
    arrivalDateHijri: "1445/12/01",
    arrivalDateGregorian: "2024-06-08T00:00:00.000Z",
    avatarUrl: null,
    lastVerificationMethod: null,
    campaignId: campaign1.id,
    campId: camp1.id,
    credentials: {
      nusukCardNumber: "NSK-778812",
      qrCode: "MINAR-QR-778812",
      passportNumber: "A1234567",
      visaNumber: "VISA-2026-778812",
      nationalId: "1029384756",
    },
  };

  const pilgrim2: PilgrimRecord = {
    id: "pilgrim_2",
    name: "فاطمة الزهراني",
    nationality: "ماليزيا",
    nationalityFlag: "MY",
    systemLanguage: "EN",
    pilgrimNumber: "9988776655",
    arrivalDateHijri: "1445/12/02",
    arrivalDateGregorian: "2024-06-09T00:00:00.000Z",
    avatarUrl: null,
    lastVerificationMethod: null,
    campaignId: campaign2.id,
    campId: camp2.id,
    credentials: {
      nusukCardNumber: "NSK-445529",
      qrCode: "MINAR-QR-445529",
      passportNumber: "B7654321",
      visaNumber: "VISA-2026-445529",
      nationalId: "5647382910",
    },
  };

  const healthInfo1: HealthInfoRecord = {
    pilgrimId: pilgrim1.id,
    bloodType: "O+",
    allergies: "لا يوجد",
    chronicDiseases: "لا يوجد",
    currentMedications: "لا يوجد",
    emergencyContact: "0500000000",
  };
  const healthInfo2: HealthInfoRecord = {
    pilgrimId: pilgrim2.id,
    bloodType: "A-",
    allergies: "حساسية من البنسلين",
    chronicDiseases: "ضغط الدم",
    currentMedications: "أملوديبين 5مغ يومياً",
    emergencyContact: "0511122334",
  };

  const now = new Date().toISOString();

  const crowdLevels: CrowdLevelRecord[] = [
    { id: "cl_1", destination: "TAWAF", levelName: "صحن المطاف", levelOrder: 0, crowdLabel: "BUSY", waitMinutes: 35, isRecommended: false, recommendedGate: null, updatedAt: now },
    { id: "cl_2", destination: "TAWAF", levelName: "الدور الأرضي", levelOrder: 1, crowdLabel: "VERY_BUSY", waitMinutes: 25, isRecommended: false, recommendedGate: null, updatedAt: now },
    { id: "cl_3", destination: "TAWAF", levelName: "الدور الأول", levelOrder: 2, crowdLabel: "GOOD", waitMinutes: 18, isRecommended: true, recommendedGate: "باب الملك عبدالعزيز (رقم 79)", updatedAt: now },
    { id: "cl_4", destination: "TAWAF", levelName: "الدور الثاني", levelOrder: 3, crowdLabel: "EXCELLENT", waitMinutes: 15, isRecommended: false, recommendedGate: null, updatedAt: now },
    { id: "cl_5", destination: "SAI", levelName: "المسار الرئيسي", levelOrder: 0, crowdLabel: "MODERATE", waitMinutes: 22, isRecommended: false, recommendedGate: null, updatedAt: now },
    { id: "cl_6", destination: "SAI", levelName: "الدور الأول", levelOrder: 1, crowdLabel: "GOOD", waitMinutes: 12, isRecommended: true, recommendedGate: "بوابة الصفا", updatedAt: now },
  ];

  const healthCenters: HealthCenterRecord[] = [
    { id: "hc_1", name: "مركز نسك الصحي - العزيزية", latitude: 21.4187, longitude: 39.8262, distanceMeters: 350, etaMinutes: 5, isAvailable: true },
    { id: "hc_2", name: "مركز الرعاية العاجلة - المسجد الحرام", latitude: 21.4225, longitude: 39.8262, distanceMeters: 900, etaMinutes: 11, isAvailable: true },
    { id: "hc_3", name: "مستشفى أجياد العام", latitude: 21.418, longitude: 39.833, distanceMeters: 2200, etaMinutes: 20, isAvailable: false },
  ];

  const trainStations: TrainStationRecord[] = [
    { id: "ts_1", name: "محطة عرفات 3", distanceMeters: 1200, etaMinutes: 14 },
    { id: "ts_2", name: "محطة المشعر", distanceMeters: 2600, etaMinutes: 26 },
  ];

  const emergencyContacts: EmergencyContactRecord[] = [
    { id: "ec_1", label: "الطوارئ العامة", number: "911", order: 0 },
    { id: "ec_2", label: "الهلال الأحمر السعودي", number: "937", order: 1 },
    { id: "ec_3", label: "طلب إسعاف عاجل", number: "997", order: 2 },
  ];

  const healthTips: HealthTipRecord[] = [
    { id: "ht_1", text: "اشرب الماء بانتظام للحفاظ على الترطيب", icon: "droplets", order: 0 },
    { id: "ht_2", text: "تجنب التعرض المباشر للشمس خصوصاً وقت الظهيرة", icon: "sun", order: 1 },
    { id: "ht_3", text: "احرص على الراحة والنوم الكافي", icon: "moon", order: 2 },
    { id: "ht_4", text: "ابتعد عن الازدحام إن أمكن للحفاظ على سلامتك وسلامة الآخرين", icon: "shield-check", order: 3 },
  ];

  const suggestedPrompts: SuggestedPromptRecord[] = [
    { id: "sp_1", textAr: "ما هو أفضل وقت للطواف اليوم؟", textEn: "What's the best time for Tawaf today?", icon: "clock", order: 0 },
    { id: "sp_2", textAr: "أقرب مركز صحي", textEn: "Nearest health center", icon: "heart-pulse", order: 1 },
    { id: "sp_3", textAr: "أين أقرب دورة مياه؟", textEn: "Where is the nearest restroom?", icon: "map-pin", order: 2 },
    { id: "sp_4", textAr: "أريد الإبلاغ عن مشكلة", textEn: "I'd like to report a problem", icon: "alert-triangle", order: 3 },
  ];

  const notifications: NotificationRecord[] = [
    { id: "nt_1", titleAr: "تذكير", titleEn: "Reminder", bodyAr: "تأكد من حمل بطاقة نسك معك دائماً.", bodyEn: "Make sure to carry your Nusuk card at all times.", icon: "id-card", isRead: false, createdAt: now },
    { id: "nt_2", titleAr: "تذكير", titleEn: "Reminder", bodyAr: "احرص على شرب الماء بشكل منتظم.", bodyEn: "Remember to drink water regularly.", icon: "droplets", isRead: false, createdAt: now },
    { id: "nt_3", titleAr: "تذكير", titleEn: "Reminder", bodyAr: "اتبع اللوحات الإرشادية داخل المشاعر.", bodyEn: "Follow the directional signage within the holy sites.", icon: "signpost", isRead: false, createdAt: now },
  ];

  const environmentStatus: EnvironmentStatusRecord = {
    temperatureC: 42,
    weatherIcon: "sun",
    airQualityAqi: 35,
    airQualityLabel: "جيدة",
    overallCrowd: "MODERATE",
    updatedAt: now,
  };

  return {
    supervisors: [supervisor1, supervisor2],
    campaigns: [campaign1, campaign2],
    camps: [camp1, camp2],
    pilgrims: [pilgrim1, pilgrim2],
    healthInfo: [healthInfo1, healthInfo2],
    crowdLevels,
    healthCenters,
    trainStations,
    emergencyContacts,
    healthTips,
    suggestedPrompts,
    chatMessages: [],
    reports: [],
    environmentStatus,
    notifications,
    sessions: [],
    accessibilityProfiles: [],
  };
}

// Persist across Next.js dev-mode hot reloads, same rationale as lib/prisma.ts.
const globalForMockStore = globalThis as unknown as { __minarMockStore?: MockStore };

export const mockStore: MockStore =
  globalForMockStore.__minarMockStore ?? buildInitialStore();

if (process.env.NODE_ENV !== "production") {
  globalForMockStore.__minarMockStore = mockStore;
}

export function generateId(prefix: string): string {
  return `${prefix}_${nanoid(10)}`;
}

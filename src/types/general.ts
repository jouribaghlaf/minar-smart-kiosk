import type { CrowdLevelLabel } from "./navigation";

export interface EnvironmentStatus {
  temperatureC: number;
  weatherIcon: string;
  airQualityAqi: number;
  airQualityLabel: string;
  overallCrowd: CrowdLevelLabel;
  updatedAt: string;
}

export interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
}

export type ReportType =
  | "LOST_PILGRIM"
  | "LOST_ITEM"
  | "MEDICAL_EMERGENCY"
  | "FIELD_ASSISTANCE"
  | "SECURITY";

export type ReportStatus = "SUBMITTED" | "IN_PROGRESS" | "RESOLVED";

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  notes?: string | null;
  createdAt: string;
}

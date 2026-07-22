export type DestinationType = "TAWAF" | "SAI" | "CAMP" | "RESTROOM" | "HEALTH_CENTER" | "HOTEL" | "HARAM" | "PHARMACY" | "MALL" | "RESTAURANTS";

export type CrowdLevelLabel =
  | "EXCELLENT"
  | "GOOD"
  | "MODERATE"
  | "BUSY"
  | "VERY_BUSY";

export interface CrowdLevel {
  id: string;
  destination: DestinationType;
  levelName: string;
  levelOrder: number;
  crowdLabel: CrowdLevelLabel;
  waitMinutes: number;
  isRecommended: boolean;
  recommendedGate?: string | null;
  updatedAt: string;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
}

export interface RouteRecommendation {
  destination: DestinationType;
  recommendedLevel: CrowdLevel;
  totalDistanceMeters: number;
  etaMinutes: number;
  steps: RouteStep[];
  qrPayload: string; // encoded route, rendered as a QR code to send to the pilgrim's phone
}

export interface HealthCenter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  etaMinutes: number;
  isAvailable: boolean;
}

export interface TrainStation {
  id: string;
  name: string;
  distanceMeters: number;
  etaMinutes: number;
}

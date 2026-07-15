export type ChatSender = "USER" | "ASSISTANT";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  createdAt: string;
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  label: string;
  href: string; // e.g. "/navigation?destination=HEALTH_CENTER"
}

export interface SuggestedPrompt {
  id: string;
  textAr: string;
  textEn: string;
  icon: string;
}

/**
 * Present only when a real identification session exists. The assistant
 * uses this to personalize replies (camp/campaign lookups, journey
 * progress); guests simply never send it, so their requests are
 * indistinguishable from "no personalization available" server-side —
 * there is no separate "guest mode flag" to get wrong.
 */
export interface AssistantPilgrimContext {
  name: string;
  campaignName: string;
  campNumber: string;
  campLocation: string;
}

export interface AssistantRequest {
  sessionId: string;
  message: string;
  language: "AR" | "EN";
  pilgrimContext?: AssistantPilgrimContext;
}

export interface AssistantResponse {
  reply: ChatMessage;
}

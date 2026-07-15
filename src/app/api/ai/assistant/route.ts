import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getAssistantReply } from "@/lib/services/aiService";
import { getPilgrimBySessionToken } from "@/lib/services/sessionService";
import type { AssistantPilgrimContext } from "@/types/chat";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "minar_session";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
  language: z.enum(["AR", "EN"]).default("AR"),
});

/**
 * POST /api/ai/assistant
 * Body: { sessionId: string, message: string, language: "AR" | "EN" }
 * -> { reply: ChatMessage }
 *
 * `sessionId` here is a client-generated conversation identifier (not the
 * kiosk auth session) so the assistant works identically for identified
 * and anonymous pilgrims, per "يمكن فتحه من أي شاشة" / "جميع ضيوف الرحمن".
 *
 * Personalization is intentionally NOT trusted from the request body —
 * the client never sends pilgrim details. Instead this route resolves
 * the real kiosk auth session from the cookie (same pattern as
 * /api/session and /api/health/info) and only builds a pilgrim context
 * when that session actually exists. A guest cannot get personalized
 * replies by forging a request; personalization is only ever possible
 * after a genuine Smart Identification success.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const pilgrim = await getPilgrimBySessionToken(token);

  const pilgrimContext: AssistantPilgrimContext | undefined = pilgrim
    ? {
        name: pilgrim.name,
        campaignName: pilgrim.campaign.name,
        campNumber: pilgrim.camp.number,
        campLocation: pilgrim.camp.location,
      }
    : undefined;

  const reply = await getAssistantReply({ ...parsed.data, pilgrimContext });
  return NextResponse.json({ reply });
}

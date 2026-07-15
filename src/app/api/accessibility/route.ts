import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateKioskSessionId, setKioskSessionCookie } from "@/lib/utils/kioskSession";
import { getAccessibilityProfile, saveAccessibilityProfile } from "@/lib/services/accessibilityService";
import { DEFAULT_ACCESSIBILITY_SETTINGS, FONT_SCALE_MAX, FONT_SCALE_MIN } from "@/types/accessibility";

const settingsSchema = z.object({
  fontScale: z.number().min(FONT_SCALE_MIN).max(FONT_SCALE_MAX),
  highContrast: z.boolean(),
  colorBlindMode: z.boolean(),
  largeButtons: z.boolean(),
  textToSpeech: z.boolean(),
  voiceCommands: z.boolean(),
  reducedMotion: z.boolean(),
  wheelchairMode: z.boolean(),
  volume: z.number().min(0).max(1),
});

/**
 * GET /api/accessibility -> { settings: AccessibilitySettings }
 * POST /api/accessibility (body: AccessibilitySettings) -> { settings }
 *
 * The client-side AccessibilityContext already persists to localStorage,
 * which fully satisfies "Settings should immediately affect the
 * interface" for a single kiosk visit. This route is the optional
 * server-side counterpart for a future cross-kiosk sync scenario — see
 * the comment in accessibilityService.ts.
 */
export async function GET() {
  const { id, isNew } = await getOrCreateKioskSessionId();
  const settings = await getAccessibilityProfile(id);

  const res = NextResponse.json({ settings });
  if (isNew) setKioskSessionCookie(res, id);
  return res;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ settings: DEFAULT_ACCESSIBILITY_SETTINGS, error: "طلب غير صالح." }, { status: 400 });
  }

  const { id, isNew } = await getOrCreateKioskSessionId();
  const settings = await saveAccessibilityProfile(id, parsed.data);

  const res = NextResponse.json({ settings });
  if (isNew) setKioskSessionCookie(res, id);
  return res;
}

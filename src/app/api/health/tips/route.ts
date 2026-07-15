import { NextResponse } from "next/server";
import { getHealthTips } from "@/lib/services/healthService";

export async function GET() {
  const tips = await getHealthTips();
  return NextResponse.json({ tips });
}

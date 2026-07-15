import { NextResponse } from "next/server";
import { getSuggestedPrompts } from "@/lib/services/aiService";

export async function GET() {
  const prompts = await getSuggestedPrompts();
  return NextResponse.json({ prompts });
}

import { NextResponse } from "next/server";
import { getSuggestedPrompts } from "@/lib/services/agentService";

export async function GET() {
  const prompts = await getSuggestedPrompts();
  return NextResponse.json({ prompts });
}

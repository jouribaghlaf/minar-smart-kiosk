import { NextResponse } from "next/server";
import { getEnvironmentStatus } from "@/lib/services/environmentService";

export async function GET() {
  const status = await getEnvironmentStatus();
  return NextResponse.json({ status });
}

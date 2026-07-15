import { NextResponse } from "next/server";
import { getHealthCenters } from "@/lib/services/healthService";

export async function GET() {
  const centers = await getHealthCenters();
  return NextResponse.json({ centers });
}

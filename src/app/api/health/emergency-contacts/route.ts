import { NextResponse } from "next/server";
import { getEmergencyContacts } from "@/lib/services/healthService";

export async function GET() {
  const contacts = await getEmergencyContacts();
  return NextResponse.json({ contacts });
}

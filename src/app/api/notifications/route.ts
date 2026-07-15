import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/services/notificationService";

export async function GET() {
  const notifications = await getNotifications();
  return NextResponse.json({ notifications });
}

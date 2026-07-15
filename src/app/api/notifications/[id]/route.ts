import { NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/services/notificationService";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const notification = await markNotificationRead(id);

  if (!notification) {
    return NextResponse.json({ error: "الإشعار غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ notification });
}

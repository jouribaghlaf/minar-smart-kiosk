import { NextResponse } from "next/server";
import { z } from "zod";
import { executeServiceTool } from "@/lib/services/serviceExecutionService";

const schema = z.object({
  slug: z.string().min(1),
  values: z.record(z.string(), z.string()).default({}),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: "طلب غير صالح" }, { status: 400 });
  try {
    return NextResponse.json(await executeServiceTool(parsed.data.slug, parsed.data.values));
  } catch {
    return NextResponse.json({ success: false, error: "الخدمة غير متاحة" }, { status: 404 });
  }
}

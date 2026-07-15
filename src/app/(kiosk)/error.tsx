"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function KioskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[KioskError]", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
      <AlertTriangle className="h-12 w-12 text-emergency" aria-hidden="true" />
      <h1 className="text-kiosk-xl font-bold text-brand-900">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-kiosk-base text-ink-500">
        نعتذر عن هذا الخلل. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}

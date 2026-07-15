"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function GatewayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GatewayError]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <AlertTriangle className="h-12 w-12 text-emergency" aria-hidden="true" />
      <h1 className="text-kiosk-xl font-bold text-brand-900">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-kiosk-base text-ink-500">
        نعتذر عن هذا الخلل. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
      </p>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}

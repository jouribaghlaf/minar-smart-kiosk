import { Loader2 } from "lucide-react";

export default function KioskLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand-700" aria-hidden="true" />
      <p className="text-kiosk-base text-ink-500">جاري التحميل...</p>
    </div>
  );
}

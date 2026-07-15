import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand-700" aria-hidden="true" />
      <p className="text-kiosk-base text-ink-500">جاري التحميل...</p>
    </div>
  );
}

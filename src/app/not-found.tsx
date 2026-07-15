import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <MapPinOff className="h-14 w-14 text-brand-300" aria-hidden="true" />
      <h1 className="text-kiosk-2xl font-bold text-brand-900">الصفحة غير موجودة</h1>
      <p className="max-w-md text-kiosk-base text-ink-500">
        يبدو أن هذه الصفحة غير متاحة. يمكنك العودة إلى بوابة الخدمات الرئيسية.
      </p>
      <Link
        href="/"
        data-touch-target
        className="flex h-touch-lg items-center rounded-2xl bg-brand-700 px-8 text-kiosk-base font-semibold text-white shadow-card hover:bg-brand-800"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}

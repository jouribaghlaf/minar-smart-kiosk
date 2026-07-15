"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCog, ScanFace } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import type { Pilgrim } from "@/types/pilgrim";

/**
 * Navigation is a public/guest-accessible screen — `pilgrim` is `null`
 * for the vast majority of visitors, and that is the expected, correct
 * state, not a loading glitch. Personalized details (name, campaign,
 * camp) only ever render once a real identification session exists;
 * guests instead see a neutral, optional invitation to identify
 * themselves, which they can freely ignore and keep using this screen.
 */
export function NavigationGreetingBar({ pilgrim }: { pilgrim: Pilgrim | null }) {
  const { t } = useLanguage();
  const { logout } = useSession();
  const router = useRouter();

  const handleChangeProfile = async () => {
    await logout();
    router.push("/identify");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-kiosk-xl font-bold text-brand-900">
          {t("الملاحة الذكية وإدارة الحشود", "Smart Navigation & Crowd Management")}
        </h1>
        <p className="mt-1 text-kiosk-xs text-ink-500">
          {t(
            "اختر وجهتك وسنقوم بتحليل الحشود واقتراح أفضل وقت وأسرع مسار لك",
            "Choose your destination and we'll analyze crowds to suggest the best time and fastest route"
          )}
        </p>
      </div>

      {pilgrim ? (
        <div className="flex items-center gap-3">
          <span className="text-kiosk-xs text-ink-500">
            {t(`مرحباً ${pilgrim.name}`, `Hello, ${pilgrim.name}`)} — {pilgrim.campaign.name} ·{" "}
            {t("المخيم", "Camp")} {pilgrim.camp.number}
          </span>
          <button
            type="button"
            onClick={handleChangeProfile}
            className="flex items-center gap-1.5 text-kiosk-xs font-semibold text-brand-700 hover:underline"
          >
            <UserCog className="h-4 w-4" aria-hidden="true" />
            {t("تغيير الملف الشخصي", "Switch Profile")}
          </button>
        </div>
      ) : (
        <Link
          href="/identify"
          className="flex items-center gap-1.5 rounded-pill border border-brand-100 bg-brand-50 px-4 py-2 text-kiosk-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          <ScanFace className="h-4 w-4" aria-hidden="true" />
          {t("سجّل الدخول لتجربة مخصصة", "Sign in for a personalized experience")}
        </Link>
      )}
    </div>
  );
}

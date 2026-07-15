"use client";

import { MinarLogo } from "@/components/common/MinarLogo";
import { ArchPatternBackground } from "@/components/common/ArchPatternBackground";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Screen 01's header banner. The approved design shows a photograph of
 * the Kaaba behind the welcome text; since reproducing that specific
 * photograph isn't possible here (no source asset, and real photography
 * of identifiable places carries its own licensing considerations), this
 * uses an original abstract arch/pattern treatment in the brand palette
 * that preserves the same visual weight and layout without copying any
 * existing artwork. Swap the background for the licensed photo asset
 * whenever one is supplied — the component's structure won't need to
 * change.
 */
export function WelcomeBanner() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-card bg-brand-900">
      <ArchPatternBackground />

      <div className="relative flex flex-col items-center gap-3 px-6 py-10 text-center sm:py-14">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
          <MinarLogo className="h-10 w-10" />
        </span>
        <h1 className="text-kiosk-2xl font-bold text-white sm:text-kiosk-3xl">
          {t("مرحباً بك في منار", "Welcome to Minar")}
        </h1>
        <p className="max-w-xl text-kiosk-sm text-white/80">
          {t(
            "الكشك الذكي لخدمة ضيوف الرحمن — اختر الخدمة التي تحتاجها",
            "The smart kiosk for pilgrims — choose the service you need"
          )}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { ServiceGrid } from "../../(gateway)/_components/ServiceGrid";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";

export default function ServicesPage() {
  const { t } = useLanguage();
  const { pilgrim, mode } = useSession();
  const firstName = pilgrim?.name.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-7 text-white sm:p-9">
        <div className="absolute -end-16 -top-20 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-gold-400">
            <Sparkles className="h-5 w-5" />
            <span className="text-kiosk-xs font-semibold">{t("خدمات ذكية بلغتك", "AI-powered services in your language")}</span>
          </div>
          {mode === "authenticated" && firstName && <p className="mb-2 text-kiosk-lg font-bold text-gold-400">{t(`مرحبًا، ${firstName}`, `Welcome, ${firstName}`)}</p>}
          <h1 className="text-kiosk-2xl font-bold">{t("كيف نقدر نخدمك اليوم؟", "How can we help you today?")}</h1>
          <p className="mt-2 max-w-3xl text-kiosk-sm text-white/65">
            {t("اختر الخدمة التي تحتاجها، أو اسأل مساعد منار الذكي ليقودك إليها مباشرة.", "Choose a service, or ask Minar's AI assistant to guide you instantly.")}
          </p>
        </div>
      </section>

      <ServiceGrid />
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ServiceGrid } from "../../(gateway)/_components/ServiceGrid";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";

export default function ServicesPage() {
  const { t } = useLanguage();
  const { pilgrim, mode } = useSession();
  const firstName = pilgrim?.name.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-gold-400/20 bg-brand-900 p-7 shadow-card-hover text-white sm:p-9">
        <div className="ministry-ornament absolute inset-x-0 top-0 h-2" /><div className="absolute -end-16 -top-20 h-64 w-64 rounded-full border border-gold-500/20" />
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

      <Link href={mode === "authenticated" ? "/dashboard" : "/"} className="flex h-touch w-fit items-center gap-2 rounded-2xl border-2 border-brand-700 bg-white px-5 font-bold text-brand-700 hover:bg-brand-50"><ArrowRight className="h-5 w-5" />{t("الرجوع للصفحة الرئيسية", "Back to home")}</Link>
      <ServiceGrid />
    </div>
  );
}

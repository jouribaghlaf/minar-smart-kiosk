"use client";

import { ArrowLeft, Bot, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

export function PostLoginChoices() {
  const router = useRouter();
  const { openAIAssistant } = useDrawer();
  const { t } = useLanguage();
  return <section className="grid w-full flex-1 content-center gap-6 sm:grid-cols-2 lg:gap-8">
    <button type="button" onClick={() => router.push("/services")} className="group relative flex min-h-[22rem] w-full flex-col items-center justify-center gap-6 rounded-[2.5rem] bg-brand-900 p-8 text-center text-white shadow-card-hover transition hover:-translate-y-2 lg:min-h-[25rem] lg:p-10"><span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] bg-gold-500 text-brand-900 shadow-lg"><LayoutGrid className="h-12 w-12" /></span><span><strong className="block text-kiosk-2xl">{t("الخدمة الذاتية", "Self service")}</strong><span className="mx-auto mt-3 block max-w-lg text-kiosk-sm leading-relaxed text-white/70">{t("استعرض جميع الخدمات ونفّذ طلبك بنفسك خطوة بخطوة", "Browse all services and complete your request step by step")}</span></span><span className="absolute bottom-7 end-7 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20"><ArrowLeft className="h-7 w-7" /></span></button>
    <button type="button" onClick={openAIAssistant} className="group relative flex min-h-[22rem] w-full flex-col items-center justify-center gap-6 rounded-[2.5rem] border-2 border-gold-400 bg-gold-100 p-8 text-center text-brand-900 shadow-card-hover transition hover:-translate-y-2 lg:min-h-[25rem] lg:p-10"><span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] bg-brand-900 text-gold-400 shadow-lg"><Bot className="h-12 w-12" /></span><span><strong className="block text-kiosk-2xl">{t("مساعد مِنار الذكي", "Minar AI Assistant")}</strong><span className="mx-auto mt-3 block max-w-lg text-kiosk-sm leading-relaxed text-ink-700">{t("اطلب الخدمة داخل المحادثة وسيجمع البيانات وينفذها لك", "Request a service in chat and the agent will collect details and complete it")}</span></span><span className="absolute bottom-7 end-7 flex h-12 w-12 items-center justify-center rounded-full bg-brand-900/10 transition group-hover:bg-brand-900/20"><ArrowLeft className="h-7 w-7" /></span></button>
  </section>;
}

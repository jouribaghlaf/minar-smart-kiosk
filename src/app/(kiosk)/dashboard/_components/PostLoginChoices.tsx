"use client";

import { ArrowLeft, Bot, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

export function PostLoginChoices() {
  const router = useRouter();
  const { openAIAssistant } = useDrawer();
  const { t } = useLanguage();
  return <section className="grid gap-5 sm:grid-cols-2">
    <button type="button" onClick={() => router.push("/services")} className="flex min-h-44 items-center gap-6 rounded-[2rem] bg-brand-900 p-7 text-start text-white shadow-card-hover transition hover:-translate-y-1 lg:min-h-52 lg:p-9"><span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-gold-500 text-brand-900"><LayoutGrid className="h-10 w-10" /></span><span className="flex-1"><strong className="block text-kiosk-xl">{t("الخدمة الذاتية", "Self service")}</strong><span className="mt-2 block text-kiosk-sm text-white/70">{t("استعرض الخدمات ونفّذ طلبك خطوة بخطوة", "Browse services and complete your request")}</span></span><ArrowLeft className="h-7 w-7" /></button>
    <button type="button" onClick={openAIAssistant} className="flex min-h-44 items-center gap-6 rounded-[2rem] border-2 border-gold-400 bg-gold-100 p-7 text-start text-brand-900 shadow-card transition hover:-translate-y-1 lg:min-h-52 lg:p-9"><span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-brand-900 text-gold-400"><Bot className="h-10 w-10" /></span><span className="flex-1"><strong className="block text-kiosk-xl">{t("مساعد مِنار الذكي", "Minar AI Assistant")}</strong><span className="mt-2 block text-kiosk-sm text-ink-700">{t("اطلب الخدمة داخل المحادثة وسيساعدك في إكمالها", "Request and complete services in the conversation")}</span></span><ArrowLeft className="h-7 w-7" /></button>
  </section>;
}

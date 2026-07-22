"use client";

import { ArrowLeft, Bot, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

export function PostLoginChoices() {
  const router = useRouter();
  const { openAIAssistant } = useDrawer();
  const { t } = useLanguage();
  return <section className="grid gap-4 sm:grid-cols-2">
    <button type="button" onClick={() => router.push("/services")} className="flex min-h-32 items-center gap-5 rounded-[2rem] bg-brand-900 p-6 text-start text-white shadow-card-hover transition hover:-translate-y-1"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-brand-900"><LayoutGrid className="h-8 w-8" /></span><span className="flex-1"><strong className="block text-kiosk-lg">{t("الخدمة الذاتية", "Self service")}</strong><span className="mt-1 block text-kiosk-xs text-white/65">{t("استعرض الخدمات ونفّذ طلبك خطوة بخطوة", "Browse services and complete your request")}</span></span><ArrowLeft className="h-6 w-6" /></button>
    <button type="button" onClick={openAIAssistant} className="flex min-h-32 items-center gap-5 rounded-[2rem] border-2 border-gold-400 bg-gold-100 p-6 text-start text-brand-900 shadow-card transition hover:-translate-y-1"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-gold-400"><Bot className="h-8 w-8" /></span><span className="flex-1"><strong className="block text-kiosk-lg">{t("مساعد مِنار الذكي", "Minar AI Assistant")}</strong><span className="mt-1 block text-kiosk-xs text-ink-700">{t("اطلب الخدمة داخل المحادثة وسيساعدك في إكمالها", "Request and complete services in the conversation")}</span></span><ArrowLeft className="h-6 w-6" /></button>
  </section>;
}

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { IdleSessionGuard } from "@/components/layout/IdleSessionGuard";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { openAIAssistant } = useDrawer();
  const { t } = useLanguage();
  const isWelcome = pathname === "/";
  const showAssistantButton = pathname === "/services" || pathname.startsWith("/services/");

  if (isWelcome) return <>{children}</>;
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-cream-100">
      <TopNavigation />
      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      {showAssistantButton && <button type="button" onClick={openAIAssistant} aria-label={t("فتح مساعد مِنار الذكي", "Open Minar AI Assistant")} className="fixed bottom-6 end-6 z-50 flex h-16 items-center gap-3 rounded-full bg-gold-500 px-5 font-bold text-brand-900 shadow-2xl transition hover:-translate-y-1 hover:bg-gold-400"><Sparkles className="h-7 w-7" /><span className="hidden sm:inline">{t("مساعد مِنار", "Minar Assistant")}</span></button>}
      <IdleSessionGuard />
    </div>
  );
}

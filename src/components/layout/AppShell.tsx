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
    <div className="flex h-dvh min-h-0 w-full max-w-full flex-col overflow-hidden bg-cream-100">
      <TopNavigation />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">{children}</main>
      {showAssistantButton && <button type="button" onClick={openAIAssistant} aria-label={t("فتح مساعد مِنار الذكي", "Open Minar AI Assistant")} className="fixed bottom-3 end-3 z-50 flex h-14 items-center gap-2 rounded-full bg-gold-500 px-4 font-bold text-brand-900 shadow-2xl transition hover:-translate-y-1 hover:bg-gold-400 sm:bottom-6 sm:end-6 sm:h-16 sm:gap-3 sm:px-5"><Sparkles className="h-6 w-6 sm:h-7 sm:w-7" /><span className="hidden sm:inline">{t("مساعد مِنار", "Minar Assistant")}</span></button>}
      <IdleSessionGuard />
    </div>
  );
}

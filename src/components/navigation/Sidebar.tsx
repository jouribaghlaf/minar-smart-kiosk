"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  HeartPulse,
  BookOpen,
  Megaphone,
  TrainFront,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { MinarLogo } from "@/components/common/MinarLogo";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils/cn";

interface SidebarItem {
  href: string;
  icon: LucideIcon;
  labelAr: string;
  labelEn: string;
  /** Screens outside the 5 approved screens (Religious Guide, Reports,
   *  Transport) are shown per the approved design for visual fidelity,
   *  but aren't part of this build's scope, so they're rendered
   *  disabled rather than linking to a page that doesn't exist. */
  disabled?: boolean;
}

const ITEMS: SidebarItem[] = [
  { href: "/dashboard", icon: Home, labelAr: "الرئيسية", labelEn: "Home" },
  { href: "/navigation", icon: Compass, labelAr: "الملاحة الذكية", labelEn: "Navigation" },
  { href: "/healthcare", icon: HeartPulse, labelAr: "الخدمات الصحية", labelEn: "Healthcare" },
  { href: "/religious-guide", icon: BookOpen, labelAr: "الدليل الديني", labelEn: "Guide", disabled: true },
  { href: "/reports", icon: Megaphone, labelAr: "البلاغات والمساعدة", labelEn: "Reports", disabled: true },
  { href: "/transport", icon: TrainFront, labelAr: "القطار والمواصلات", labelEn: "Transport", disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="flex h-full w-24 shrink-0 flex-col items-center gap-2 bg-brand-900 py-6 kiosk:w-28">
      <Link
        href="/dashboard"
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-gold-400"
        aria-label={t("منار — الرئيسية", "Minar — Home")}
      >
        <MinarLogo className="h-8 w-8" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                title={t("قريباً", "Coming soon")}
                className="flex w-full cursor-not-allowed flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center text-ink-300 opacity-40"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-[0.65rem] font-medium leading-tight">
                  {t(item.labelAr, item.labelEn)}
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              data-touch-target
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition-colors",
                isActive ? "bg-gold-500 text-brand-900" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-[0.65rem] font-semibold leading-tight">
                {t(item.labelAr, item.labelEn)}
              </span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        data-touch-target
        title={t("المزيد", "More")}
        className="flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreHorizontal className="h-6 w-6" aria-hidden="true" />
        <span className="text-[0.65rem] font-medium leading-tight">{t("المزيد", "More")}</span>
      </button>
    </aside>
  );
}

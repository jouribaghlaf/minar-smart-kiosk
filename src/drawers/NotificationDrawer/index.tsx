"use client";

import { Bell, IdCard, Droplets, Signpost, CheckCircle2, type LucideIcon } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<string, LucideIcon> = {
  "id-card": IdCard,
  droplets: Droplets,
  signpost: Signpost,
};

export function NotificationDrawer() {
  const { activeDrawer, closeDrawer } = useDrawer();
  const { t, language } = useLanguage();
  const { notifications, isLoading, markAsRead } = useNotifications();

  const relativeTime = (iso: string) => {
    const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (diffMinutes < 60) return t(`قبل ${diffMinutes} دقيقة`, `${diffMinutes}m ago`);
    const hours = Math.round(diffMinutes / 60);
    return t(`قبل ${hours} ساعة`, `${hours}h ago`);
  };

  return (
    <Drawer
      isOpen={activeDrawer === "notifications"}
      onClose={closeDrawer}
      title={t("الإشعارات", "Notifications")}
      icon={<Bell className="h-6 w-6" aria-hidden="true" />}
    >
      {isLoading && (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-cream-200" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-500">
          <Bell className="h-10 w-10 text-brand-300" aria-hidden="true" />
          <p className="text-kiosk-base font-medium text-ink-700">
            {t("لا توجد إشعارات حالياً", "No notifications right now")}
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {notifications.map((notification) => {
          const Icon = ICONS[notification.icon] ?? Bell;
          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={cn(
                  "card-surface flex w-full items-start gap-3 rounded-2xl border border-cream-200 bg-white p-4 text-start shadow-card transition-colors hover:bg-cream-50",
                  !notification.isRead && "border-brand-100 bg-brand-50/40"
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-kiosk-sm font-semibold text-ink-900">
                      {language === "AR" ? notification.titleAr : notification.titleEn}
                    </span>
                    {!notification.isRead && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-1 block text-kiosk-xs text-ink-500">
                    {language === "AR" ? notification.bodyAr : notification.bodyEn}
                  </span>
                  <span className="mt-2 block text-kiosk-xs text-ink-300">
                    {relativeTime(notification.createdAt)}
                  </span>
                </span>
                {notification.isRead && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-status-good" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
}

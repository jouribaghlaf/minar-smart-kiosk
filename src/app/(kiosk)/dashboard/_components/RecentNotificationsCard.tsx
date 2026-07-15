"use client";

import { Bell, IdCard, Droplets, Signpost, type LucideIcon } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

const ICONS: Record<string, LucideIcon> = {
  "id-card": IdCard,
  droplets: Droplets,
  signpost: Signpost,
};

/**
 * Reads from the same `NotificationsContext` the global bottom bar's bell
 * badge uses — no separate fetch, no duplicate notification state. "View
 * all" opens the same global Notification Drawer via `useDrawer`, so
 * there is exactly one notifications data source and one detail view in
 * the whole app.
 */
export function RecentNotificationsCard() {
  const { t, language } = useLanguage();
  const { notifications, isLoading } = useNotifications();
  const { openNotifications } = useDrawer();

  const recent = notifications.slice(0, 3);

  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand-700" aria-hidden="true" />
          <h3 className="text-kiosk-sm font-bold text-ink-900">{t("أحدث الإشعارات", "Recent Notifications")}</h3>
        </div>
        <button
          type="button"
          onClick={openNotifications}
          className="text-kiosk-xs font-semibold text-brand-700 hover:underline"
        >
          {t("عرض الكل", "View all")}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-cream-200" />
          ))}
        </div>
      )}

      {!isLoading && recent.length === 0 && (
        <p className="mt-4 text-kiosk-xs text-ink-300">{t("لا توجد إشعارات حالياً", "No notifications right now")}</p>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {recent.map((notification) => {
          const Icon = ICONS[notification.icon] ?? Bell;
          return (
            <li key={notification.id} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-kiosk-xs font-semibold text-ink-900">
                  {language === "AR" ? notification.titleAr : notification.titleEn}
                </p>
                <p className="text-[0.7rem] text-ink-500">
                  {language === "AR" ? notification.bodyAr : notification.bodyEn}
                </p>
              </div>
              {!notification.isRead && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

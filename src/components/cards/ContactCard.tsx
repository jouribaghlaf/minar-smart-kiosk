"use client";

import { Phone } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ContactCardProps {
  name: string;
  role?: string;
  phone: string;
  avatarUrl?: string | null;
}

export function ContactCard({ name, role, phone, avatarUrl }: ContactCardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-3 rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-kiosk-sm font-bold text-brand-700">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar source is dynamic/mock, not a static asset
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </span>
        <div>
          {role && <p className="text-kiosk-xs text-ink-500">{role}</p>}
          <p className="text-kiosk-sm font-bold text-ink-900">{name}</p>
          <p dir="ltr" className="text-kiosk-xs text-ink-500">
            {phone}
          </p>
        </div>
      </div>
      <a
        href={`tel:${phone}`}
        data-touch-target
        className="flex h-touch items-center gap-2 rounded-2xl bg-brand-700 px-5 text-kiosk-xs font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        {t("اتصال", "Call")}
      </a>
    </div>
  );
}

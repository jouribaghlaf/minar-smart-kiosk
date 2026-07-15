import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AlertBannerProps {
  icon: LucideIcon;
  title: string;
  message: string;
  tone?: "info" | "warning" | "error";
  className?: string;
}

const toneClasses = {
  info: "bg-brand-50 border-brand-100 text-brand-900",
  warning: "bg-gold-100 border-gold-400/40 text-brand-900",
  error: "bg-status-badBg border-status-bad/30 text-brand-900",
};

const iconToneClasses = {
  info: "bg-brand-100 text-brand-700",
  warning: "bg-gold-400/30 text-gold-600",
  error: "bg-status-bad/15 text-status-bad",
};

export function AlertBanner({ icon: Icon, title, message, tone = "info", className }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-card border p-5",
        toneClasses[tone],
        className
      )}
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", iconToneClasses[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-kiosk-sm font-bold">{title}</p>
        <p className="mt-1 text-kiosk-xs leading-relaxed text-ink-500">{message}</p>
      </div>
    </div>
  );
}

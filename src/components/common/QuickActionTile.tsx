import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QuickActionTileProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  disabledLabel?: string;
}

export function QuickActionTile({
  icon: Icon,
  label,
  href,
  onClick,
  variant = "default",
  disabled = false,
  disabledLabel,
}: QuickActionTileProps) {
  const className = cn(
    "flex flex-col items-center justify-center gap-2 rounded-card border p-4 text-center shadow-card transition-all",
    disabled
      ? "cursor-not-allowed border-cream-200 bg-white text-ink-300 opacity-60"
      : cn(
          "hover:-translate-y-0.5 hover:shadow-card-hover",
          variant === "danger"
            ? "border-status-bad/30 bg-status-badBg text-status-bad"
            : "border-cream-200 bg-white text-ink-900"
        )
  );

  const content = (
    <>
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          disabled ? "bg-cream-200 text-ink-300" : variant === "danger" ? "bg-status-bad text-white" : "bg-brand-100 text-brand-700"
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="text-kiosk-xs font-semibold">{label}</span>
      {disabled && disabledLabel && (
        <span className="rounded-pill bg-cream-200 px-2 py-0.5 text-[0.65rem] font-semibold text-ink-500">
          {disabledLabel}
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} data-touch-target className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" data-touch-target onClick={onClick} className={className}>
      {content}
    </button>
  );
}

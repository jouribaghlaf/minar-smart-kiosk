import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Provide either `href` (navigates) or `onClick` (e.g. opens a global
   *  drawer) — never both. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledLabel?: string;
  iconToneClassName?: string;
}

/**
 * Generic content card for a grid of services/actions. Deliberately
 * layout-agnostic (no fixed width) so it works in Screen 01's service
 * grid today and in Dashboard/Healthcare quick-action grids later.
 */
export function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  disabled = false,
  disabledLabel,
  iconToneClassName = "bg-brand-100 text-brand-700",
}: ServiceCardProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          disabled ? "bg-cream-200 text-ink-300" : iconToneClassName
        )}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="mt-4 block text-kiosk-sm font-bold text-ink-900">{title}</span>
      <span className="mt-1.5 block text-kiosk-xs leading-relaxed text-ink-500">{description}</span>
      {disabled && disabledLabel && (
        <span className="mt-3 inline-flex w-fit rounded-pill bg-cream-200 px-2.5 py-1 text-[0.7rem] font-semibold text-ink-500">
          {disabledLabel}
        </span>
      )}
    </>
  );

  const className = cn(
    "card-surface flex flex-col items-start rounded-card border border-cream-200 bg-white p-5 text-start shadow-card transition-all duration-200",
    disabled
      ? "cursor-not-allowed opacity-60"
      : "hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0"
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
    <button type="button" data-touch-target onClick={onClick} className={cn(className, "w-full")}>
      {content}
    </button>
  );
}

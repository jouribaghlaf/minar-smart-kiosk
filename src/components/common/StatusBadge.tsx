import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type StatusTone = "good" | "mid" | "bad" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  good: "bg-status-goodBg text-status-good",
  mid: "bg-status-midBg text-status-mid",
  bad: "bg-status-badBg text-status-bad",
  neutral: "bg-cream-200 text-ink-700",
};

const dotClasses: Record<StatusTone, string> = {
  good: "bg-status-good",
  mid: "bg-status-mid",
  bad: "bg-status-bad",
  neutral: "bg-ink-300",
};

export function StatusBadge({ label, tone = "neutral", icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-kiosk-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {icon ?? <span className={cn("h-2 w-2 rounded-full", dotClasses[tone])} aria-hidden="true" />}
      {label}
    </span>
  );
}

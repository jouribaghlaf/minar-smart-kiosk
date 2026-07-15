import type { LucideIcon } from "lucide-react";

export interface InfoRow {
  label: string;
  value: string;
}

interface InfoRowsCardProps {
  title: string;
  icon?: LucideIcon;
  rows: InfoRow[];
}

export function InfoRowsCard({ title, icon: Icon, rows }: InfoRowsCardProps) {
  return (
    <div className="rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <h3 className="text-kiosk-sm font-bold text-ink-900">{title}</h3>
      </div>
      <dl className="mt-4 flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-kiosk-xs text-ink-500">{row.label}</dt>
            <dd className="text-kiosk-xs font-semibold text-ink-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

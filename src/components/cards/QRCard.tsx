import { QRCodeSVG } from "qrcode.react";
import type { LucideIcon } from "lucide-react";

interface QRCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  size?: number;
}

export function QRCard({ icon: Icon, title, description, value, size = 72 }: QRCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-cream-200 bg-white p-5 shadow-card">
      <div className="shrink-0 rounded-2xl bg-white p-2 ring-1 ring-cream-200">
        <QRCodeSVG value={value} size={size} fgColor="#0B3B2E" />
      </div>
      <div>
        <div className="flex items-center gap-2 text-brand-700">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <h3 className="text-kiosk-sm font-bold text-ink-900">{title}</h3>
        </div>
        <p className="mt-1 text-kiosk-xs text-ink-500">{description}</p>
      </div>
    </div>
  );
}

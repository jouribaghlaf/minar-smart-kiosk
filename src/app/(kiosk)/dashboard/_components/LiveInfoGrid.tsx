"use client";

import { useEffect, useState } from "react";
import { Users, Clock, TrainFront, HeartPulse, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { getCrowdLabelInfo } from "@/lib/utils/crowdLabel";
import type { CrowdLevel, HealthCenter, TrainStation } from "@/types/navigation";

interface LiveData {
  tawafLevel: CrowdLevel | null;
  nearestStation: TrainStation | null;
  nearestHealthCenter: HealthCenter | null;
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-card border border-cream-200 bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 text-ink-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-kiosk-xs">{label}</span>
      </div>
      <div className="mt-2 text-kiosk-sm font-bold text-ink-900">{value}</div>
      {sub && <p className="mt-0.5 text-[0.7rem] text-ink-300">{sub}</p>}
    </div>
  );
}

export function LiveInfoGrid() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<LiveData>({
    tawafLevel: null,
    nearestStation: null,
    nearestHealthCenter: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/crowd?destination=TAWAF", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/navigation/stations", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([crowdData, stationsData]) => {
        if (cancelled) return;
        const levels: CrowdLevel[] = crowdData?.levels ?? [];
        const recommended = levels.find((l) => l.isRecommended) ?? levels[0] ?? null;
        setData({
          tawafLevel: recommended,
          nearestStation: stationsData?.trainStations?.[0] ?? null,
          nearestHealthCenter: stationsData?.healthCenters?.[0] ?? null,
        });
      })
      .catch(() => {
        /* Non-fatal — tiles just keep their placeholder dash. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const crowdInfo = data.tawafLevel ? getCrowdLabelInfo(data.tawafLevel.crowdLabel) : null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile
        icon={Users}
        label={t("حالة الازدحام", "Crowd Level")}
        value={
          crowdInfo ? (
            <StatusBadge label={language === "AR" ? crowdInfo.ar : crowdInfo.en} tone={crowdInfo.tone} />
          ) : (
            "—"
          )
        }
      />
      <StatTile
        icon={Clock}
        label={t("أفضل وقت للطواف", "Best Tawaf Time")}
        value={data.tawafLevel ? t(data.tawafLevel.levelName, data.tawafLevel.levelName) : "—"}
        sub={
          data.tawafLevel
            ? t(`وقت الانتظار: ${data.tawafLevel.waitMinutes} دقيقة`, `Wait: ${data.tawafLevel.waitMinutes} min`)
            : undefined
        }
      />
      <StatTile
        icon={TrainFront}
        label={t("أقرب محطة قطار", "Nearest Train Station")}
        value={data.nearestStation?.name ?? "—"}
        sub={
          data.nearestStation
            ? t(`${(data.nearestStation.distanceMeters / 1000).toFixed(1)} كم`, `${(data.nearestStation.distanceMeters / 1000).toFixed(1)} km`)
            : undefined
        }
      />
      <StatTile
        icon={HeartPulse}
        label={t("أقرب مركز صحي", "Nearest Health Center")}
        value={data.nearestHealthCenter?.name ?? "—"}
        sub={data.nearestHealthCenter ? t(`${data.nearestHealthCenter.distanceMeters} متر`, `${data.nearestHealthCenter.distanceMeters} m`) : undefined}
      />
    </div>
  );
}

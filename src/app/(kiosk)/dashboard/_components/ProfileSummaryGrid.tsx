"use client";

import { User, Users, Tent } from "lucide-react";
import { InfoRowsCard } from "@/components/cards/InfoRowsCard";
import { ContactCard } from "@/components/cards/ContactCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

export function ProfileSummaryGrid({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t, language } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InfoRowsCard
        title={t("معلوماتك", "Your Information")}
        icon={User}
        rows={[
          { label: t("الجنسية", "Nationality"), value: pilgrim.nationality },
          {
            label: t("لغة النظام", "System language"),
            value: pilgrim.systemLanguage === "AR" ? t("العربية", "Arabic") : t("English", "English"),
          },
          {
            label: t("تاريخ الوصول", "Arrival date"),
            value: formatDate(pilgrim.arrivalDateGregorian, language === "AR" ? "ar-SA" : "en-US"),
          },
        ]}
      />

      <InfoRowsCard
        title={t("معلومات الحملة", "Campaign Information")}
        icon={Users}
        rows={[
          { label: t("اسم الحملة", "Campaign name"), value: pilgrim.campaign.name },
          { label: t("رقم الحملة", "Campaign number"), value: pilgrim.campaign.campaignNumber },
        ]}
      />

      <InfoRowsCard
        title={t("معلومات المخيم", "Camp Information")}
        icon={Tent}
        rows={[
          { label: t("رقم المخيم", "Camp number"), value: pilgrim.camp.number },
          { label: t("موقع المخيم", "Camp location"), value: pilgrim.camp.location },
        ]}
      />

      <ContactCard
        name={pilgrim.campaign.supervisor.name}
        role={t("مشرف الحملة", "Campaign Supervisor")}
        phone={pilgrim.campaign.supervisor.phone}
      />
    </div>
  );
}

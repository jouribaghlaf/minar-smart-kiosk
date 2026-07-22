"use client";

import Link from "next/link";
import { Building2, BusFront, Hotel, Route, TentTree, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

function DetailCard({ icon: Icon, title, rows }: { icon: typeof Building2; title: string; rows: { label: string; value: string }[] }) {
  return <div className="rounded-card border border-gold-100 bg-white p-5 shadow-card">
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-6 w-6" /></span><h2 className="text-kiosk-sm font-bold text-brand-900">{title}</h2></div>
    <dl className="mt-4 grid gap-3">{rows.map((row) => <div key={row.label}><dt className="text-sm font-semibold text-ink-500">{row.label}</dt><dd className="mt-0.5 font-bold text-ink-900">{row.value}</dd></div>)}</dl>
  </div>;
}

export function ProfileSummaryGrid({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t } = useLanguage();
  return <section>
    <h2 className="mb-4 text-kiosk-lg font-bold text-brand-900">{t("تفاصيل برنامجك وإقامتك", "Your program and stay")}</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <DetailCard icon={Route} title={t("البرنامج", "Program")} rows={[{ label: t("اسم البرنامج", "Program name"), value: pilgrim.program }, { label: t("رقم الضيف", "Guest number"), value: pilgrim.pilgrimNumber }]} />
      <DetailCard icon={Users} title={t("شركة مقدم الخدمة", "Service provider")} rows={[{ label: t("الشركة", "Company"), value: pilgrim.serviceProvider }, { label: t("المشرف", "Supervisor"), value: pilgrim.campaign.supervisor.name }]} />
      <Link href="/navigation?destination=HOTEL" className="rounded-card border border-gold-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-card-hover">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><Hotel className="h-6 w-6" /></span><div><h2 className="text-kiosk-sm font-bold text-brand-900">{t("الفندق", "Hotel")}</h2><p className="text-sm text-brand-700">{t("اضغط لفتح الملاحة", "Tap to navigate")}</p></div></div>
        <p className="mt-4 font-bold text-ink-900">{pilgrim.hotel.name} — {pilgrim.hotel.rating} {t("نجوم", "stars")}</p>
        <p className="mt-2 text-sm text-status-good">{pilgrim.hotel.nearPublicServices ? t("قريب من الخدمات العامة", "Near public services") : t("بعيد عن الخدمات العامة", "Away from public services")}</p>
      </Link>
      <Link href="/navigation?destination=CAMP" className="rounded-card border border-gold-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-card-hover">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><TentTree className="h-6 w-6" /></span><div><h2 className="text-kiosk-sm font-bold text-brand-900">{t("مخيم منى", "Mina camp")}</h2><p className="text-sm text-brand-700">{t("اضغط لفتح الموقع", "Tap to open location")}</p></div></div>
        <p className="mt-4 font-bold text-ink-900">{t("المخيم", "Camp")} {pilgrim.camp.number} — {t("الفئة", "Category")} {pilgrim.camp.category}</p><p className="mt-2 text-sm text-ink-500">{pilgrim.camp.location}</p>
      </Link>
      <DetailCard icon={BusFront} title={t("النقل في عرفة", "Transport in Arafat")} rows={[{ label: t("وسيلة النقل", "Transport mode"), value: pilgrim.arafatTransport }, { label: t("الحالة", "Status"), value: t("مؤكد ضمن البرنامج", "Confirmed in program") }]} />
      <DetailCard icon={Building2} title={t("بيانات الحملة", "Campaign details")} rows={[{ label: t("اسم الحملة", "Campaign"), value: pilgrim.campaign.name }, { label: t("رقم الحملة", "Campaign number"), value: pilgrim.campaign.campaignNumber }]} />
    </div>
  </section>;
}

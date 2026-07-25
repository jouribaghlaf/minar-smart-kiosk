"use client";

import Link from "next/link";
import { Building2, BusFront, Hotel, MapPinned, Route, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";

type Row = { label: string; value: string };

function DetailCard({ icon: Icon, title, rows, wide = false }: { icon: typeof Building2; title: string; rows: Row[]; wide?: boolean }) {
  return <article className={`rounded-card border border-gold-100 bg-white p-5 shadow-card ${wide ? "sm:col-span-2 xl:col-span-4" : ""}`}>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-6 w-6" /></span><h3 className="text-kiosk-sm font-bold text-brand-900">{title}</h3></div>
    <dl className={`mt-4 grid gap-3 ${wide ? "sm:grid-cols-2 xl:grid-cols-4" : ""}`}>{rows.map((row) => <div key={row.label} className="rounded-2xl bg-cream-100 p-3"><dt className="text-sm font-semibold text-ink-500">{row.label}</dt><dd className="mt-1 font-bold text-ink-900">{row.value}</dd></div>)}</dl>
  </article>;
}

function CampsCard({ pilgrim, t }: { pilgrim: Pilgrim; t: (ar: string, en: string) => string }) {
  const camps = [
    { title: t("منى", "Mina"), data: pilgrim.minaCamp },
    { title: t("عرفة", "Arafat"), data: pilgrim.arafatCamp },
  ];
  return <article className="rounded-card border border-gold-100 bg-white p-5 shadow-card">
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><MapPinned className="h-6 w-6" /></span><h3 className="text-kiosk-sm font-bold text-brand-900">{t("مخيمات المشاعر", "Holy sites camps")}</h3></div>
    <div className="mt-4 grid grid-cols-2 gap-3">{camps.map((camp) => <div key={camp.title} className="rounded-2xl border border-gold-100 bg-cream-100 p-4"><h4 className="font-bold text-brand-900">{camp.title}</h4><p className="mt-2 text-sm text-ink-500">{t("شاخص الموقع", "Site number")}</p><p className="font-bold">{camp.data.siteNumber}</p><p className="mt-2 text-sm font-semibold text-ink-700">{t("الفئة", "Category")} {camp.data.category} · {t("المنطقة", "Zone")} {camp.data.zone}</p></div>)}</div>
  </article>;
}

export function ProfileSummaryGrid({ pilgrim }: { pilgrim: Pilgrim }) {
  const { t } = useLanguage();
  const transportRows: Row[] = [
    { label: t("المطار", "Airport"), value: pilgrim.transportPlan.airport },
    { label: t("مكة ← المدينة", "Makkah → Madinah"), value: pilgrim.transportPlan.makkahToMadinah },
    { label: t("المدينة ← مكة", "Madinah → Makkah"), value: pilgrim.transportPlan.madinahToMakkah },
    { label: t("مكة ← منى", "Makkah → Mina"), value: pilgrim.transportPlan.makkahToMina },
    { label: t("منى ← عرفة", "Mina → Arafat"), value: pilgrim.transportPlan.minaToArafat },
    { label: t("عرفة ← مزدلفة", "Arafat → Muzdalifah"), value: pilgrim.transportPlan.arafatToMuzdalifah },
    { label: t("مزدلفة ← منى", "Muzdalifah → Mina"), value: pilgrim.transportPlan.muzdalifahToMina },
    { label: t("منى ← مكة", "Mina → Makkah"), value: pilgrim.transportPlan.minaToMakkah },
  ];

  return <section>
    <h2 className="mb-4 text-kiosk-lg font-bold text-brand-900">{t("بيانات برنامج الحاج", "Pilgrim program details")}</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DetailCard icon={Route} title={t("البرنامج", "Program")} rows={[
        { label: t("اسم البرنامج", "Program name"), value: pilgrim.program },
        { label: t("المسار", "Track"), value: pilgrim.programRoute },
        { label: t("رقم الضيف", "Guest number"), value: pilgrim.pilgrimNumber },
        { label: t("الخدمات الإضافية", "Additional services"), value: pilgrim.additionalServices.join("، ") },
      ]} />

      <DetailCard icon={Users} title={t("شركة مقدم الخدمة", "Service provider")} rows={[
        { label: t("اسم الشركة", "Company"), value: pilgrim.serviceProvider },
        { label: t("رقم المركز", "Center number"), value: pilgrim.serviceCenterNumber },
        { label: t("اسم المشرف", "Supervisor"), value: pilgrim.campaign.supervisor.name },
        { label: t("التواصل مع المشرف", "Supervisor contact"), value: pilgrim.campaign.supervisor.phone },
      ]} />

      <Link href="/navigation?destination=HOTEL" className="rounded-card border border-gold-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-card-hover">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><Hotel className="h-6 w-6" /></span><div><h3 className="text-kiosk-sm font-bold text-brand-900">{t("الفندق", "Hotel")}</h3><p className="text-sm font-semibold text-brand-700">{t("اضغط لفتح الخريطة", "Tap to open map")}</p></div></div>
        <dl className="mt-4 grid gap-3"><div><dt className="text-sm text-ink-500">{t("اسم الفندق", "Hotel name")}</dt><dd className="font-bold">{pilgrim.hotel.name}</dd></div><div><dt className="text-sm text-ink-500">{t("التصنيف", "Rating")}</dt><dd className="font-bold">{pilgrim.hotel.rating} {t("نجوم", "stars")}</dd></div><div className="flex items-center gap-2 text-status-good"><Sparkles className="h-4 w-4" /><dd className="font-semibold">{t("قريب من الخدمات العامة", "Near public services")}</dd></div></dl>
      </Link>

      <CampsCard pilgrim={pilgrim} t={t} />
      <DetailCard icon={BusFront} title={t("بطاقة وسائل النقل", "Transport card")} rows={transportRows} wide />
    </div>
  </section>;
}

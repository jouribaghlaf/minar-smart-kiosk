"use client";

import { useState } from "react";
import { Building2, CheckCircle2, HeartPulse, Hotel, MapPinned, Pill, Store, TentTree, UtensilsCrossed, UserRoundSearch } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Pilgrim } from "@/types/pilgrim";
import type { DestinationType } from "@/types/navigation";

const POPULAR: { destination: DestinationType; ar: string; en: string; icon: typeof Store }[] = [
  { destination: "MALL", ar: "مكة مول", en: "Makkah Mall", icon: Store },
  { destination: "RESTAURANTS", ar: "مطاعم حول الحرم", en: "Restaurants near Haram", icon: UtensilsCrossed },
  { destination: "HEALTH_CENTER", ar: "المستشفيات", en: "Hospitals", icon: HeartPulse },
  { destination: "PHARMACY", ar: "الصيدليات", en: "Pharmacies", icon: Pill },
  { destination: "HARAM", ar: "المسجد الحرام", en: "Grand Mosque", icon: Building2 },
  { destination: "HOTEL", ar: "الفندق", en: "Hotel", icon: Hotel },
  { destination: "CAMP", ar: "المخيم", en: "Camp", icon: TentTree },
];

export function GuidanceSearchPanel({ pilgrim, onSelect }: { pilgrim: Pilgrim | null; onSelect: (destination: DestinationType) => void }) {
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [requested, setRequested] = useState(false);
  const provider = pilgrim?.serviceProvider ?? t("فريق الإرشاد الميداني", "Field guidance team");
  return <section className="grid gap-5 rounded-[2rem] border border-gold-100 bg-white p-6 shadow-card lg:grid-cols-[1fr_300px]">
    <div><div className="flex items-center gap-3"><MapPinned className="h-7 w-7 text-brand-700" /><h2 className="text-kiosk-lg font-bold text-brand-900">{t("البحث الأكثر شيوعًا", "Popular searches")}</h2></div><div className="mt-4 flex flex-wrap gap-3">{POPULAR.map((item) => <button key={item.destination} type="button" onClick={() => onSelect(item.destination)} className="flex min-h-12 items-center gap-2 rounded-2xl border border-cream-300 bg-cream-100 px-4 font-bold text-ink-700 hover:border-gold-400 hover:bg-gold-100"><item.icon className="h-5 w-5 text-brand-700" />{t(item.ar, item.en)}</button>)}</div></div>
    <div className="rounded-[1.5rem] bg-brand-900 p-5 text-white"><UserRoundSearch className="h-8 w-8 text-gold-400" /><h3 className="mt-3 text-kiosk-sm font-bold">{t("هل تحتاج مرشدًا؟", "Need a guide?")}</h3><p className="mt-1 text-sm text-white/65">{t(`سيُرسل الطلب إلى ${provider}`, `The request will be sent to ${provider}`)}</p><button type="button" onClick={() => setConfirming(true)} className="mt-4 h-12 w-full rounded-2xl bg-gold-500 font-bold text-brand-900">{t("طلب مرشد", "Request a guide")}</button></div>
    {confirming && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/80 p-5"><div className="w-full max-w-lg rounded-[2rem] bg-white p-7 text-center shadow-2xl">{requested ? <><CheckCircle2 className="mx-auto h-14 w-14 text-status-good" /><h3 className="mt-4 text-kiosk-lg font-bold">{t("تم إرسال طلب المرشد", "Guide request sent")}</h3><p className="mt-2 text-ink-500">{t(`تم توجيه الطلب إلى ${provider}. الوقت المتوقع 6 دقائق.`, `Sent to ${provider}. Estimated arrival: 6 minutes.`)}</p><button onClick={() => { setConfirming(false); setRequested(false); }} className="mt-6 h-touch w-full rounded-2xl bg-brand-700 font-bold text-white">{t("تم", "Done")}</button></> : <><h3 className="text-kiosk-lg font-bold text-brand-900">{t("تأكيد طلب مرشد", "Confirm guide request")}</h3><p className="mt-2 text-ink-500">{t(`هل تريد إرسال موقعك وطلب مرشد من ${provider}؟`, `Share your location and request a guide from ${provider}?`)}</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setConfirming(false)} className="h-touch rounded-2xl border-2 border-brand-700 font-bold text-brand-700">{t("إلغاء", "Cancel")}</button><button onClick={() => setRequested(true)} className="h-touch rounded-2xl bg-brand-700 font-bold text-white">{t("تأكيد الطلب", "Confirm request")}</button></div></>}</div></div>}
  </section>;
}

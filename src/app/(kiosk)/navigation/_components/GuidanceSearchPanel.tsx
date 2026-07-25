"use client";

import { useState } from "react";
import { Building2, CheckCircle2, HeartPulse, Hotel, MapPinned, Pill, Search, Store, UtensilsCrossed, UserRoundSearch } from "lucide-react";
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
];

export function GuidanceSearchPanel({ pilgrim, onSelect }: { pilgrim: Pilgrim | null; onSelect: (destination: DestinationType) => void }) {
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [requested, setRequested] = useState(false);
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [guideReason, setGuideReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const provider = pilgrim?.serviceProvider ?? t("فريق الإرشاد الميداني", "Field guidance team");
  const selectedReason = guideReason === "OTHER" ? otherReason.trim() : guideReason;
  const search = () => {
    const value = query.trim().toLowerCase();
    const match = [
      { keys: ["الحرم", "المسجد الحرام", "haram", "grand mosque"], destination: "HARAM" as const },
      { keys: ["فندق", "الفندق", "hotel", "hyatt"], destination: "HOTEL" as const },
      { keys: ["صيدلية", "الصيدليات", "pharmacy"], destination: "PHARMACY" as const },
      { keys: ["مستشفى", "مركز صحي", "hospital", "health"], destination: "HEALTH_CENTER" as const },
      { keys: ["مطعم", "مطاعم", "restaurant"], destination: "RESTAURANTS" as const },
      { keys: ["مول", "مكة مول", "mall"], destination: "MALL" as const },
      { keys: ["دورة مياه", "حمام", "restroom", "toilet"], destination: "RESTROOM" as const },
      { keys: ["طواف", "tawaf"], destination: "TAWAF" as const },
      { keys: ["سعي", "sai"], destination: "SAI" as const },
    ].find((item) => item.keys.some((key) => value.includes(key)));
    setSearchError(!match);
    if (match) onSelect(match.destination);
  };
  return <section className="grid gap-5 rounded-[1.5rem] border border-gold-100 bg-white p-4 shadow-card sm:rounded-[2rem] sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
    <div className="min-w-0"><div className="flex items-center gap-3"><MapPinned className="h-7 w-7 shrink-0 text-brand-700" /><h2 className="text-kiosk-lg font-bold text-brand-900">{t("ابحث عن وجهتك على الخريطة", "Search for a destination on the map")}</h2></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={query} onChange={(event) => { setQuery(event.target.value); setSearchError(false); }} onKeyDown={(event) => { if (event.key === "Enter") search(); }} placeholder={t("اكتب اسم الوجهة، مثل المسجد الحرام أو صيدلية", "Enter a destination, such as Grand Mosque or pharmacy")} className="h-touch min-w-0 flex-1 rounded-2xl border-2 border-cream-300 bg-cream-100 px-4 text-kiosk-xs outline-none focus:border-brand-700" /><button type="button" onClick={search} disabled={!query.trim()} className="flex h-touch shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 font-bold text-white disabled:opacity-50"><Search className="h-5 w-5" />{t("بحث", "Search")}</button></div>{searchError && <p className="mt-2 text-sm font-semibold text-emergency">{t("لم نجد الوجهة تجريبيًا. جرّب اسم معلم أو خدمة قريبة.", "Destination not found in the demo. Try a landmark or nearby service.")}</p>}<h3 className="mt-5 font-bold text-brand-900">{t("البحث الأكثر شيوعًا", "Popular searches")}</h3><div className="mt-3 flex flex-wrap gap-2 sm:gap-3">{POPULAR.map((item) => <button key={item.destination} type="button" onClick={() => onSelect(item.destination)} className="flex min-h-12 items-center gap-2 rounded-2xl border border-cream-300 bg-cream-100 px-3 font-bold text-ink-700 hover:border-gold-400 hover:bg-gold-100 sm:px-4"><item.icon className="h-5 w-5 text-brand-700" />{t(item.ar, item.en)}</button>)}</div></div>
    <div className="rounded-[1.5rem] bg-brand-900 p-5 text-white"><UserRoundSearch className="h-8 w-8 text-gold-400" /><h3 className="mt-3 text-kiosk-sm font-bold">{t("هل تحتاج مرشدًا؟", "Need a guide?")}</h3><p className="mt-1 text-sm text-white/65">{t(`سيُرسل الطلب إلى ${provider}`, `The request will be sent to ${provider}`)}</p><button type="button" onClick={() => setConfirming(true)} className="mt-4 h-12 w-full rounded-2xl bg-gold-500 font-bold text-brand-900">{t("طلب مرشد", "Request a guide")}</button></div>
    {confirming && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/80 p-5"><div className="w-full max-w-lg rounded-[2rem] bg-white p-7 text-center shadow-2xl">{requested ? <><CheckCircle2 className="mx-auto h-14 w-14 text-status-good" /><h3 className="mt-4 text-kiosk-lg font-bold">{t("تم إرسال طلب المرشد", "Guide request sent")}</h3><p className="mt-2 font-semibold text-brand-900">{t("سبب الطلب", "Request reason")}: {selectedReason}</p><p className="mt-2 text-ink-500">{t(`تم توجيه الطلب إلى ${provider}. الوقت المتوقع 6 دقائق.`, `Sent to ${provider}. Estimated arrival: 6 minutes.`)}</p><button onClick={() => { setConfirming(false); setRequested(false); setGuideReason(""); setOtherReason(""); }} className="mt-6 h-touch w-full rounded-2xl bg-brand-700 font-bold text-white">{t("تم", "Done")}</button></> : <><h3 className="text-kiosk-lg font-bold text-brand-900">{t("تحديد سبب طلب المرشد", "Select guide request reason")}</h3><p className="mt-2 text-ink-500">{t(`اختر سبب الطلب قبل إرسال موقعك إلى ${provider}.`, `Choose a reason before sharing your location with ${provider}.`)}</p><label className="mt-5 block text-start"><span className="font-bold text-brand-900">{t("المرشد مطلوب من أجل", "Guide needed for")}</span><select value={guideReason} onChange={(event) => { setGuideReason(event.target.value); setOtherReason(""); }} className="mt-2 h-touch w-full rounded-2xl border-2 border-cream-300 bg-cream-100 px-4 outline-none focus:border-brand-700"><option value="">{t("اختر السبب", "Select reason")}</option><option>{t("الوصول إلى الفندق", "Reaching the hotel")}</option><option>{t("الوصول إلى مخيم منى", "Reaching Mina camp")}</option><option>{t("الوصول إلى مخيم عرفة", "Reaching Arafat camp")}</option><option>{t("الوصول إلى المسجد الحرام", "Reaching the Grand Mosque")}</option><option>{t("مساعدة شخص تائه", "Assisting a lost person")}</option><option value="OTHER">{t("أخرى", "Other")}</option></select></label>{guideReason === "OTHER" && <label className="mt-4 block text-start"><span className="font-bold text-brand-900">{t("اكتب سبب الطلب", "Enter the request reason")}</span><textarea value={otherReason} onChange={(event) => setOtherReason(event.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border-2 border-cream-300 bg-cream-100 p-4 outline-none focus:border-brand-700" placeholder={t("اشرح نوع المساعدة المطلوبة", "Describe the help needed")} /></label>}<div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => { setConfirming(false); setGuideReason(""); setOtherReason(""); }} className="h-touch rounded-2xl border-2 border-brand-700 font-bold text-brand-700">{t("إلغاء", "Cancel")}</button><button disabled={!selectedReason} onClick={() => setRequested(true)} className="h-touch rounded-2xl bg-brand-700 font-bold text-white disabled:opacity-40">{t("إرسال الطلب", "Send request")}</button></div></>}</div></div>}
  </section>;
}

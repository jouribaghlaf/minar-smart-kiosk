"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, CheckCircle2, ExternalLink, Loader2, MapPin, Mic, Printer, RotateCcw, Star, Volume2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SERVICE_CATALOG, type ServiceField } from "@/lib/mock-data/serviceCatalog";
import { getReligiousGuideTopic, type ReligiousGuideTopic } from "@/lib/mock-data/religiousGuideContent";

type FormValues = Record<string, string>;

export default function ServiceWorkflowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { t, language } = useLanguage();
  const definition = SERVICE_CATALOG[slug];
  const storageKey = `minar_form_${slug}`;
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) { try { setValues(JSON.parse(stored) as FormValues); } catch { /* ignore invalid draft */ } }
  }, [storageKey]);
  useEffect(() => { if (Object.keys(values).length) window.sessionStorage.setItem(storageKey, JSON.stringify(values)); }, [storageKey, values]);

  const requiredMissing = useMemo(() => definition?.fields.filter((field) => field.required && !values[field.id]?.trim()) ?? [], [definition, values]);
  const selectedGuideTopic = slug === "religious-guide" ? getReligiousGuideTopic(values.topic) : undefined;
  const spokenResult = selectedGuideTopic
    ? [t(selectedGuideTopic.titleAr, selectedGuideTopic.titleEn), ...selectedGuideTopic.sections.flatMap((section) => [t(section.headingAr, section.headingEn), ...(language === "AR" ? section.itemsAr : section.itemsEn)])].join(". ")
    : t(definition?.successAr ?? "", definition?.successEn ?? "");
  if (!definition) return <div className="m-auto rounded-card bg-white p-8 text-center"><h1 className="text-kiosk-xl font-bold">{t("الخدمة غير متاحة", "Service unavailable")}</h1><button onClick={() => router.push("/services")} className="mt-5 h-touch rounded-2xl bg-brand-700 px-7 font-bold text-white">{t("العودة للخدمات", "Back to services")}</button></div>;

  const update = (id: string, value: string) => { setValues((current) => ({ ...current, [id]: value })); setErrors((current) => ({ ...current, [id]: "" })); };
  const next = () => {
    if (requiredMissing.length) { setErrors(Object.fromEntries(requiredMissing.map((field) => [field.id, t("هذا الحقل مطلوب", "This field is required")]))); return; }
    if (slug === "religious-guide") {
      setStep(3);
      window.sessionStorage.removeItem(storageKey);
      return;
    }
    setStep(2);
  };
  const submit = () => {
    setIsSubmitting(true);
    window.setTimeout(() => { setIsSubmitting(false); setStep(3); window.sessionStorage.removeItem(storageKey); }, 900);
  };
  const reset = () => { setStep(1); setValues({}); setErrors({}); setRating(0); window.sessionStorage.removeItem(storageKey); };

  return <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-5 pb-28 sm:p-8">
    <section className="rounded-[2rem] bg-brand-900 p-7 text-white sm:p-9">
      <p className="text-kiosk-xs font-semibold text-gold-400">{t("خدمة تجريبية ذكية", "Smart demo service")}</p>
      <h1 className="mt-2 text-kiosk-2xl font-bold">{t(definition.titleAr, definition.titleEn)}</h1>
      <p className="mt-2 max-w-3xl text-kiosk-sm text-white/65">{t(definition.introAr, definition.introEn)}</p>
      <div className="mt-6 grid grid-cols-3 gap-2" aria-label={t("مؤشر الخطوات", "Step progress")}>
        {[1, 2, 3].map((number) => <div key={number} className={`rounded-full py-2 text-center text-sm font-bold ${step >= number ? "bg-gold-500 text-brand-900" : "bg-white/10 text-white/50"}`}>{number}. {number === 1 ? t("البيانات", "Details") : number === 2 ? t("التأكيد", "Confirm") : t("النتيجة", "Result")}</div>)}
      </div>
    </section>

    {step === 1 && <section className="rounded-[2rem] border border-cream-300 bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6 flex flex-wrap gap-3"><button type="button" onClick={() => { const target = definition.fields.find((field) => field.type === "textarea"); if (target) update(target.id, t("تم إدخال وصف صوتي تجريبي للحالة", "A demo voice description was captured")); }} className="flex h-12 items-center gap-2 rounded-2xl bg-gold-100 px-4 font-semibold text-gold-600"><Mic className="h-5 w-5" />{t("إدخال صوتي", "Voice input")}</button>{definition.fields.some((field) => field.id === "location") && <button type="button" onClick={() => update("location", t("المسجد الحرام — بوابة الملك فهد", "Grand Mosque — King Fahd Gate"))} className="flex h-12 items-center gap-2 rounded-2xl bg-brand-100 px-4 font-semibold text-brand-700"><MapPin className="h-5 w-5" />{t("تحديد موقعي", "Detect location")}</button>}</div>
      <div className="grid gap-5 sm:grid-cols-2">{definition.fields.map((field) => <Field key={field.id} field={field} value={values[field.id] ?? ""} error={errors[field.id]} update={update} t={t} language={language} />)}</div>
      <button type="button" onClick={next} className="mt-7 h-touch w-full rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-bold text-white hover:bg-brand-600">{slug === "religious-guide" ? t("عرض المحتوى", "Show content") : t("مراجعة الطلب", "Review request")}</button>
    </section>}

    {step === 2 && <section className="rounded-[2rem] border border-cream-300 bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-kiosk-lg font-bold text-brand-900">{t("راجع البيانات قبل الإرسال", "Review before submitting")}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{definition.fields.filter((field) => values[field.id]).map((field) => <div key={field.id} className="rounded-2xl bg-cream-100 p-4"><p className="text-sm font-semibold text-ink-500">{t(field.labelAr, field.labelEn)}</p><p className="mt-1 font-bold text-ink-900">{field.type === "file" ? values[field.id] : values[field.id]}</p></div>)}</div>
      <div className="mt-6 rounded-2xl border border-gold-400/40 bg-gold-100 p-4 text-kiosk-xs text-ink-700">{t("بتأكيد الإرسال سيتم إنشاء طلب تجريبي وإظهاره للمتابعة. لن تُرسل البيانات لأي جهة خارجية.", "Confirming creates a demo request for tracking. No data is sent externally.")}</div>
      <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setStep(1)} className="h-touch rounded-2xl border-2 border-brand-700 font-bold text-brand-700">{t("تعديل البيانات", "Edit details")}</button><button type="button" disabled={isSubmitting} onClick={submit} className="flex h-touch items-center justify-center gap-2 rounded-2xl bg-brand-700 font-bold text-white disabled:opacity-60">{isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}{t("تأكيد وإرسال", "Confirm and submit")}</button></div>
    </section>}

    {step === 3 && <section className="rounded-[2rem] border border-status-good/30 bg-white p-7 text-center shadow-card sm:p-10">
      <CheckCircle2 className="mx-auto h-16 w-16 text-status-good" /><h2 className="mt-4 text-kiosk-xl font-bold text-brand-900">{t(definition.successAr, definition.successEn)}</h2>
      {selectedGuideTopic ? <ReligiousGuideResult topic={selectedGuideTopic} t={t} language={language} /> : <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">{(language === "AR" ? definition.mockResultAr : definition.mockResultEn).map((result) => <div key={result} className="rounded-2xl bg-status-goodBg p-4 text-kiosk-xs font-semibold text-ink-700">{result}</div>)}</div>}
      <div className="mt-7"><p className="text-kiosk-xs font-semibold">{t("قيّم التجربة", "Rate the experience")}</p><div className="mt-2 flex justify-center gap-2">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value}`} className="min-h-0 p-1"><Star className={`h-8 w-8 ${rating >= value ? "fill-gold-500 text-gold-500" : "text-cream-300"}`} /></button>)}</div>{rating > 0 && <p className="mt-2 text-sm text-status-good">{t("شكرًا لتقييمك", "Thank you for your rating")}</p>}</div>
      <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => window.print()} className="flex h-12 items-center gap-2 rounded-2xl border border-brand-700 px-5 font-bold text-brand-700"><Printer className="h-5 w-5" />{t("طباعة", "Print")}</button><button type="button" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(spokenResult))} className="flex h-12 items-center gap-2 rounded-2xl border border-brand-700 px-5 font-bold text-brand-700"><Volume2 className="h-5 w-5" />{t("قراءة صوتية", "Read aloud")}</button><button type="button" onClick={reset} className="flex h-12 items-center gap-2 rounded-2xl bg-brand-700 px-5 font-bold text-white"><RotateCcw className="h-5 w-5" />{t("طلب جديد", "New request")}</button></div>
    </section>}
  </div>;
}

function ReligiousGuideResult({ topic, t, language }: { topic: ReligiousGuideTopic; t: (ar: string, en: string) => string; language: "AR" | "EN" }) {
  return <div className="mx-auto mt-6 max-w-4xl text-start">
    <div className="rounded-[1.5rem] border border-gold-200 bg-gold-100 p-5">
      <div className="flex items-center gap-3 text-brand-900"><BookOpenText className="h-7 w-7 text-gold-600" /><h3 className="text-kiosk-lg font-bold">{t(topic.titleAr, topic.titleEn)}</h3></div>
      <p className="mt-2 text-kiosk-xs leading-relaxed text-ink-700">{t(topic.introAr, topic.introEn)}</p>
    </div>
    <div className="mt-5 grid gap-4">
      {topic.sections.map((section) => <article key={section.headingEn} className="rounded-[1.5rem] border border-cream-300 bg-cream-100 p-5 sm:p-6">
        <h4 className="text-kiosk-sm font-bold text-brand-900">{t(section.headingAr, section.headingEn)}</h4>
        <ul className="mt-3 grid gap-2 text-kiosk-xs leading-relaxed text-ink-700">
          {(language === "AR" ? section.itemsAr : section.itemsEn).map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-500" /><span>{item}</span></li>)}
        </ul>
      </article>)}
    </div>
    <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-kiosk-xs text-brand-900">
      <p>{t("هذا محتوى إرشادي مختصر. للأحكام التفصيلية راجع جهة فتوى معتمدة، واتبع تعليمات الجهات المنظمة.", "This is concise guidance. For detailed rulings, consult an authorized scholar and follow official instructions.")}</p>
      <a href={topic.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-bold text-brand-700 underline"><ExternalLink className="h-4 w-4" />{t("عرض المصدر الرسمي", "View official source")}</a>
    </div>
  </div>;
}

function Field({ field, value, error, update, t, language }: { field: ServiceField; value: string; error?: string; update: (id: string, value: string) => void; t: (ar: string, en: string) => string; language: "AR" | "EN" }) {
  const common = "mt-2 min-h-14 w-full rounded-2xl border-2 border-cream-300 bg-cream-100 px-4 text-kiosk-xs outline-none focus:border-brand-600";
  const label = t(field.labelAr, field.labelEn);
  const options = language === "AR" ? field.optionsAr : field.optionsEn;
  return <label className={field.type === "textarea" ? "sm:col-span-2" : ""}><span className="font-semibold text-ink-700">{label}{field.required && <span className="text-emergency"> *</span>}</span>
    {field.type === "textarea" ? <textarea value={value} onChange={(event) => update(field.id, event.target.value)} placeholder={t(field.placeholderAr ?? "اكتب التفاصيل", field.placeholderEn ?? "Enter details")} className={`${common} min-h-32 py-3`} /> : field.type === "select" ? <select value={value} onChange={(event) => update(field.id, event.target.value)} className={common}><option value="">{t("اختر", "Select")}</option>{options?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "file" ? <input type="file" accept="image/*,.pdf" onChange={(event) => update(field.id, event.target.files?.[0]?.name ?? "")} className={`${common} py-3`} /> : <input type={field.type} value={value} onChange={(event) => update(field.id, event.target.value)} placeholder={t(field.placeholderAr ?? "", field.placeholderEn ?? "")} className={common} />}
    {error && <span className="mt-1 block text-sm font-semibold text-emergency">{error}</span>}
  </label>;
}

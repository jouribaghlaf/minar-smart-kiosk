"use client";

import { useState } from "react";
import { Bot, CheckCircle2, ChevronLeft, FileWarning, MapPinned, PackageSearch, Sparkles, TicketCheck } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

const scenarios = [
  {
    id: "lost-item", icon: PackageSearch,
    titleAr: "الإبلاغ عن غرض مفقود", titleEn: "Report a lost item",
    requestAr: "أبغى أبلغ عن شنطة مفقودة", requestEn: "I want to report a lost bag",
    stepsAr: ["يسأل عن مكان ووقت الفقد", "يجمع وصف الغرض وصورته", "يتحقق من بيانات التواصل", "ينشئ البلاغ ويعرض رقمه"],
    stepsEn: ["Asks where and when it was lost", "Collects a description and photo", "Validates contact details", "Creates the report and shows its number"],
    resultAr: "تم إنشاء البلاغ بنجاح — رقم البلاغ: MNR-2841", resultEn: "Report created successfully — Reference: MNR-2841",
  },
  {
    id: "navigation", icon: MapPinned,
    titleAr: "الوصول إلى الفندق أو المخيم", titleEn: "Navigate to hotel or camp",
    requestAr: "وين فندقي؟", requestEn: "Where is my hotel?",
    stepsAr: ["يسترجع بيانات الفندق", "يحدد موقع المستخدم", "ينشئ أفضل مسار", "يعرض المسافة ووقت الوصول"],
    stepsEn: ["Retrieves hotel details", "Detects the user's location", "Creates the best route", "Shows distance and arrival time"],
    resultAr: "فندقك رافلز مكة — يبعد 1.2 كم، ووقت الوصول المتوقع 8 دقائق", resultEn: "Your hotel is Raffles Makkah — 1.2 km away, with an estimated travel time of 8 minutes",
  },
  {
    id: "complaint", icon: FileWarning,
    titleAr: "تقديم شكوى", titleEn: "Submit a complaint",
    requestAr: "أبغى أقدم شكوى", requestEn: "I want to submit a complaint",
    stepsAr: ["يحدد تصنيف الشكوى", "يجمع التفاصيل والمرفقات", "يطلب التأكيد قبل الإرسال", "يرسل الشكوى ويعرض رقمها"],
    stepsEn: ["Identifies the complaint category", "Collects details and attachments", "Requests confirmation before submission", "Submits and shows the reference"],
    resultAr: "تم إرسال الشكوى — الرقم المرجعي: CMP-7316", resultEn: "Complaint submitted — Reference: CMP-7316",
  },
  {
    id: "tracking", icon: TicketCheck,
    titleAr: "متابعة طلب أو بلاغ", titleEn: "Track a request or report",
    requestAr: "أبغى أتابع بلاغي", requestEn: "I want to track my report",
    stepsAr: ["يطلب الرقم المرجعي", "يتحقق من بيانات الطلب", "يجلب آخر تحديث", "يعرض الحالة والخطوة القادمة"],
    stepsEn: ["Requests the reference number", "Validates the request details", "Retrieves the latest update", "Shows status and the next step"],
    resultAr: "حالة البلاغ: قيد المعالجة — تم تحويله إلى الفريق المختص", resultEn: "Report status: In progress — assigned to the responsible team",
  },
];

export function AIAssistantDrawer() {
  const { activeDrawer, closeDrawer } = useDrawer();
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState(scenarios[0]!.id);
  const selected = scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0]!;
  const Icon = selected.icon;

  return (
    <Drawer isOpen={activeDrawer === "ai-assistant"} onClose={closeDrawer} widthClassName="max-w-4xl"
      title={t("مساعد مِنار الذكي", "Minar AI Assistant")} icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] bg-brand-900 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gold-500 text-brand-900"><Bot className="h-11 w-11" /></span>
            <div>
              <span className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-bold text-gold-300">{t("رؤية مستقبلية مدعومة بالذكاء الاصطناعي", "AI-powered future vision")}</span>
              <h3 className="text-kiosk-xl font-bold">{t("ينفّذ الخدمة عنك، وليس مجرد إجابة على الأسئلة", "Completes services for you, beyond answering questions")}</h3>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/75">{t("سيجمع مساعد مِنار البيانات المطلوبة خطوة بخطوة، ويتحقق منها، ثم ينفّذ الخدمة ويعرض نتيجتها داخل المحادثة.", "Minar will collect the required details step by step, validate them, complete the service, and show the result in the conversation.")}</p>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-gold-300 bg-gold-50 px-5 py-4 text-base leading-relaxed text-ink-700">
          <strong className="text-brand-900">{t("ملاحظة حول النموذج التجريبي: ", "Prototype note: ")}</strong>
          {t("تعرض هذه الشاشة تصورًا توضيحيًا لطريقة عمل المساعد. سيتم تفعيل المحادثة والتنفيذ الفعلي بعد ربط المنصة بمحرك الذكاء الاصطناعي وأنظمة الخدمات.", "This screen demonstrates how the assistant will work. Live conversation and execution will be enabled after connecting the platform to the AI engine and service systems.")}
        </div>

        <section>
          <h3 className="text-kiosk-lg font-bold text-brand-900">{t("ماذا يستطيع مساعد مِنار أن يفعل؟", "What will Minar Assistant do?")}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[t("فهم طلب المستخدم بلغته", "Understand the user's request in their language"), t("اختيار الخدمة المناسبة تلقائيًا", "Select the right service automatically"), t("جمع البيانات الناقصة والتحقق منها", "Collect and validate missing information"), t("تنفيذ الطلب وعرض الرقم المرجعي", "Complete the request and show its reference")].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-cream-100 p-4 text-base font-semibold text-ink-800"><CheckCircle2 className="h-6 w-6 shrink-0 text-brand-600" />{item}</div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-kiosk-lg font-bold text-brand-900">{t("شاهد كيف سينفّذ طلبك", "See how a request will be completed")}</h3>
          <p className="mt-1 text-ink-600">{t("اختر مثالًا لعرض رحلة التنفيذ التجريبية.", "Choose an example to preview the service journey.")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {scenarios.map((scenario) => {
              const ScenarioIcon = scenario.icon;
              const active = scenario.id === selected.id;
              return <button key={scenario.id} type="button" onClick={() => setSelectedId(scenario.id)}
                className={`flex min-h-20 items-center gap-4 rounded-2xl border-2 p-4 text-start transition ${active ? "border-gold-500 bg-gold-50 text-brand-900" : "border-cream-200 bg-white text-ink-700 hover:border-brand-300"}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${active ? "bg-gold-500" : "bg-cream-100"}`}><ScenarioIcon className="h-6 w-6" /></span>
                <strong className="flex-1 text-lg">{t(scenario.titleAr, scenario.titleEn)}</strong><ChevronLeft className="h-5 w-5 shrink-0" />
              </button>;
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-cream-200 bg-cream-50 p-5 sm:p-7">
          <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-gold-400"><Icon className="h-6 w-6" /></span><h3 className="text-kiosk-lg font-bold text-brand-900">{t(selected.titleAr, selected.titleEn)}</h3></div>
          <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm"><span className="text-sm font-bold text-ink-500">{t("مثال لطلب المستخدم", "Example user request")}</span><p className="mt-1 text-xl font-bold text-brand-900">«{t(selected.requestAr, selected.requestEn)}»</p></div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {selected.stepsAr.map((step, index) => <li key={step} className="flex items-start gap-3 rounded-2xl bg-white p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white">{index + 1}</span><span className="pt-1 font-semibold text-ink-700">{t(step, selected.stepsEn[index]!)}</span></li>)}
          </ol>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-900 p-5 text-white"><CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-gold-400" /><div><strong className="block text-gold-300">{t("النتيجة المتوقعة", "Expected result")}</strong><p className="mt-1 text-lg">{t(selected.resultAr, selected.resultEn)}</p></div></div>
        </section>
      </div>
    </Drawer>
  );
}

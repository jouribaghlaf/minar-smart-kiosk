"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, CheckCircle2, FileWarning, MapPinned, Mic, PackageSearch, Send, Sparkles, TicketCheck } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { ChatBubble } from "./_components/ChatBubble";
import type { ChatMessage } from "@/types/chat";

const examples = [
  {
    id: "lost-item", icon: PackageSearch,
    titleAr: "الإبلاغ عن غرض مفقود", titleEn: "Report a lost item",
    requestAr: "أبغى أبلغ عن شنطة مفقودة", requestEn: "I want to report a lost bag",
    answerAr: "سأساعدك في إنشاء البلاغ. سأطلب منك مكان ووقت الفقد، وصف الشنطة، صورة إن وجدت، وبيانات التواصل. بعد التحقق سأرسل البلاغ وأعرض لك رقمه المرجعي.",
    answerEn: "I’ll help create the report. I’ll ask for the loss location and time, a bag description, an optional photo, and contact details. After validation, I’ll submit it and show the reference number.",
  },
  {
    id: "navigation", icon: MapPinned,
    titleAr: "الوصول إلى الفندق", titleEn: "Navigate to the hotel",
    requestAr: "وين فندقي؟", requestEn: "Where is my hotel?",
    answerAr: "سأسترجع بيانات فندقك، أحدد موقعك، ثم أنشئ أفضل مسار وأعرض المسافة ووقت الوصول مع خيار بدء الملاحة.",
    answerEn: "I’ll retrieve your hotel details, detect your location, create the best route, and show the distance and arrival time with an option to start navigation.",
  },
  {
    id: "complaint", icon: FileWarning,
    titleAr: "تقديم شكوى", titleEn: "Submit a complaint",
    requestAr: "أبغى أقدم شكوى", requestEn: "I want to submit a complaint",
    answerAr: "سأحدد معك تصنيف الشكوى، وأجمع التفاصيل والمرفقات، ثم أعرض ملخصًا للتأكيد قبل الإرسال وأعطيك الرقم المرجعي.",
    answerEn: "I’ll identify the complaint category, collect details and attachments, show a summary for confirmation, then provide the reference number.",
  },
  {
    id: "tracking", icon: TicketCheck,
    titleAr: "متابعة بلاغ", titleEn: "Track a report",
    requestAr: "أبغى أتابع بلاغي", requestEn: "I want to track my report",
    answerAr: "سأطلب الرقم المرجعي للبلاغ، ثم أعرض حالته وآخر تحديث والخطوة القادمة.",
    answerEn: "I’ll request the report reference, then show its status, latest update, and next step.",
  },
];

function createMessage(sender: ChatMessage["sender"], text: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, sender, text, createdAt: new Date().toISOString() };
}

export function AIAssistantDrawer() {
  const { activeDrawer, closeDrawer } = useDrawer();
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOpen = activeDrawer === "ai-assistant";

  useEffect(() => {
    if (!isOpen || messages.length) return;
    setMessages([
      createMessage("ASSISTANT", t(
        "مرحبًا بك 👋\nأنا مساعد مِنار الذكي. في النسخة النهائية سأفهم طلبك، أجمع البيانات المطلوبة، وأنفّذ الخدمة لك داخل المحادثة.",
        "Welcome 👋\nI’m Minar AI Assistant. In the final version, I’ll understand your request, collect the required details, and complete the service within this conversation."
      )),
    ]);
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendDemo = (text: string, preparedAnswer?: string) => {
    if (!text.trim()) return;
    const response = preparedAnswer ?? t(
      "فهمت طلبك. في النسخة النهائية سأحدد الخدمة المناسبة، وأسألك عن البيانات الناقصة خطوة بخطوة، ثم أطلب تأكيدك وأنفّذها وأعرض النتيجة هنا.\n\nهذا الرد توضيحي حاليًا، وسيُفعّل التنفيذ الفعلي بعد ربط المساعد بمحرك الذكاء الاصطناعي وأنظمة الخدمات.",
      "I understand your request. In the final version, I’ll select the right service, collect missing details step by step, ask for confirmation, complete it, and show the result here.\n\nThis is currently a demonstration response. Live execution will be enabled after connecting the assistant to the AI engine and service systems."
    );
    setMessages((current) => [...current, createMessage("USER", text), createMessage("ASSISTANT", response)]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendDemo(value);
    setValue("");
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      widthClassName="max-w-2xl"
      title={t("مساعد مِنار الذكي", "Minar AI Assistant")}
      icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
      footer={
        <form onSubmit={submit} className="flex items-center gap-2">
          <button type="button" aria-label={t("إدخال صوتي تجريبي", "Demo voice input")}
            onClick={() => sendDemo(t("أرشدني إلى فندقي", "Guide me to my hotel"), t(examples[1]!.answerAr, examples[1]!.answerEn))}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition hover:bg-brand-200">
            <Mic className="h-6 w-6" />
          </button>
          <input value={value} onChange={(event) => setValue(event.target.value)}
            placeholder={t("اكتب طلبك هنا...", "Type your request here...")}
            className="h-14 min-w-0 flex-1 rounded-2xl border border-cream-300 bg-white px-5 text-lg text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none" />
          <button type="submit" disabled={!value.trim()} aria-label={t("إرسال", "Send")}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800 disabled:opacity-40">
            <Send className="h-6 w-6 rtl:-scale-x-100" />
          </button>
        </form>
      }
    >
      <div className="flex min-h-full flex-col gap-5">
        <div className="rounded-2xl border border-gold-300 bg-gold-50 px-5 py-4 text-sm leading-relaxed text-ink-700">
          <strong className="text-brand-900">{t("ملاحظة: ", "Note: ")}</strong>
          {t(
            "هذه تجربة توضيحية لشكل المساعد. مستقبلًا سيجمع البيانات وينفّذ خدمات مِنار كاملة من المحادثة. الربط الفعلي بالذكاء الاصطناعي وأنظمة الخدمات سيكون في مرحلة التطوير القادمة.",
            "This is a visual demonstration of the assistant. In the future, it will collect details and complete Minar services within the chat. Live AI and service-system integration will be added in the next development phase."
          )}
        </div>

        <div ref={scrollRef} className="flex max-h-[42vh] min-h-64 flex-col gap-4 overflow-y-auto rounded-2xl border border-cream-200 bg-white p-4 sm:p-5">
          {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-700" />
            <h3 className="font-bold text-brand-900">{t("أمثلة يمكنك تجربتها", "Examples you can try")}</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {examples.map((example) => {
              const Icon = example.icon;
              return (
                <button key={example.id} type="button"
                  onClick={() => sendDemo(t(example.requestAr, example.requestEn), t(example.answerAr, example.answerEn))}
                  className="flex min-h-16 items-center gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-3 text-start text-brand-900 transition hover:border-gold-500 hover:bg-gold-50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-gold-400"><Icon className="h-5 w-5" /></span>
                  <span><strong className="block">{t(example.titleAr, example.titleEn)}</strong><span className="mt-0.5 block text-xs text-ink-500">«{t(example.requestAr, example.requestEn)}»</span></span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-2xl bg-brand-900 p-4 text-white">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-gold-400" />
          <p className="text-sm leading-relaxed">{t("الهدف النهائي: أي خدمة موجودة في الخدمة الذاتية سيتمكن المساعد من تنفيذها أيضًا داخل المحادثة.", "Final goal: every self-service feature will also be executable by the assistant inside the conversation.")}</p>
        </div>
      </div>
    </Drawer>
  );
}

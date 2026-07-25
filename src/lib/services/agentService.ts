import { generateId, mockStore } from "@/lib/mock-data/store";
import { getServiceTool, listServiceTools, executeServiceTool } from "@/lib/services/serviceExecutionService";
import type { AssistantRequest, ChatMessage, SuggestedPrompt } from "@/types/chat";

type AgentState =
  | { mode: "service"; slug: string; values: Record<string, string>; remaining: string[] }
  | { mode: "queue-consent" }
  | { mode: "track-report" }
  | { mode: "adahi-package" }
  | { mode: "adahi-confirm"; packageName: string };

const globalAgent = globalThis as unknown as { __minarAgentStates?: Map<string, AgentState> };
const states = globalAgent.__minarAgentStates ?? new Map<string, AgentState>();
globalAgent.__minarAgentStates = states;

const yes = (text: string) => /^(نعم|ايوا|ايوه|موافق|yes|ok|okay)/i.test(text.trim());
const no = (text: string) => /^(لا|no|cancel|إلغاء)/i.test(text.trim());

const intentMap: Array<{ slug: string; words: string[] }> = [
  { slug: "lost-items", words: ["شنطة مفقودة", "غرض مفقود", "فقدت", "مفقودات", "lost item", "lost bag"] },
  { slug: "lost-person", words: ["شخص مفقود", "طفل مفقود", "lost person", "missing person"] },
  { slug: "complaints", words: ["شكوى", "اشتكي", "complaint"] },
  { slug: "instant-translation", words: ["ترجم", "ترجمة", "translate"] },
  { slug: "field-help", words: ["مرشد", "تائه", "أرشدني", "guide"] },
  { slug: "help-me", words: ["ساعدني", "مساعدة فورية", "help me"] },
  { slug: "transport", words: ["مواصلات", "حافلة", "قطار", "transport", "bus"] },
  { slug: "religious-guide", words: ["دليل الحج", "دليل العمرة", "مناسك", "religious guide"] },
  { slug: "nusuk-services", words: ["نسك", "تصريح", "permit", "nusuk"] },
  { slug: "queue", words: ["رقم انتظار", "موظف", "دور", "queue", "employee"] },
];

function reply(text: string): ChatMessage {
  return { id: generateId("agent"), sender: "ASSISTANT", text, createdAt: new Date().toISOString() };
}

function fieldPrompt(slug: string, fieldId: string, isAr: boolean): string {
  const field = getServiceTool(slug)?.fields.find((item) => item.id === fieldId);
  if (!field) return isAr ? "أرسل المعلومة المطلوبة." : "Send the required information.";
  const options = isAr ? field.optionsAr : field.optionsEn;
  const suffix = options?.length ? `\n${isAr ? "الخيارات" : "Options"}: ${options.join("، ")}` : "";
  return `${isAr ? field.labelAr : field.labelEn}${field.required ? " *" : ` (${isAr ? "اختياري، اكتب تخطي" : "optional, type skip"})`}${suffix}`;
}

function orderedFields(slug: string): string[] {
  const all = getServiceTool(slug)?.fields.map((field) => field.id) ?? [];
  if (slug === "lost-items") return ["location", "eventTime", "description", "attachment", "contact"];
  return all;
}

function detectService(message: string): string | null {
  const normalized = message.toLowerCase();
  return intentMap.find((intent) => intent.words.some((word) => normalized.includes(word)))?.slug ?? null;
}

async function finishService(sessionId: string, state: Extract<AgentState, { mode: "service" }>, isAr: boolean) {
  const result = await executeServiceTool(state.slug, state.values);
  states.delete(sessionId);
  if (!result.success) {
    const missing = Object.keys(result.errors ?? {});
    if (missing.length) {
      states.set(sessionId, { ...state, remaining: missing });
      return reply(`${isAr ? "بعض البيانات ناقصة" : "Some information is missing"}.\n${fieldPrompt(state.slug, missing[0]!, isAr)}`);
    }
  }
  const lines = isAr ? result.resultAr : result.resultEn;
  return reply(`${isAr ? "تم تنفيذ الخدمة بنجاح ✅" : "Service completed successfully ✅"}\n${lines.join("\n")}`);
}

export async function getAgentReply(request: AssistantRequest): Promise<ChatMessage> {
  const isAr = request.language === "AR";
  const message = request.message.trim();
  const normalized = message.toLowerCase();
  const state = states.get(request.sessionId);

  mockStore.chatMessages.push({ id: generateId("msg"), sessionId: request.sessionId, pilgrimId: null, sender: "USER", text: message, language: request.language, createdAt: new Date().toISOString() });

  if (state?.mode === "queue-consent") {
    if (yes(message)) {
      states.delete(request.sessionId);
      const result = await executeServiceTool("queue", { service: "خدمات نسك عناية" });
      return reply(`${isAr ? "تم حجز الدور ✅" : "Queue booked ✅"}\n${(isAr ? result.resultAr : result.resultEn).join("\n")}`);
    }
    if (no(message)) {
      states.delete(request.sessionId);
      return reply(isAr ? "حسنًا، لن يتم إنشاء رقم انتظار. كيف أستطيع مساعدتك؟" : "Okay, no queue number was created. How else can I help?");
    }
    return reply(isAr ? "هل ترغب في حجز رقم انتظار؟ أجب بنعم أو لا." : "Would you like a queue number? Please answer yes or no.");
  }

  if (state?.mode === "track-report") {
    states.delete(request.sessionId);
    return reply(`${isAr ? "حالة البلاغ" : "Report status"} ${message}\n${isAr ? "قيد المراجعة — آخر تحديث: تم تحويله للفريق المختص." : "Under review — latest update: assigned to the responsible team."}`);
  }

  if (state?.mode === "adahi-package") {
    states.set(request.sessionId, { mode: "adahi-confirm", packageName: message });
    return reply(isAr ? `اخترت باقة «${message}». هل تؤكد الطلب؟` : `You selected “${message}”. Confirm the order?`);
  }
  if (state?.mode === "adahi-confirm") {
    if (!yes(message)) {
      states.delete(request.sessionId);
      return reply(isAr ? "تم إلغاء الطلب دون تنفيذ أي عملية." : "The order was cancelled.");
    }
    states.delete(request.sessionId);
    const result = await executeServiceTool("nusuk-services", { action: "شراء الأضاحي وإصدار سند", passport: "بيانات المستخدم المسجل" });
    return reply(`${isAr ? "تم إنشاء طلب الأضحية تجريبيًا ✅" : "Demo Adahi order created ✅"}\n${isAr ? "الباقة" : "Package"}: ${state.packageName}\n${(isAr ? result.resultAr : result.resultEn).join("\n")}`);
  }

  if (state?.mode === "service") {
    const fieldId = state.remaining[0];
    if (!fieldId) return finishService(request.sessionId, state, isAr);
    const field = getServiceTool(state.slug)?.fields.find((item) => item.id === fieldId);
    const skip = /^(تخطي|skip)$/i.test(message);
    if (skip && field?.required) return reply(isAr ? "هذا الحقل مطلوب ولا يمكن تخطيه." : "This field is required and cannot be skipped.");
    if (!skip) state.values[fieldId] = message;
    state.remaining.shift();
    if (!state.remaining.length) return finishService(request.sessionId, state, isAr);
    states.set(request.sessionId, state);
    return reply(fieldPrompt(state.slug, state.remaining[0]!, isAr));
  }

  if (/تابع.*بلاغ|متابعة.*بلاغ|track.*report/.test(normalized)) {
    states.set(request.sessionId, { mode: "track-report" });
    return reply(isAr ? "أرسل رقم البلاغ الذي تريد متابعته." : "Send the report reference you want to track.");
  }

  if (/أضحية|اضحية|هدي|sacrifice|adahi/.test(normalized)) {
    states.set(request.sessionId, { mode: "adahi-package" });
    return reply(isAr ? "الباقات المتاحة:\n1. اقتصادية — 720 ر.س\n2. مميزة — 890 ر.س\n3. عائلية — 1,450 ر.س\nاكتب اسم الباقة المناسبة." : "Available packages:\n1. Economy — SAR 720\n2. Premium — SAR 890\n3. Family — SAR 1,450\nType the package name.");
  }

  if (/وين فندقي|فندقي|my hotel/.test(normalized)) {
    if (!request.pilgrimContext) return reply(isAr ? "سجّل الدخول أولًا حتى أستطيع استرجاع فندقك." : "Sign in first so I can retrieve your hotel.");
    const p = request.pilgrimContext;
    return reply(`${isAr ? "فندقك" : "Your hotel"}: ${p.hotelName} — ${p.hotelRating} ${isAr ? "نجوم" : "stars"}\n${p.hotelLocation}\n${isAr ? "المسار: 6 دقائق، 1.2 كم. اكتب «وديني للفندق» لبدء الملاحة." : "Route: 6 minutes, 1.2 km. Type “navigate to my hotel” to start."}`);
  }

  if (/وين مخيمي|مخيمي|my camp/.test(normalized)) {
    if (!request.pilgrimContext) return reply(isAr ? "سجّل الدخول أولًا حتى أستطيع استرجاع بيانات مخيمك." : "Sign in first so I can retrieve your camp.");
    const { minaCamp, arafatCamp } = request.pilgrimContext;
    return reply(`${isAr ? "مخيم منى" : "Mina camp"}: ${minaCamp.siteNumber} — ${isAr ? "الفئة" : "Category"} ${minaCamp.category} — ${isAr ? "المنطقة" : "Zone"} ${minaCamp.zone}\n${isAr ? "مخيم عرفة" : "Arafat camp"}: ${arafatCamp.siteNumber} — ${isAr ? "الفئة" : "Category"} ${arafatCamp.category} — ${isAr ? "المنطقة" : "Zone"} ${arafatCamp.zone}\n${isAr ? "اكتب «وديني للمخيم» لبدء الملاحة." : "Type “navigate to camp” to start navigation."}`);
  }

  if (/وديني|ملاحة|طريق|navigate|route/.test(normalized)) {
    const destination = normalized.includes("فندق") ? request.pilgrimContext?.hotelName ?? "الفندق" : normalized.includes("مخيم") ? "مخيم منى" : normalized.includes("حرم") ? "المسجد الحرام" : message.replace(/وديني|navigate|route/gi, "").trim();
    return reply(`${isAr ? "تم تحديد موقعك وإنشاء المسار ✅" : "Location detected and route created ✅"}\n${isAr ? "الوجهة" : "Destination"}: ${destination}\n${isAr ? "المسافة: 1.2 كم\nالوقت المتوقع: 8 دقائق\nأماكن قريبة: صيدلية، دورات مياه، مركز خدمة" : "Distance: 1.2 km\nETA: 8 minutes\nNearby: pharmacy, restrooms, service center"}`);
  }

  const slug = detectService(message);
  if (slug === "queue") {
    states.set(request.sessionId, { mode: "queue-consent" });
    return reply(isAr ? "هذه الخدمة تحتاج إلى مراجعة أحد موظفي نسك عناية، هل ترغب في حجز رقم انتظار والتحويل إلى موظف؟" : "This service requires a Nusuk Care employee. Would you like to book a queue number and transfer to an employee?");
  }

  if (slug) {
    const definition = getServiceTool(slug);
    if (!definition) return reply(isAr ? "الخدمة غير متاحة حاليًا." : "Service unavailable.");
    const values: Record<string, string> = {};
    if (slug === "lost-items") {
      values.path = "غرض مفقود";
      if (/شنطة|bag/.test(normalized)) values.itemType = isAr ? "شنطة" : "Bag";
    }
    const remaining = orderedFields(slug).filter((id) => !values[id]);
    if (!remaining.length) return finishService(request.sessionId, { mode: "service", slug, values, remaining }, isAr);
    states.set(request.sessionId, { mode: "service", slug, values, remaining });
    return reply(`${isAr ? `سأنفذ خدمة «${definition.titleAr}» معك داخل المحادثة.` : `I’ll complete “${definition.titleEn}” with you here.`}\n${fieldPrompt(slug, remaining[0]!, isAr)}`);
  }

  const available = listServiceTools().map((tool) => isAr ? tool.titleAr : tool.titleEn).join("، ");
  return reply(`${isAr ? "أستطيع تنفيذ الخدمات معك داخل المحادثة. اكتب ما تريد إنجازه، مثل تقديم شكوى أو بلاغ مفقودات أو طلب ترجمة أو نقل." : "I can complete services with you in this chat. Ask to file a complaint, report a lost item, translate, or arrange transport."}\n${isAr ? "الخدمات المتاحة" : "Available services"}: ${available}`);
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  return [...mockStore.suggestedPrompts].sort((a, b) => a.order - b.order);
}

import { mockStore, generateId } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import { getRecommendedLevel } from "@/lib/services/crowdService";
import type {
  AssistantPilgrimContext,
  AssistantRequest,
  ChatMessage,
  SuggestedAction,
  SuggestedPrompt,
} from "@/types/chat";

/**
 * AI Assistant service — mock rule-based responses today.
 *
 * SWAP POINT: once OPENAI_API_KEY is set, replace the body of
 * `getAssistantReply` with a call to the OpenAI Chat Completions API,
 * passing the recent `mockStore.chatMessages` for this sessionId as
 * conversation history and `pilgrimContext` (already resolved
 * server-side from the real session — see app/api/ai/assistant/route.ts)
 * as system-prompt context. The function's signature and return type
 * (ChatMessage) do not need to change, so the API route and
 * AIAssistantDrawer are unaffected by the swap.
 */

interface Rule {
  keywords: string[];
  reply: (
    isAr: boolean,
    pilgrimContext?: AssistantPilgrimContext
  ) => Promise<{ text: string; actions?: SuggestedAction[] }>;
}

/**
 * FINAL PRODUCT DECISION: the AI Assistant never performs symptom
 * assessment or medical diagnosis — that happens exclusively on the
 * dedicated Smart Medical Device (see Healthcare's SmartMedicalDeviceCard,
 * Phase 8). This rule is checked before any other health-related rule so
 * any symptom-sounding message is redirected, never assessed.
 */
const SYMPTOM_KEYWORDS = [
  "أعراض",
  "عرض صحي",
  "مريض",
  "ألم",
  "وجع",
  "تشخيص",
  "مرض",
  "حمى",
  "صداع",
  "تعبان",
  "symptom",
  "diagnos",
  "sick",
  "pain",
  "hurt",
  "ill",
  "fever",
];

const rules: Rule[] = [
  {
    keywords: SYMPTOM_KEYWORDS,
    reply: async (isAr) => ({
      text: isAr
        ? "لا يقوم المساعد الذكي بإجراء تقييم للأعراض أو التشخيص الطبي. يمكنني إرشادك إلى أقرب مركز صحي أو جهة طبية مختصة."
        : "The AI Assistant doesn't perform symptom assessment or medical diagnosis. I can guide you to the nearest health center or qualified medical provider.",
      actions: [
        { label: isAr ? "أقرب مركز صحي" : "Nearest health center", href: "/healthcare" },
      ],
    }),
  },
  {
    keywords: ["مخيم", "camp", "خيمتي"],
    reply: async (isAr, pilgrimContext) => ({
      text: pilgrimContext
        ? isAr
          ? `مخيمك رقم ${pilgrimContext.campNumber} ضمن ${pilgrimContext.campaignName}، ويقع في ${pilgrimContext.campLocation}.`
          : `Your camp is number ${pilgrimContext.campNumber} under ${pilgrimContext.campaignName}, located at ${pilgrimContext.campLocation}.`
        : isAr
          ? "يمكنك الاطلاع على موقع مخيمك ورقمه من لوحة التحكم الرئيسية بعد تسجيل الدخول، أو طلب المسار مباشرة."
          : "You can find your camp's location and number on your dashboard after signing in, or request the route directly.",
      actions: [{ label: isAr ? "عرض مسار المخيم" : "Show route to camp", href: "/navigation?destination=CAMP" }],
    }),
  },
  {
    keywords: ["مرحلتي", "تقدمي", "رحلتي الحالية", "progress", "my journey", "my stage"],
    reply: async (isAr, pilgrimContext) => ({
      text: pilgrimContext
        ? isAr
          ? `أهلاً ${pilgrimContext.name}، أنت حالياً في مرحلة الطواف ضمن رحلتك، بعد إتمام الوصول والإحرام.`
          : `Hi ${pilgrimContext.name}, you're currently at the Tawaf stage of your journey, having completed Arrival and Ihram.`
        : isAr
          ? "سجّل دخولك عبر التعرف الذكي لمتابعة مراحل رحلتك خطوة بخطوة."
          : "Sign in via Smart Identification to track your journey stage by stage.",
      actions: pilgrimContext ? undefined : [{ label: isAr ? "التعرف الذكي" : "Smart Identification", href: "/identify" }],
    }),
  },
  {
    keywords: ["قطار", "محطة", "train", "station"],
    reply: async (isAr) => ({
      text: isAr
        ? "أقرب محطة قطار لك هي محطة عرفات 3، على بعد حوالي 1.2 كم (نحو 14 دقيقة سيراً)."
        : "Your nearest train station is Arafat Station 3, about 1.2 km away (roughly 14 minutes on foot).",
    }),
  },
  {
    keywords: ["مركز صحي", "health center", "طبيب", "doctor", "مستشفى", "hospital"],
    reply: async (isAr) => ({
      text: isAr
        ? "أقرب مركز صحي هو مركز نسك الصحي - العزيزية، على بعد 350 متراً تقريباً (5 دقائق سيراً)."
        : "The nearest health center is Nusuk Health Center - Al Aziziyah, about 350m away (5 minutes on foot).",
      actions: [{ label: isAr ? "الملاحة إلى المركز" : "Navigate to center", href: "/healthcare" }],
    }),
  },
  {
    keywords: ["دورة مياه", "restroom", "toilet", "حمام"],
    reply: async (isAr) => ({
      text: isAr
        ? "أقرب دورة مياه تبعد عنك بضع دقائق سيراً. سأعرض لك المسار على الخريطة."
        : "The nearest restroom is a few minutes' walk away. I'll show you the route on the map.",
      actions: [{ label: isAr ? "عرض المسار" : "Show route", href: "/navigation?destination=RESTROOM" }],
    }),
  },
  {
    keywords: ["طواف", "tawaf"],
    reply: async (isAr) => {
      const level = await getRecommendedLevel("TAWAF");
      if (!level) {
        return {
          text: isAr ? "تعذر جلب بيانات الازدحام حالياً، حاول مرة أخرى بعد قليل." : "Couldn't fetch crowd data right now — please try again shortly.",
        };
      }
      return {
        text: isAr
          ? `أفضل وقت للطواف الآن هو من خلال ${level.levelName}، بمستوى ازدحام مناسب وزمن انتظار حوالي ${level.waitMinutes} دقيقة.`
          : `The best option for Tawaf right now is via ${level.levelName}, with a comfortable crowd level and about a ${level.waitMinutes}-minute wait.`,
        actions: [{ label: isAr ? "عرض المسار" : "Show route", href: "/navigation?destination=TAWAF" }],
      };
    },
  },
  {
    keywords: ["سعي", "sai"],
    reply: async (isAr) => {
      const level = await getRecommendedLevel("SAI");
      return {
        text: isAr
          ? `بالنسبة للسعي، ننصح حالياً بـ ${level?.levelName ?? "المسار الرئيسي"} لتقليل وقت الانتظار.`
          : `For Sa'i, we currently recommend ${level?.levelName ?? "the main path"} to minimize wait time.`,
        actions: [{ label: isAr ? "عرض المسار" : "Show route", href: "/navigation?destination=SAI" }],
      };
    },
  },
  {
    keywords: ["مشكلة", "بلاغ", "report", "problem", "مساعدة", "help", "ضياع", "lost"],
    reply: async (isAr) => ({
      text: isAr
        ? "يمكنني مساعدتك في رفع بلاغ فوري (ضياع، فقدان ممتلكات، حالة طارئة، مساعدة ميدانية). ما نوع المساعدة التي تحتاجها؟"
        : "I can help you submit an immediate report (lost pilgrim, lost item, emergency, or field assistance). What kind of help do you need?",
      actions: [{ label: isAr ? "الخدمات الصحية والطوارئ" : "Healthcare & Emergency", href: "/healthcare" }],
    }),
  },
  {
    keywords: ["ازدحام", "crowd", "زحمة"],
    reply: async (isAr) => ({
      text: isAr
        ? "مستوى الازدحام العام حالياً متوسط. يمكنني مساعدتك باختيار أفضل مسار أو مستوى أقل ازدحاماً لوجهتك."
        : "The overall crowd level right now is moderate. I can help you pick a less crowded route or level for your destination.",
      actions: [{ label: isAr ? "الملاحة الذكية" : "Smart Navigation", href: "/navigation" }],
    }),
  },
  {
    keywords: ["طقس", "weather", "حرارة", "حار"],
    reply: async (isAr) => ({
      text: isAr
        ? "درجة الحرارة الحالية 42° مئوية مع جودة هواء جيدة. يُنصح بشرب الماء بانتظام وتجنب التعرض المباشر للشمس."
        : "It's currently 42°C with good air quality. We recommend drinking water regularly and avoiding direct sun exposure.",
    }),
  },
  {
    keywords: ["دين", "فتوى", "مناسك", "religious", "fatwa", "ritual"],
    reply: async (isAr) => ({
      text: isAr
        ? "الدليل الديني الكامل بالمناسك والأدعية والفتاوى المعتمدة سيكون متاحاً قريباً من الصفحة الرئيسية."
        : "The full religious guide with rites, supplications, and official rulings will be available soon from the home screen.",
    }),
  },
  {
    keywords: ["الحرم", "بوابة", "مواقيت الصلاة", "haram", "gate", "prayer time"],
    reply: async (isAr) => ({
      text: isAr
        ? "معلومات الحرم التفصيلية (مواقيت الصلاة، الأبواب، دورات المياه) ستكون متاحة قريباً من الصفحة الرئيسية."
        : "Detailed Haram information (prayer times, gates, restrooms) will be available soon from the home screen.",
    }),
  },
];

const FALLBACK_AR =
  "يمكنني مساعدتك في المالحة، معرفة أفضل وقت لأداء المناسك، الوصول للخدمات الصحية، أو رفع بلاغ. كيف يمكنني مساعدتك؟";
const FALLBACK_EN =
  "I can help with navigation, the best time to perform rituals, healthcare services, or filing a report. How can I help?";

export async function getAssistantReply(request: AssistantRequest): Promise<ChatMessage> {
  await simulateLatency(500, 1100);

  const isAr = request.language === "AR";
  const normalized = request.message.toLowerCase();

  const matchedRule = rules.find((rule) =>
    rule.keywords.some((k) => normalized.includes(k.toLowerCase()))
  );

  const { text, actions } = matchedRule
    ? await matchedRule.reply(isAr, request.pilgrimContext)
    : { text: isAr ? FALLBACK_AR : FALLBACK_EN, actions: undefined as SuggestedAction[] | undefined };

  // Persist both sides of the exchange for conversation continuity within
  // the drawer session (kept in-memory only; not surfaced outside the chat).
  mockStore.chatMessages.push({
    id: generateId("msg"),
    sessionId: request.sessionId,
    pilgrimId: null,
    sender: "USER",
    text: request.message,
    language: request.language,
    createdAt: new Date().toISOString(),
  });

  const replyRecord: ChatMessage = {
    id: generateId("msg"),
    sender: "ASSISTANT",
    text,
    createdAt: new Date().toISOString(),
    suggestedActions: actions,
  };

  mockStore.chatMessages.push({
    id: replyRecord.id,
    sessionId: request.sessionId,
    pilgrimId: null,
    sender: "ASSISTANT",
    text,
    language: request.language,
    createdAt: replyRecord.createdAt,
  });

  return replyRecord;
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  await simulateLatency(100, 250);
  return [...mockStore.suggestedPrompts].sort((a, b) => a.order - b.order);
}

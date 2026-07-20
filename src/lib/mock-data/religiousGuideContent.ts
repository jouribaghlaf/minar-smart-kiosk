export interface ReligiousGuideSection {
  headingAr: string;
  headingEn: string;
  itemsAr: string[];
  itemsEn: string[];
}

export interface ReligiousGuideTopic {
  key: string;
  optionAr: string;
  optionEn: string;
  titleAr: string;
  titleEn: string;
  introAr: string;
  introEn: string;
  sections: ReligiousGuideSection[];
  sourceUrl: string;
}

export const RELIGIOUS_GUIDE_TOPICS: ReligiousGuideTopic[] = [
  {
    key: "umrah",
    optionAr: "دليل العمرة",
    optionEn: "Umrah guide",
    titleAr: "دليل العمرة خطوة بخطوة",
    titleEn: "Umrah guide, step by step",
    introAr: "ملخص إرشادي لأهم مراحل العمرة، من الإحرام حتى التحلل.",
    introEn: "A concise guide to the main stages of Umrah, from Ihram to completion.",
    sections: [
      { headingAr: "1. الإحرام", headingEn: "1. Ihram", itemsAr: ["الإحرام من الميقات المحدد لمن نوى العمرة.", "النية والتلبية: لبيك اللهم عمرة.", "تجنب محظورات الإحرام حتى إتمام النسك."], itemsEn: ["Enter Ihram at the applicable Miqat.", "Make the intention and recite the Talbiyah.", "Avoid the restrictions of Ihram until completing the rites."] },
      { headingAr: "2. الطواف", headingEn: "2. Tawaf", itemsAr: ["اجعل الكعبة عن يسارك وابدأ بمحاذاة الحجر الأسود.", "طف سبعة أشواط عكس اتجاه عقارب الساعة.", "راعِ الهدوء واتبع مسارات تنظيم الحشود."], itemsEn: ["Keep the Kaaba to your left and begin at the Black Stone line.", "Complete seven counter-clockwise circuits.", "Remain calm and follow crowd-management routes."] },
      { headingAr: "3. السعي والتحلل", headingEn: "3. Sa'i and completion", itemsAr: ["اسعَ سبعة أشواط بين الصفا والمروة؛ يبدأ الشوط من الصفا وينتهي عند المروة.", "بعد السعي يحلق الرجل أو يقصر، وتقصر المرأة من أطراف شعرها.", "بذلك تكتمل العمرة ويحل المعتمر من إحرامه."], itemsEn: ["Complete seven laps between Safa and Marwah, beginning at Safa.", "After Sa'i, men shave or trim their hair; women trim a small amount.", "The Umrah is then complete and the state of Ihram ends."] },
    ],
    sourceUrl: "https://umrah.nusuk.sa/Journey",
  },
  {
    key: "hajj",
    optionAr: "دليل الحج",
    optionEn: "Hajj guide",
    titleAr: "دليل الحج المختصر",
    titleEn: "Concise Hajj guide",
    introAr: "تسلسل مبسط لأهم محطات رحلة الحج. قد تختلف بعض التفاصيل حسب نوع النسك وخطة التفويج.",
    introEn: "A simplified sequence of key Hajj stages. Details may vary by Hajj type and official movement plan.",
    sections: [
      { headingAr: "بدء النسك", headingEn: "Beginning the rites", itemsAr: ["الإحرام والنية والتلبية من الميقات.", "التوجه إلى منى حسب خطة التفويج المعتمدة."], itemsEn: ["Enter Ihram, make the intention, and recite the Talbiyah.", "Proceed to Mina according to the approved movement plan."] },
      { headingAr: "عرفة ومزدلفة", headingEn: "Arafat and Muzdalifah", itemsAr: ["الوقوف بعرفة في اليوم التاسع هو ركن الحج الأعظم.", "بعد الغروب تكون الإفاضة إلى مزدلفة وفق التعليمات التنظيمية."], itemsEn: ["Standing at Arafat on the ninth day is the central pillar of Hajj.", "After sunset, proceed to Muzdalifah in accordance with official instructions."] },
      { headingAr: "يوم النحر وما بعده", headingEn: "Day of sacrifice and after", itemsAr: ["رمي جمرة العقبة، والهدي لمن لزمه، والحلق أو التقصير.", "طواف الإفاضة والسعي لمن كان عليه سعي.", "المبيت بمنى ورمي الجمرات في أيام التشريق، ثم طواف الوداع لغير الحائض والنفساء."], itemsEn: ["Stone Jamrat al-Aqabah, offer the required sacrifice, and shave or trim hair.", "Perform Tawaf al-Ifadah and Sa'i when required.", "Stay in Mina and stone the Jamarat during the days of Tashreeq, then perform the Farewell Tawaf when applicable."] },
    ],
    sourceUrl: "https://haj.gov.sa/Hajj",
  },
  {
    key: "rituals",
    optionAr: "تعليمات المناسك",
    optionEn: "Ritual instructions",
    titleAr: "تعليمات مهمة لأداء المناسك",
    titleEn: "Important ritual instructions",
    introAr: "إرشادات عامة تساعد على أداء النسك بيسر وسلامة.",
    introEn: "General guidance for performing the rites safely and smoothly.",
    sections: [
      { headingAr: "قبل البدء", headingEn: "Before starting", itemsAr: ["تأكد من التصريح والمواعيد والمسار المعتمد.", "تعرف على الميقات المناسب ولا تتجاوزه لمن نوى النسك دون إحرام.", "احتفظ ببطاقة نسك وبيانات السكن والحملة."], itemsEn: ["Confirm your permit, appointment, and approved route.", "Know the applicable Miqat and do not pass it without Ihram if intending the rite.", "Keep your Nusuk card and accommodation/campaign details with you."] },
      { headingAr: "أثناء المناسك", headingEn: "During the rites", itemsAr: ["اتبع توجيهات رجال الأمن واللوحات الإرشادية.", "لا تعاكس اتجاه الحركة ولا تتوقف في مسارات الطواف والسعي.", "استفد من الرخص الشرعية عند المشقة بعد سؤال جهة فتوى معتمدة."], itemsEn: ["Follow security personnel and directional signs.", "Do not move against the flow or stop in Tawaf and Sa'i lanes.", "When hardship arises, ask an authorized scholar about applicable concessions."] },
    ],
    sourceUrl: "https://haj.gov.sa/MediaAndAwareness",
  },
  {
    key: "supplications",
    optionAr: "الأدعية",
    optionEn: "Supplications",
    titleAr: "أدعية وأذكار مختارة",
    titleEn: "Selected supplications and remembrance",
    introAr: "يجوز للمسلم أن يدعو بما شاء من خيري الدنيا والآخرة دون التقيد بدعاء خاص لكل شوط.",
    introEn: "A Muslim may make any beneficial supplication; no specific prayer is required for each circuit.",
    sections: [
      { headingAr: "التلبية", headingEn: "Talbiyah", itemsAr: ["لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك."], itemsEn: ["Labbayka Allahumma labbayk, labbayka la sharika laka labbayk; innal-hamda wan-ni'mata laka wal-mulk, la sharika lak."] },
      { headingAr: "بين الركن اليماني والحجر الأسود", headingEn: "Between the Yemeni Corner and Black Stone", itemsAr: ["ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار."], itemsEn: ["Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire."] },
      { headingAr: "دعاء جامع", headingEn: "A comprehensive supplication", itemsAr: ["اللهم إنك عفو تحب العفو فاعف عني.", "رب اغفر وارحم وأنت خير الراحمين."], itemsEn: ["O Allah, You are Pardoning and love to pardon, so pardon me.", "My Lord, forgive and have mercy; You are the best of the merciful."] },
    ],
    sourceUrl: "https://haj.gov.sa/MediaAndAwareness",
  },
  {
    key: "faq",
    optionAr: "الأسئلة الشائعة",
    optionEn: "FAQ",
    titleAr: "الأسئلة الشائعة",
    titleEn: "Frequently asked questions",
    introAr: "إجابات مختصرة على أسئلة متكررة لدى ضيوف الرحمن.",
    introEn: "Short answers to common pilgrim questions.",
    sections: [
      { headingAr: "هل يمكن تعديل موعد العمرة؟", headingEn: "Can an Umrah appointment be changed?", itemsAr: ["وفق الأسئلة الشائعة للوزارة: يُلغى الموعد عبر تطبيق نسك قبل دخول وقته ثم يصدر تصريح جديد حسب المتاح."], itemsEn: ["According to the Ministry FAQ, cancel the appointment in Nusuk before it begins, then issue a new permit subject to availability."] },
      { headingAr: "ماذا لو تأخرت عن وقت التصريح؟", headingEn: "What if I miss my permit time?", itemsAr: ["ينبغي التقيد بالوقت المحدد، ويمكن الحجز مجددًا بعد انتهاء الموعد وفق المتاح في تطبيق نسك."], itemsEn: ["Attend at the specified time. A new booking may be made after the appointment expires, subject to Nusuk availability."] },
      { headingAr: "أين أجد التصاريح؟", headingEn: "Where can I find permits?", itemsAr: ["تظهر التصاريح والحجوزات المرتبطة بالحساب داخل تطبيق نسك."], itemsEn: ["Permits and bookings linked to the account appear in the Nusuk application."] },
    ],
    sourceUrl: "https://haj.gov.sa/Faqs",
  },
  {
    key: "historical",
    optionAr: "المواقع التاريخية والثقافية",
    optionEn: "Historical sites",
    titleAr: "مواقع تاريخية وثقافية",
    titleEn: "Historical and cultural sites",
    introAr: "مقترحات إثرائية يمكن زيارتها خارج أوقات المناسك مع مراعاة المواعيد والتعليمات.",
    introEn: "Enrichment destinations to visit outside ritual times, subject to opening hours and instructions.",
    sections: [
      { headingAr: "في مكة المكرمة", headingEn: "In Makkah", itemsAr: ["حي حراء الثقافي ومعرض الوحي.", "معرض عمارة الحرمين الشريفين.", "متحف القرآن الكريم ومتحف برج الساعة."], itemsEn: ["Hira Cultural District and the Revelation Exhibition.", "Exhibition of the Architecture of the Two Holy Mosques.", "The Holy Quran Museum and Clock Tower Museum."] },
      { headingAr: "إرشادات الزيارة", headingEn: "Visit guidance", itemsAr: ["تحقق من أوقات العمل والحجز قبل التوجه.", "لا تجعل الزيارات تؤثر في مواعيد التصاريح أو رحلة المغادرة.", "استخدم الملاحة الذكية للوصول واختيار المسار المناسب."], itemsEn: ["Check opening hours and booking requirements before visiting.", "Do not let visits conflict with permit or departure times.", "Use smart navigation to choose an appropriate route."] },
    ],
    sourceUrl: "https://haj.gov.sa/MediaAndAwareness",
  },
];

export function getReligiousGuideTopic(value?: string) {
  return RELIGIOUS_GUIDE_TOPICS.find((topic) => topic.optionAr === value || topic.optionEn === value);
}

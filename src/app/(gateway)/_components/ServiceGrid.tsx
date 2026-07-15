"use client";

import { Accessibility, BookOpen, Bot, BusFront, CircleAlert, ClipboardCheck, Compass, HeartPulse, Languages, MapPinCheck, PackageSearch, Siren, TicketCheck, UserRoundSearch, Utensils, type LucideIcon } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";

interface ServiceDefinition { slug: string; icon: LucideIcon; ar: string; en: string; descriptionAr: string; descriptionEn: string; tone?: string; href?: string; }

const SERVICES: ServiceDefinition[] = [
  { slug: "queue", icon: TicketCheck, ar: "أخذ رقم انتظار ذكي", en: "Smart Queue", descriptionAr: "اختر الخدمة واحصل على رقم ووقت انتظار وشباك الخدمة", descriptionEn: "Get a queue number, wait time, and service counter" },
  { slug: "field-help", icon: MapPinCheck, ar: "الإرشاد للتائهين", en: "Lost Pilgrim Guidance", descriptionAr: "طلب مرشد ميداني ومتابعة وصول المساعدة", descriptionEn: "Request and track field guidance" },
  { slug: "navigation", icon: Compass, ar: "الملاحة الذكية والخرائط", en: "Smart Navigation & Maps", descriptionAr: "مسارات تراعي الازدحام والوصول مع QR وطباعة", descriptionEn: "Crowd-aware accessible routes, QR, and print", href: "/navigation" },
  { slug: "instant-translation", icon: Languages, ar: "الترجمة الفورية", en: "Instant Translation", descriptionAr: "ترجمة صوتية ونصية غير محدودة اللغة", descriptionEn: "Open-language voice and text translation", tone: "bg-gold-100 text-gold-600" },
  { slug: "complaints", icon: ClipboardCheck, ar: "الشكاوى", en: "Complaints", descriptionAr: "إنشاء شكوى وإرفاق الملفات ومتابعة الحالة", descriptionEn: "Submit attachments and track complaint status" },
  { slug: "reports", icon: Siren, ar: "البلاغات العامة", en: "General Reports", descriptionAr: "تصنيف البلاغ وتوجيهه للجهة المختصة", descriptionEn: "Classify and route reports to the right authority", tone: "bg-status-badBg text-status-bad" },
  { slug: "lost-person", icon: UserRoundSearch, ar: "الأشخاص المفقودون", en: "Missing Persons", descriptionAr: "إنشاء بلاغ ومتابعة التحديثات", descriptionEn: "Create and track a missing-person report" },
  { slug: "lost-items", icon: PackageSearch, ar: "المفقودات والمعثورات", en: "Lost & Found", descriptionAr: "تسجيل المفقود والمعثور عليه مع مطابقة ذكية", descriptionEn: "Report items with AI match simulation" },
  { slug: "nusuk-services", icon: TicketCheck, ar: "خدمات تطبيق نسك", en: "Nusuk App Services", descriptionAr: "الحساب والتصاريح والطباعة والدعم", descriptionEn: "Account, permits, printing, and support" },
  { slug: "udhiyah", icon: Utensils, ar: "خدمة الأضاحي", en: "Adahi Service", descriptionAr: "اختيار النسك والدفع وإصدار السند", descriptionEn: "Choose, pay, and issue an electronic receipt" },
  { slug: "awareness", icon: Bot, ar: "التوعية الاستباقية الذكية", en: "Proactive Smart Awareness", descriptionAr: "تنبيهات حسب الموقع والطقس والازدحام", descriptionEn: "Contextual alerts by location, weather, and crowds" },
  { slug: "religious-guide", icon: BookOpen, ar: "الدليل الديني والمحتوى الإثرائي", en: "Religious & Enrichment Guide", descriptionAr: "مناسك وأدلة ومحتوى موثوق بلغة المستخدم", descriptionEn: "Trusted rituals and guidance in your language" },
  { slug: "help-me", icon: CircleAlert, ar: "ساعدني", en: "Help Me", descriptionAr: "طلب مساعدة فورية ومشاركة الموقع", descriptionEn: "Instant help request and location sharing", tone: "bg-status-badBg text-status-bad" },
  { slug: "healthcare", icon: HeartPulse, ar: "الخدمات الصحية", en: "Healthcare", descriptionAr: "مراكز صحية وإسعافات وتصعيد الطوارئ", descriptionEn: "Health centers, first aid, and emergency escalation", href: "/healthcare", tone: "bg-status-badBg text-status-bad" },
  { slug: "transport", icon: BusFront, ar: "النقل والمواصلات", en: "Transport", descriptionAr: "حافلات وقطارات ومحطات ومسارات وصول", descriptionEn: "Buses, trains, stations, and accessible routes" },
];

export function ServiceGrid() {
  const { t } = useLanguage();
  const { openAccessibility } = useDrawer();
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {SERVICES.map((service) => <ServiceCard key={service.slug} icon={service.icon} title={t(service.ar, service.en)} description={t(service.descriptionAr, service.descriptionEn)} href={service.href ?? `/services/${service.slug}`} iconToneClassName={service.tone} />)}
    <ServiceCard icon={Accessibility} title={t("إمكانية الوصول", "Accessibility")} description={t("تخصيص الخط والتباين والصوت والحركة", "Customize text, contrast, sound, and motion")} onClick={openAccessibility} />
  </div>;
}

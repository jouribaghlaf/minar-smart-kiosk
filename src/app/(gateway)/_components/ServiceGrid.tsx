"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, BusFront, CircleAlert, ClipboardCheck, Compass, HeartPulse, Languages, PackageSearch, Siren, TicketCheck, UserRoundSearch, type LucideIcon } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import { GuestSignInDialog } from "./GuestSignInDialog";

interface ServiceDefinition { slug: string; icon: LucideIcon; ar: string; en: string; descriptionAr: string; descriptionEn: string; tone?: string; href?: string; requiresSignIn?: boolean; }

const SERVICES: ServiceDefinition[] = [
  { slug: "queue", requiresSignIn: true, icon: TicketCheck, ar: "أخذ رقم انتظار ذكي", en: "Smart Queue", descriptionAr: "اختر الخدمة واحصل على رقم ووقت انتظار وشباك الخدمة", descriptionEn: "Get a queue number, wait time, and service counter" },
  { slug: "navigation", icon: Compass, ar: "الملاحة الذكية والإرشاد", en: "Smart Navigation & Guidance", descriptionAr: "بحث عن الوجهات وطلب مرشد ومسارات تراعي الازدحام", descriptionEn: "Destination search, guide requests, and crowd-aware routes", href: "/navigation" },
  { slug: "instant-translation", icon: Languages, ar: "الترجمة الفورية", en: "Instant Translation", descriptionAr: "ترجمة صوتية ونصية غير محدودة اللغة", descriptionEn: "Open-language voice and text translation", tone: "bg-gold-100 text-gold-600" },
  { slug: "complaints", requiresSignIn: true, icon: ClipboardCheck, ar: "الشكاوى", en: "Complaints", descriptionAr: "إنشاء شكوى وإرفاق الملفات ومتابعة الحالة", descriptionEn: "Submit attachments and track complaint status" },
  { slug: "reports", icon: Siren, ar: "البلاغات العامة", en: "General Reports", descriptionAr: "تصنيف البلاغ وتوجيهه للجهة المختصة", descriptionEn: "Classify and route reports to the right authority", tone: "bg-status-badBg text-status-bad" },
  { slug: "lost-person", requiresSignIn: true, icon: UserRoundSearch, ar: "الأشخاص المفقودون", en: "Missing Persons", descriptionAr: "إنشاء بلاغ ومتابعة التحديثات", descriptionEn: "Create and track a missing-person report" },
  { slug: "lost-items", requiresSignIn: true, icon: PackageSearch, ar: "المفقودات والمعثورات", en: "Lost & Found", descriptionAr: "تسجيل المفقود والمعثور عليه مع مطابقة ذكية", descriptionEn: "Report items with AI match simulation" },
  { slug: "nusuk-services", requiresSignIn: true, icon: TicketCheck, ar: "خدمات تطبيق نسك", en: "Nusuk App Services", descriptionAr: "الحساب والتصاريح والطباعة والدعم", descriptionEn: "Account, permits, printing, and support" },
  { slug: "religious-guide", icon: BookOpen, ar: "الدليل الديني والمحتوى الإثرائي", en: "Religious & Enrichment Guide", descriptionAr: "مناسك وأدلة ومحتوى موثوق بلغة المستخدم", descriptionEn: "Trusted rituals and guidance in your language" },
  { slug: "help-me", icon: CircleAlert, ar: "ساعدني", en: "Help Me", descriptionAr: "طلب مساعدة فورية ومشاركة الموقع", descriptionEn: "Instant help request and location sharing", tone: "bg-status-badBg text-status-bad" },
  { slug: "healthcare", icon: HeartPulse, ar: "الخدمات الصحية", en: "Healthcare", descriptionAr: "مراكز صحية وإسعافات وتصعيد الطوارئ", descriptionEn: "Health centers, first aid, and emergency escalation", href: "/healthcare", tone: "bg-status-badBg text-status-bad" },
  { slug: "transport", icon: BusFront, ar: "النقل والمواصلات", en: "Transport", descriptionAr: "حافلات وقطارات ومحطات ومسارات وصول", descriptionEn: "Buses, trains, stations, and accessible routes" },
];

export function ServiceGrid() {
  const { t } = useLanguage();
  const { mode } = useSession();
  const router = useRouter();
  const [blockedService, setBlockedService] = useState<ServiceDefinition | null>(null);

  const signIn = (method: "PASSPORT" | "QR_CODE" | "VISA") => {
    if (!blockedService) return;
    const destination = blockedService.href ?? `/services/${blockedService.slug}`;
    router.push(`/identify?method=${method}&returnTo=${encodeURIComponent(destination)}`);
  };

  return <>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SERVICES.map((service) => {
        const destination = service.href ?? `/services/${service.slug}`;
        const blockedForGuest = mode === "guest" && service.requiresSignIn;
        return <ServiceCard key={service.slug} icon={service.icon} title={t(service.ar, service.en)} description={t(service.descriptionAr, service.descriptionEn)} href={blockedForGuest ? undefined : destination} onClick={blockedForGuest ? () => setBlockedService(service) : undefined} iconToneClassName={service.tone} />;
      })}
    </div>
    {blockedService && <GuestSignInDialog serviceName={t(blockedService.ar, blockedService.en)} onClose={() => setBlockedService(null)} onSignIn={signIn} />}
  </>;
}

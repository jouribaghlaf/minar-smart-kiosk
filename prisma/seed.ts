/**
 * Seed script — populates Postgres with realistic data that mirrors the
 * exact examples shown in the approved UI screenshots (e.g. "محمد أحمد",
 * campaign "حملة الهدى", camp "A102"), plus enough supporting rows
 * (crowd levels, health centers, reports config, etc.) for every screen
 * to render fully-populated, production-feeling data instead of empty
 * states.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, IdentificationMethod, SystemLanguage, CrowdLevelLabel, DestinationType, ChatSender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Minar database...");

  // Clean slate for repeatable local seeding.
  await prisma.chatMessage.deleteMany();
  await prisma.report.deleteMany();
  await prisma.session.deleteMany();
  await prisma.accessibilityProfile.deleteMany();
  await prisma.healthInfo.deleteMany();
  await prisma.pilgrim.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.camp.deleteMany();
  await prisma.supervisor.deleteMany();
  await prisma.crowdLevel.deleteMany();
  await prisma.healthCenter.deleteMany();
  await prisma.trainStation.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.healthTip.deleteMany();
  await prisma.suggestedPrompt.deleteMany();
  await prisma.environmentStatus.deleteMany();
  await prisma.notification.deleteMany();

  // --- Supervisor & Campaign & Camp (matches Screen 03 example data) ------
  const supervisor = await prisma.supervisor.create({
    data: {
      name: "أ. عبدالرحمن السلمي",
      phone: "+966543217890",
    },
  });

  const campaign = await prisma.campaign.create({
    data: {
      name: "حملة الهدى",
      campaignNumber: "H-2458",
      supervisorId: supervisor.id,
    },
  });

  const camp = await prisma.camp.create({
    data: {
      number: "A102",
      location: "منطقة العزيزية - شارع 204",
    },
  });

  // A second campaign/camp/supervisor so the identification demo has more
  // than one realistic pilgrim to resolve to.
  const supervisor2 = await prisma.supervisor.create({
    data: { name: "أ. سارة الحربي", phone: "+966501122334" },
  });
  const campaign2 = await prisma.campaign.create({
    data: { name: "حملة النور", campaignNumber: "H-3391", supervisorId: supervisor2.id },
  });
  const camp2 = await prisma.camp.create({
    data: { number: "B207", location: "منطقة منى - حي 6" },
  });

  // --- Pilgrims ------------------------------------------------------------
  const mainPilgrim = await prisma.pilgrim.create({
    data: {
      name: "محمد أحمد",
      nationality: "إندونيسيا",
      nationalityFlag: "ID",
      systemLanguage: SystemLanguage.AR,
      pilgrimNumber: "1234567890",
      arrivalDateHijri: "1445/12/01",
      arrivalDateGregorian: new Date("2024-06-08"),
      lastVerificationMethod: IdentificationMethod.FACE_RECOGNITION,
      campaignId: campaign.id,
      campId: camp.id,
      healthInfo: {
        create: {
          bloodType: "O+",
          allergies: "لا يوجد",
          chronicDiseases: "لا يوجد",
          currentMedications: "لا يوجد",
          emergencyContact: "0500000000",
        },
      },
    },
  });

  await prisma.pilgrim.create({
    data: {
      name: "فاطمة الزهراني",
      nationality: "ماليزيا",
      nationalityFlag: "MY",
      systemLanguage: SystemLanguage.EN,
      pilgrimNumber: "9988776655",
      arrivalDateHijri: "1445/12/02",
      arrivalDateGregorian: new Date("2024-06-09"),
      lastVerificationMethod: IdentificationMethod.NUSUK_CARD,
      campaignId: campaign2.id,
      campId: camp2.id,
      healthInfo: {
        create: {
          bloodType: "A-",
          allergies: "حساسية من البنسلين",
          chronicDiseases: "ضغط الدم",
          currentMedications: "أملوديبين 5مغ يومياً",
          emergencyContact: "0511122334",
        },
      },
    },
  });

  // --- Crowd levels (Screen 04) ---------------------------------------------
  const tawafLevels: Array<{
    levelName: string;
    levelOrder: number;
    crowdLabel: CrowdLevelLabel;
    waitMinutes: number;
    isRecommended: boolean;
    recommendedGate?: string;
  }> = [
    { levelName: "صحن المطاف", levelOrder: 0, crowdLabel: CrowdLevelLabel.BUSY, waitMinutes: 35 , isRecommended: false},
    { levelName: "الدور الأرضي", levelOrder: 1, crowdLabel: CrowdLevelLabel.VERY_BUSY, waitMinutes: 25, isRecommended: false },
    { levelName: "الدور الأول", levelOrder: 2, crowdLabel: CrowdLevelLabel.GOOD, waitMinutes: 18, isRecommended: true, recommendedGate: "باب الملك عبدالعزيز (رقم 79)" },
    { levelName: "الدور الثاني", levelOrder: 3, crowdLabel: CrowdLevelLabel.EXCELLENT, waitMinutes: 15, isRecommended: false },
  ];
  for (const level of tawafLevels) {
    await prisma.crowdLevel.create({
      data: { destination: DestinationType.TAWAF, ...level },
    });
  }

  const saiLevels = [
    { levelName: "المسار الرئيسي", levelOrder: 0, crowdLabel: CrowdLevelLabel.MODERATE, waitMinutes: 22, isRecommended: false },
    { levelName: "الدور الأول", levelOrder: 1, crowdLabel: CrowdLevelLabel.GOOD, waitMinutes: 12, isRecommended: true, recommendedGate: "بوابة الصفا" },
  ];
  for (const level of saiLevels) {
    await prisma.crowdLevel.create({ data: { destination: DestinationType.SAI, ...level } });
  }

  // --- Health centers & train stations --------------------------------------
  await prisma.healthCenter.createMany({
    data: [
      { name: "مركز نسك الصحي - العزيزية", latitude: 21.4187, longitude: 39.8262, distanceMeters: 350, etaMinutes: 5, isAvailable: true },
      { name: "مركز الرعاية العاجلة - المسجد الحرام", latitude: 21.4225, longitude: 39.8262, distanceMeters: 900, etaMinutes: 11, isAvailable: true },
      { name: "مستشفى أجياد العام", latitude: 21.4180, longitude: 39.8330, distanceMeters: 2200, etaMinutes: 20, isAvailable: false },
    ],
  });

  await prisma.trainStation.createMany({
    data: [
      { name: "محطة عرفات 3", distanceMeters: 1200, etaMinutes: 14 },
      { name: "محطة المشعر", distanceMeters: 2600, etaMinutes: 26 },
    ],
  });

  // --- Emergency contacts, health tips ---------------------------------------
  await prisma.emergencyContact.createMany({
    data: [
      { label: "الطوارئ العامة", number: "911", order: 0 },
      { label: "الهلال الأحمر السعودي", number: "937", order: 1 },
      { label: "طلب إسعاف عاجل", number: "997", order: 2 },
    ],
  });

  await prisma.healthTip.createMany({
    data: [
      { text: "اشرب الماء بانتظام للحفاظ على الترطيب", icon: "droplets", order: 0 },
      { text: "تجنب التعرض المباشر للشمس خصوصاً وقت الظهيرة", icon: "sun", order: 1 },
      { text: "احرص على الراحة والنوم الكافي", icon: "moon", order: 2 },
      { text: "ابتعد عن الازدحام إن أمكن للحفاظ على سلامتك وسلامة الآخرين", icon: "shield-check", order: 3 },
    ],
  });

  // --- AI Assistant suggested prompts -----------------------------------------
  await prisma.suggestedPrompt.createMany({
    data: [
      { textAr: "ما هو أفضل وقت للطواف اليوم؟", textEn: "What's the best time for Tawaf today?", icon: "clock", order: 0 },
      { textAr: "أقرب مركز صحي", textEn: "Nearest health center", icon: "heart-pulse", order: 1 },
      { textAr: "أين أقرب دورة مياه؟", textEn: "Where is the nearest restroom?", icon: "map-pin", order: 2 },
      { textAr: "أريد الإبلاغ عن مشكلة", textEn: "I'd like to report a problem", icon: "alert-triangle", order: 3 },
    ],
  });

  // --- Environmental status (weather/AQI/crowd banner) ------------------------
  await prisma.environmentStatus.create({
    data: {
      temperatureC: 42,
      weatherIcon: "sun",
      airQualityAqi: 35,
      airQualityLabel: "جيدة",
      overallCrowd: CrowdLevelLabel.MODERATE,
    },
  });

  // --- Notifications / reminders ----------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        titleAr: "تذكير",
        titleEn: "Reminder",
        bodyAr: "تأكد من حمل بطاقة نسك معك دائماً.",
        bodyEn: "Make sure to carry your Nusuk card at all times.",
        icon: "id-card",
      },
      {
        titleAr: "تذكير",
        titleEn: "Reminder",
        bodyAr: "احرص على شرب الماء بشكل منتظم.",
        bodyEn: "Remember to drink water regularly.",
        icon: "droplets",
      },
      {
        titleAr: "تذكير",
        titleEn: "Reminder",
        bodyAr: "اتبع اللوحات الإرشادية داخل المشاعر.",
        bodyEn: "Follow the directional signage within the holy sites.",
        icon: "signpost",
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`Primary demo pilgrim: ${mainPilgrim.name} (${mainPilgrim.pilgrimNumber})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

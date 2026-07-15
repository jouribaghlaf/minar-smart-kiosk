"use client";

import { Accessibility, Contrast, Minus, MousePointer2, Plus, RotateCcw, Volume1, Volume2, Type } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { useAccessibility } from "@/hooks/useAccessibility";

export function AccessibilityDrawer() {
  const { activeDrawer, closeDrawer } = useDrawer();
  const { t } = useLanguage();
  const { settings, increaseFont, decreaseFont, increaseVolume, decreaseVolume, toggleHighContrast, toggleLargeButtons, toggleTextToSpeech, toggleReducedMotion, resetSettings, speak } = useAccessibility();
  const Toggle = ({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: typeof Contrast }) => <button type="button" onClick={onClick} className={`flex h-touch items-center justify-between rounded-2xl border-2 px-4 font-semibold ${active ? "border-brand-700 bg-brand-100 text-brand-900" : "border-cream-300 bg-white text-ink-700"}`}><span className="flex items-center gap-3"><Icon className="h-5 w-5" />{label}</span><span>{active ? t("مفعّل", "On") : t("متوقف", "Off")}</span></button>;
  return <Drawer isOpen={activeDrawer === "accessibility"} onClose={closeDrawer} title={t("إمكانية الوصول والصوت", "Accessibility & Sound")} icon={<Accessibility className="h-6 w-6" />}>
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl bg-cream-100 p-4"><h3 className="flex items-center gap-2 font-bold"><Type className="h-5 w-5" />{t("حجم النص", "Text size")}</h3><div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><button onClick={decreaseFont} className="h-touch rounded-2xl bg-white"><Minus className="mx-auto" /></button><strong>{Math.round(settings.fontScale * 100)}%</strong><button onClick={increaseFont} className="h-touch rounded-2xl bg-white"><Plus className="mx-auto" /></button></div></section>
      <section className="rounded-2xl bg-cream-100 p-4"><h3 className="flex items-center gap-2 font-bold"><Volume2 className="h-5 w-5" />{t("مستوى الصوت", "Volume")}</h3><div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><button onClick={decreaseVolume} className="h-touch rounded-2xl bg-white"><Volume1 className="mx-auto" /></button><strong>{Math.round(settings.volume * 100)}%</strong><button onClick={increaseVolume} className="h-touch rounded-2xl bg-white"><Volume2 className="mx-auto" /></button></div></section>
      <Toggle active={settings.textToSpeech} onClick={() => { toggleTextToSpeech(); if (!settings.textToSpeech) window.setTimeout(() => speak(t("تم تفعيل القراءة الصوتية", "Text to speech enabled")), 50); }} label={t("قارئ صوتي للنصوص", "Text reader")} icon={Volume2} />
      <Toggle active={settings.highContrast} onClick={toggleHighContrast} label={t("تباين مرتفع", "High contrast")} icon={Contrast} />
      <Toggle active={settings.largeButtons} onClick={toggleLargeButtons} label={t("أزرار كبيرة", "Large buttons")} icon={MousePointer2} />
      <Toggle active={settings.reducedMotion} onClick={toggleReducedMotion} label={t("تقليل الحركة", "Reduce motion")} icon={Accessibility} />
      <button onClick={resetSettings} className="flex h-touch items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 font-bold text-brand-700"><RotateCcw className="h-5 w-5" />{t("إعادة الإعدادات", "Reset settings")}</button>
    </div>
  </Drawer>;
}

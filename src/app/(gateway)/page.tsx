"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Languages, Search, ShieldCheck, Sparkles } from "lucide-react";
import { MinarLogo } from "@/components/common/MinarLogo";
import { useLanguage } from "@/hooks/useLanguage";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/mock-data/languages";

const QUICK_CODES = ["ar", "en", "ur", "id", "tr"];

export default function WelcomePage() {
  const router = useRouter();
  const { direction, setPreferredLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SupportedLanguage | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return term ? SUPPORTED_LANGUAGES.filter((item) => `${item.nativeName} ${item.name} ${item.code}`.toLocaleLowerCase().includes(term)) : SUPPORTED_LANGUAGES;
  }, [query]);

  const chooseLanguage = (item: SupportedLanguage) => {
    setSelected(item);
    setQuery(`${item.nativeName} — ${item.name}`);
    setPreferredLanguage(item);
    setIsOpen(false);
  };

  const continueToSignIn = () => {
    if (!selected) return;
    sessionStorage.setItem("minar_flow_started", "true");
    router.push("/identify");
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-cream-100 px-5 py-8 text-ink-900">
      <div className="heritage-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-2 bg-gold-500" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col overflow-hidden rounded-[2.25rem] border border-gold-100 bg-white shadow-[0_30px_80px_rgba(0,59,53,.14)]">
        <header className="flex items-center justify-between border-b border-white/10 bg-brand-900 px-6 py-4 text-white sm:px-9">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500 text-brand-900"><MinarLogo className="h-8 w-8" /></span>
            <div><p className="text-kiosk-base font-bold">مِنار</p><p className="text-xs text-white/55">منصة الخدمة الذاتية الذكية</p></div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/65 sm:flex"><ShieldCheck className="h-5 w-5 text-gold-400" /> تجربة آمنة لخدمة ضيوف الرحمن</div>
        </header>

        <div className="grid flex-1 lg:grid-cols-[1.05fr_.95fr]">
          <section className="relative flex flex-col justify-center overflow-hidden bg-brand-900 px-7 py-12 text-white sm:px-12 lg:px-16">
            <div className="ministry-ornament absolute inset-x-0 top-0 h-2 opacity-80" />
            <div className="absolute -end-28 top-16 h-72 w-72 rounded-full border border-gold-400/15" />
            <div className="absolute -end-16 top-28 h-48 w-48 rounded-full border border-gold-400/10" />
            <div className="relative max-w-2xl">
              <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-white/5 px-4 py-2 text-sm font-semibold text-gold-400"><Sparkles className="h-4 w-4" /> مدعوم بالذكاء الاصطناعي</span>
              <p className="mb-3 text-kiosk-sm font-semibold text-gold-400">مرحبًا بك في</p>
              <h1 className="text-[3.5rem] font-bold leading-none sm:text-[4.5rem]">مِنار</h1>
              <p className="mt-5 text-kiosk-xl font-semibold leading-relaxed">رفيقك الذكي لخدمة ضيوف الرحمن</p>
              <p className="mt-4 max-w-xl text-kiosk-sm leading-relaxed text-white/65">إرشاد، مساعدة، صحة وتنقّل في تجربة موحّدة تراعي لغتك واحتياجاتك.</p>
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
                {["سهل", "موثوق", "متعدد اللغات"].map((label) => <span key={label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center text-sm text-white/70">{label}</span>)}
              </div>
            </div>
          </section>

          <section className="flex items-center bg-cream-100 p-6 sm:p-10 lg:p-12">
            <div className="w-full rounded-[2rem] border border-cream-300 bg-white p-7 shadow-card sm:p-9">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Languages className="h-7 w-7" /></span>
              <h2 className="text-kiosk-xl font-bold text-brand-900">اختر لغتك</h2>
              <p className="mt-2 text-kiosk-xs leading-relaxed text-ink-500">ابحث باسم اللغة أو رمزها. ستتكيف النصوص واتجاه الواجهة تلقائيًا.</p>

              <div className="relative mt-6">
                <label htmlFor="language-search" className="mb-2 block text-kiosk-xs font-bold text-brand-900">البحث عن لغة</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600" />
                  <input id="language-search" role="combobox" aria-expanded={isOpen} aria-controls="language-options" value={query} onFocus={() => setIsOpen(true)} onChange={(event) => { setQuery(event.target.value); setSelected(null); setIsOpen(true); }} placeholder="العربية، Urdu، Indonesian..." autoComplete="off" className="h-touch w-full rounded-2xl border-2 border-cream-300 bg-cream-100 ps-12 pe-4 text-kiosk-sm outline-none transition focus:border-gold-500 focus:bg-white" />
                </div>
                {isOpen && (
                  <ul id="language-options" role="listbox" className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-cream-300 bg-white p-2 shadow-xl">
                    {filtered.slice(0, 12).map((item) => <li key={item.code}><button type="button" onClick={() => chooseLanguage(item)} className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-start hover:bg-brand-50"><span><strong>{item.nativeName}</strong><span className="ms-2 text-sm text-ink-300">{item.name}</span></span>{selected?.code === item.code && <Check className="h-5 w-5 text-brand-600" />}</button></li>)}
                    {filtered.length === 0 && <li className="p-4 text-center text-ink-500">لم يتم العثور على لغة مطابقة</li>}
                  </ul>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_CODES.map((code) => { const item = SUPPORTED_LANGUAGES.find((language) => language.code === code)!; return <button key={code} type="button" onClick={() => chooseLanguage(item)} className={`min-h-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${selected?.code === code ? "border-gold-500 bg-gold-100 text-brand-900" : "border-brand-100 bg-brand-50 text-brand-800 hover:border-gold-400"}`}>{item.nativeName}</button>; })}
              </div>
              <button type="button" disabled={!selected} onClick={continueToSignIn} className="mt-7 flex h-touch-lg w-full items-center justify-center gap-3 rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-bold text-white shadow-card transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">المتابعة <ArrowIcon className="h-5 w-5" /></button>
              <p className="mt-4 text-center text-xs text-ink-300">باختيار المتابعة تبدأ جلسة مؤقتة تُمسح عند تسجيل الخروج.</p>
            </div>
          </section>
        </div>
        <div className="ministry-ornament h-2" />
      </div>
    </main>
  );
}

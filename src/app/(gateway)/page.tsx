"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Languages, Search, Sparkles } from "lucide-react";
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
    if (!term) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter((item) => `${item.nativeName} ${item.name} ${item.code}`.toLocaleLowerCase().includes(term));
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
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-brand-900 px-5 py-10 text-white">
      <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="absolute -bottom-40 -end-20 h-[30rem] w-[30rem] rounded-full bg-brand-500/30 blur-3xl" />
      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <section className="text-center lg:text-start">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3">
            <MinarLogo className="h-10 w-10 text-gold-400" />
            <span className="text-kiosk-xl font-bold">مِنار</span>
          </div>
          <h1 className="text-kiosk-3xl font-bold leading-tight sm:text-[3.5rem]">مرحبًا بك في <span className="text-gold-400">مِنار</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-kiosk-lg leading-relaxed text-white/75 lg:mx-0">رفيقك الذكي لخدمة ضيوف الرحمن</p>
          <p className="mx-auto mt-5 max-w-xl text-kiosk-sm leading-relaxed text-white/55 lg:mx-0">خدمات الإرشاد والمساعدة والصحة والتنقل في تجربة واحدة سهلة وآمنة.</p>
          <div className="mt-7 inline-flex items-center gap-2 text-kiosk-xs text-gold-400"><Sparkles className="h-5 w-5" /> مدعوم بالذكاء الاصطناعي</div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 text-ink-900 shadow-2xl sm:p-9">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Languages className="h-7 w-7" /></span>
          <h2 className="text-kiosk-xl font-bold text-brand-900">اختر لغتك</h2>
          <p className="mt-2 text-kiosk-xs text-ink-500">ابحث باسم اللغة أو اكتب رمزها، ثم اخترها لتكييف اتجاه الواجهة تلقائيًا.</p>

          <div className="relative mt-6">
            <label htmlFor="language-search" className="mb-2 block text-kiosk-xs font-semibold">البحث عن لغة</label>
            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" />
              <input id="language-search" role="combobox" aria-expanded={isOpen} aria-controls="language-options" value={query} onFocus={() => setIsOpen(true)} onChange={(event) => { setQuery(event.target.value); setSelected(null); setIsOpen(true); }} placeholder="العربية، Urdu، Indonesian..." autoComplete="off" className="h-touch w-full rounded-2xl border-2 border-cream-300 bg-cream-100 ps-12 pe-4 text-kiosk-sm outline-none focus:border-brand-600" />
            </div>
            {isOpen && (
              <ul id="language-options" role="listbox" className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-cream-300 bg-white p-2 shadow-xl">
                {filtered.slice(0, 12).map((item) => (
                  <li key={item.code}><button type="button" onClick={() => chooseLanguage(item)} className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-start hover:bg-brand-50"><span><strong>{item.nativeName}</strong><span className="ms-2 text-sm text-ink-300">{item.name}</span></span>{selected?.code === item.code && <Check className="h-5 w-5 text-brand-600" />}</button></li>
                ))}
                {filtered.length === 0 && <li className="p-4 text-center text-ink-500">لم يتم العثور على لغة مطابقة</li>}
              </ul>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_CODES.map((code) => { const item = SUPPORTED_LANGUAGES.find((language) => language.code === code)!; return <button key={code} type="button" onClick={() => chooseLanguage(item)} className="min-h-0 rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">{item.nativeName}</button>; })}
          </div>
          <button type="button" disabled={!selected} onClick={continueToSignIn} className="mt-7 flex h-touch-lg w-full items-center justify-center gap-3 rounded-2xl bg-brand-700 px-6 text-kiosk-sm font-bold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">المتابعة <ArrowIcon className="h-5 w-5" /></button>
        </section>
      </div>
    </main>
  );
}

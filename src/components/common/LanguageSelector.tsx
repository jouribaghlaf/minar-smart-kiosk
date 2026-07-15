"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SUPPORTED_LANGUAGES } from "@/lib/mock-data/languages";

export function LanguageSelector() {
  const { preferredLanguage, setPreferredLanguage } = useLanguage();
  return (
    <label className="flex h-12 items-center gap-2 rounded-2xl border border-cream-300 bg-white px-3 text-ink-700">
      <Globe className="h-5 w-5 text-brand-700" />
      <span className="sr-only">Language</span>
      <select aria-label="Language" value={preferredLanguage.code} onChange={(event) => { const language = SUPPORTED_LANGUAGES.find((item) => item.code === event.target.value); if (language) setPreferredLanguage(language); }} className="max-w-40 bg-transparent text-sm font-semibold outline-none">
        {SUPPORTED_LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.nativeName}</option>)}
      </select>
    </label>
  );
}

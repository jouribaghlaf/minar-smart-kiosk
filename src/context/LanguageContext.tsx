"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SystemLanguage } from "@/types";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/mock-data/languages";
import { translateUi } from "@/lib/i18n/uiTranslations";

interface LanguageContextValue {
  language: SystemLanguage;
  preferredLanguage: SupportedLanguage;
  direction: "rtl" | "ltr";
  setLanguage: (language: SystemLanguage) => void;
  setPreferredLanguage: (language: SupportedLanguage) => void;
  resetLanguage: () => void;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "minar_preferred_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [preferredLanguage, setPreferredLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const selected = SUPPORTED_LANGUAGES.find((item) => item.code === stored);
    if (selected) setPreferredLanguageState(selected);
  }, []);

  const setPreferredLanguage = useCallback((selected: SupportedLanguage) => {
    setPreferredLanguageState(selected);
    window.localStorage.setItem(STORAGE_KEY, selected.code);
  }, []);

  const setLanguage = useCallback((language: SystemLanguage) => {
    setPreferredLanguage(language === "AR" ? DEFAULT_LANGUAGE : SUPPORTED_LANGUAGES[1]!);
  }, [setPreferredLanguage]);

  const resetLanguage = useCallback(() => {
    setPreferredLanguageState(DEFAULT_LANGUAGE);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleLanguage = useCallback(() => {
    setPreferredLanguage(preferredLanguage.code === "ar" ? SUPPORTED_LANGUAGES[1]! : DEFAULT_LANGUAGE);
  }, [preferredLanguage.code, setPreferredLanguage]);

  const language: SystemLanguage = preferredLanguage.code === "ar" ? "AR" : "EN";
  const direction = preferredLanguage.direction;

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", preferredLanguage.code);
  }, [direction, preferredLanguage.code]);

  const t = useCallback((ar: string, en: string) => translateUi(preferredLanguage.code, ar, en), [preferredLanguage.code]);
  const value = useMemo(() => ({ language, preferredLanguage, direction, setLanguage, setPreferredLanguage, resetLanguage, toggleLanguage, t }), [language, preferredLanguage, direction, setLanguage, setPreferredLanguage, resetLanguage, toggleLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

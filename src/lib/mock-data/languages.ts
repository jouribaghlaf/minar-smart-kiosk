export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: "rtl" | "ltr";
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr" },
  { code: "fa", name: "Persian", nativeName: "فارسی", direction: "rtl" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", direction: "rtl" },
  { code: "he", name: "Hebrew", nativeName: "עברית", direction: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", direction: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", direction: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", direction: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", direction: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", direction: "ltr" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", direction: "ltr" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", direction: "ltr" },
  { code: "so", name: "Somali", nativeName: "Soomaali", direction: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", direction: "ltr" },
  { code: "uz", name: "Uzbek", nativeName: "O‘zbekcha", direction: "ltr" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", direction: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", direction: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", direction: "ltr" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", direction: "ltr" },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]!;


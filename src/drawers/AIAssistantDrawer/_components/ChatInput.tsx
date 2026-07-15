"use client";

import { useState, type FormEvent } from "react";
import { Send, Mic } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (text: string) => void;
  onVoiceResult: (text: string) => void;
  disabled?: boolean;
}

/** No real speech-to-text is available in this environment; this
 *  simulates the capture step (listening animation + delay) and then
 *  hands back a plausible recognized phrase, exercising the full
 *  voice -> assistant -> reply pipeline end to end. Swapping in the Web
 *  Speech API or a real STT service later only touches this function. */
const MOCK_VOICE_PHRASES = [
  "ما هو أفضل وقت للطواف اليوم؟",
  "أين أقرب مركز صحي؟",
  "أريد الإبلاغ عن مشكلة",
];

export function ChatInput({ onSend, onVoiceResult, disabled }: ChatInputProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleVoice = () => {
    if (isListening || disabled) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const phrase = MOCK_VOICE_PHRASES[Math.floor(Math.random() * MOCK_VOICE_PHRASES.length)];
      onVoiceResult(phrase!);
    }, 1800);
  };

  return (
    <div>
      {isListening && (
        <p className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold text-brand-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-700" />
          </span>
          {t("أستمع إليك الآن...", "Listening...")}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          data-touch-target
          onClick={handleVoice}
          disabled={disabled}
          aria-label={t("إدخال صوتي", "Voice input")}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50",
            isListening ? "bg-status-bad text-white" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          )}
        >
          <Mic className="h-5 w-5" aria-hidden="true" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={t("اكتب سؤالك هنا...", "Type your question here...")}
          className="h-12 flex-1 rounded-2xl border border-cream-300 bg-white px-4 text-kiosk-xs text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          data-touch-target
          disabled={disabled || !value.trim()}
          aria-label={t("إرسال", "Send")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
        >
          <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import { Drawer } from "@/components/common/Drawer";
import { useDrawer } from "@/hooks/useDrawer";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import { ChatBubble } from "./_components/ChatBubble";
import { TypingIndicator } from "./_components/TypingIndicator";
import { SuggestedPromptChips } from "./_components/SuggestedPromptChips";
import { ChatInput } from "./_components/ChatInput";
import type { ChatMessage } from "@/types/chat";

/**
 * Screen 05 — AI Assistant Drawer.
 *
 * PUBLIC by default: guests can ask questions, use voice input, and
 * navigate to any public service with zero identification required —
 * this drawer never checks or requires a session to function. When a
 * real identification session exists (`useSession().pilgrim`), replies
 * are personalized server-side (see app/api/ai/assistant/route.ts, which
 * resolves the pilgrim from the actual session cookie — never from
 * anything this component sends), and the initial greeting uses the
 * pilgrim's name locally. Guests simply get the generic greeting and
 * generic replies — there is no "fake pilgrim" fallback anywhere.
 *
 * This component is declared once and mounted once at the root layout
 * (see app/layout.tsx); since it never unmounts, the conversation
 * persists across opening/closing the drawer within the same visit.
 */
export function AIAssistantDrawer() {
  const { activeDrawer, closeDrawer } = useDrawer();
  const { t, language } = useLanguage();
  const { pilgrim } = useSession();
  const isOpen = activeDrawer === "ai-assistant";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef<string>(nanoid(16));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed the welcome message once. Re-seeds if the language changes
  // before the pilgrim has sent anything, so switching AR/EN before
  // typing doesn't leave a stale-language greeting.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 1) return prev; // real conversation already started
      const greeting = pilgrim
        ? t(`مرحباً ${pilgrim.name} 👋`, `Hello ${pilgrim.name} 👋`)
        : t("مرحباً بك في منار 👋", "Welcome to Minar 👋");
      const intro = t(
        "أنا مساعدك الذكي في منار، كيف يمكنني مساعدتك اليوم؟",
        "I'm your Minar AI Assistant — how can I help you today?"
      );
      const welcome: ChatMessage = {
        id: "welcome",
        sender: "ASSISTANT",
        text: `${greeting}\n${intro}`,
        createdAt: new Date().toISOString(),
      };
      return [welcome];
    });
  }, [pilgrim, language, t]);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: nanoid(10),
      sender: "USER",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, message: text, language }),
      });
      const data = await res.json();
      if (data?.reply) {
        setMessages((prev) => [...prev, data.reply as ChatMessage]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(10),
          sender: "ASSISTANT",
          text: t(
            "تعذر الاتصال بالمساعد الذكي حالياً. يرجى المحاولة مرة أخرى.",
            "Couldn't reach the AI Assistant right now. Please try again."
          ),
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      title={t("المساعد الذكي", "AI Assistant")}
      icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
      footer={
        <div className="flex flex-col gap-3">
          <SuggestedPromptChips onSelect={handleSend} disabled={isSending} />
          <ChatInput onSend={handleSend} onVoiceResult={handleSend} disabled={isSending} />
        </div>
      }
    >
      <div ref={scrollRef} className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isSending && <TypingIndicator />}
      </div>
    </Drawer>
  );
}

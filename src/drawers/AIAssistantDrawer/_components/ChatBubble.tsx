"use client";

import { useRouter } from "next/navigation";
import { Sparkles, User, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useDrawer } from "@/hooks/useDrawer";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage } from "@/types/chat";

export function ChatBubble({ message, onAction }: { message: ChatMessage; onAction?: (actionId: NonNullable<ChatMessage["suggestedActions"]>[number]["actionId"]) => void }) {
  const { direction } = useLanguage();
  const router = useRouter();
  const { closeDrawer } = useDrawer();
  const isUser = message.sender === "USER";
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const handleAction = (href?: string, actionId?: NonNullable<ChatMessage["suggestedActions"]>[number]["actionId"]) => {
    if (actionId) {
      onAction?.(actionId);
      return;
    }
    if (!href) return;
    router.push(href);
    closeDrawer();
  };

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-brand-100 text-brand-700" : "bg-brand-700 text-white"
        )}
      >
        {isUser ? <User className="h-4 w-4" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
      </span>

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-2.5 text-kiosk-xs leading-relaxed",
            isUser ? "bg-brand-700 text-white" : "bg-cream-100 text-ink-900"
          )}
        >
          {message.text}
        </div>

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.suggestedActions.map((action) => (
              <button
                key={action.href ?? action.actionId}
                type="button"
                onClick={() => handleAction(action.href, action.actionId)}
                className="flex items-center gap-1.5 rounded-pill border border-brand-200 bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {action.label}
                <ArrowIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

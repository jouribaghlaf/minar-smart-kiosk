"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAccessibility } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils/cn";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  /** Tailwind max-width class for the panel. Defaults to a comfortable
   *  reading width for chat/settings content on a large kiosk display. */
  widthClassName?: string;
  footer?: ReactNode;
}

/**
 * Shared chrome for the AI Assistant, Accessibility, and Notification
 * drawers: backdrop, header with title/close button, scrollable body, and
 * an optional footer slot. Opens "above the current screen without
 * changing the current page" — it's a fixed overlay, never a route.
 *
 * Slides in from the reading-end edge (left in RTL, right in LTR) via
 * `direction` from LanguageContext, and respects the Accessibility
 * "Reduced Motion" setting by collapsing the transition to a simple fade.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  icon,
  children,
  widthClassName = "max-w-lg",
  footer,
}: DrawerProps) {
  const { direction } = useLanguage();
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const offscreenX = direction === "rtl" ? "-100%" : "100%";
  const transition = settings.reducedMotion
    ? { duration: 0.01 }
    : { type: "tween" as const, duration: 0.32, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-ink-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: settings.reducedMotion ? 0.01 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "fixed inset-y-0 z-50 flex w-full flex-col bg-white shadow-drawer",
              direction === "rtl" ? "start-0" : "end-0",
              widthClassName
            )}
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={transition}
          >
            <header className="flex items-center justify-between gap-3 border-b border-cream-200 px-6 py-5">
              <div className="flex items-center gap-3">
                {icon && <span className="text-brand-700">{icon}</span>}
                <h2 className="text-kiosk-lg font-bold text-brand-900">{title}</h2>
              </div>
              <button
                type="button"
                data-touch-target
                onClick={onClose}
                aria-label="Close"
                className="flex h-12 w-12 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-100"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && <footer className="border-t border-cream-200 px-6 py-4">{footer}</footer>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

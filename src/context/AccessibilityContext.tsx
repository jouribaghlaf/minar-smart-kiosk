"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  type AccessibilitySettings,
} from "@/types/accessibility";

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  increaseFont: () => void;
  decreaseFont: () => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
  toggleHighContrast: () => void;
  toggleColorBlindMode: () => void;
  toggleLargeButtons: () => void;
  toggleTextToSpeech: () => void;
  toggleVoiceCommands: () => void;
  toggleReducedMotion: () => void;
  toggleWheelchairMode: () => void;
  resetSettings: () => void;
  /** Reads the current text-to-speech setting and, if enabled, speaks it. */
  speak: (text: string) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "minar_accessibility";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);

  // Load persisted settings once on mount (kiosk sessions are typically
  // short-lived, but this also makes local development convenient).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  const persist = useCallback((next: AccessibilitySettings) => {
    setSettings(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  // Apply settings to the document root so every screen/component picks
  // them up automatically via CSS (--a11y-font-scale) and utility classes
  // (a11y-high-contrast, a11y-large-buttons, a11y-reduced-motion,
  // a11y-wheelchair-mode) without each component needing to read context.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", String(settings.fontScale));
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-color-blind", settings.colorBlindMode);
    root.classList.toggle("a11y-large-buttons", settings.largeButtons);
    root.classList.toggle("a11y-reduced-motion", settings.reducedMotion);
    root.classList.toggle("a11y-wheelchair-mode", settings.wheelchairMode);
  }, [settings]);

  const increaseFont = useCallback(() => {
    persist({
      ...settings,
      fontScale: Math.min(FONT_SCALE_MAX, +(settings.fontScale + FONT_SCALE_STEP).toFixed(2)),
    });
  }, [settings, persist]);

  const decreaseFont = useCallback(() => {
    persist({
      ...settings,
      fontScale: Math.max(FONT_SCALE_MIN, +(settings.fontScale - FONT_SCALE_STEP).toFixed(2)),
    });
  }, [settings, persist]);
  const increaseVolume = useCallback(() => persist({ ...settings, volume: Math.min(1, +(settings.volume + 0.1).toFixed(1)) }), [settings, persist]);
  const decreaseVolume = useCallback(() => persist({ ...settings, volume: Math.max(0, +(settings.volume - 0.1).toFixed(1)) }), [settings, persist]);

  const toggleHighContrast = useCallback(
    () => persist({ ...settings, highContrast: !settings.highContrast }),
    [settings, persist]
  );
  const toggleColorBlindMode = useCallback(
    () => persist({ ...settings, colorBlindMode: !settings.colorBlindMode }),
    [settings, persist]
  );
  const toggleLargeButtons = useCallback(
    () => persist({ ...settings, largeButtons: !settings.largeButtons }),
    [settings, persist]
  );
  const toggleTextToSpeech = useCallback(
    () => persist({ ...settings, textToSpeech: !settings.textToSpeech }),
    [settings, persist]
  );
  const toggleVoiceCommands = useCallback(
    () => persist({ ...settings, voiceCommands: !settings.voiceCommands }),
    [settings, persist]
  );
  const toggleReducedMotion = useCallback(
    () => persist({ ...settings, reducedMotion: !settings.reducedMotion }),
    [settings, persist]
  );
  const toggleWheelchairMode = useCallback(
    () => persist({ ...settings, wheelchairMode: !settings.wheelchairMode }),
    [settings, persist]
  );
  const resetSettings = useCallback(
    () => persist(DEFAULT_ACCESSIBILITY_SETTINGS),
    [persist]
  );

  const speak = useCallback(
    (text: string) => {
      if (!settings.textToSpeech) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = settings.volume;
      window.speechSynthesis.speak(utterance);
    },
    [settings.textToSpeech, settings.volume]
  );

  const value = useMemo(
    () => ({
      settings,
      increaseFont,
      decreaseFont,
      increaseVolume,
      decreaseVolume,
      toggleHighContrast,
      toggleColorBlindMode,
      toggleLargeButtons,
      toggleTextToSpeech,
      toggleVoiceCommands,
      toggleReducedMotion,
      toggleWheelchairMode,
      resetSettings,
      speak,
    }),
    [
      settings,
      increaseFont,
      decreaseFont,
      increaseVolume,
      decreaseVolume,
      toggleHighContrast,
      toggleColorBlindMode,
      toggleLargeButtons,
      toggleTextToSpeech,
      toggleVoiceCommands,
      toggleReducedMotion,
      toggleWheelchairMode,
      resetSettings,
      speak,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

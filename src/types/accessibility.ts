export interface AccessibilitySettings {
  /** Multiplier applied on top of the kiosk base font scale. 1 = default. */
  fontScale: number;
  highContrast: boolean;
  colorBlindMode: boolean;
  largeButtons: boolean;
  textToSpeech: boolean;
  voiceCommands: boolean;
  reducedMotion: boolean;
  wheelchairMode: boolean;
  volume: number;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  highContrast: false,
  colorBlindMode: false,
  largeButtons: false,
  textToSpeech: false,
  voiceCommands: false,
  reducedMotion: false,
  wheelchairMode: false,
  volume: 0.8,
};

export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 1.6;
export const FONT_SCALE_STEP = 0.1;

import { useContext } from "react";
import { AccessibilityContext } from "@/context/AccessibilityContext";

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within an AccessibilityProvider");
  return ctx;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names (clsx) and safely merges conflicting
 * Tailwind utility classes (tailwind-merge). Used by every component so
 * consumers can override styles via a `className` prop without fighting
 * specificity.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

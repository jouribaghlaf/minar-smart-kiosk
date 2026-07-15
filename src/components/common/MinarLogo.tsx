import { cn } from "@/lib/utils/cn";

/**
 * Original, abstract arch + crescent glyph representing the Minar brand
 * mark. Deliberately simple/geometric (not a reproduction of any specific
 * copyrighted artwork or photograph) so it can stand in for the real brand
 * asset until one is supplied.
 */
export function MinarLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <path
        d="M24 4C14 4 10 14 10 22v18h6V24a8 8 0 0 1 16 0v16h6V22C38 14 34 4 24 4Z"
        fill="currentColor"
      />
      <circle cx="24" cy="14" r="3" fill="currentColor" opacity="0.55" />
      <rect x="20" y="34" width="8" height="6" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

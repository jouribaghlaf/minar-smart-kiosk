/**
 * Original decorative arch pattern (concentric arch silhouettes), used as
 * a subtle background texture wherever the brand needs a Kaaba-adjacent
 * visual without reproducing an actual photograph — see the copyright
 * note in Screen 01's WelcomeBanner. Extracted here because Screen 03's
 * hero needs the identical treatment.
 */
export function ArchPatternBackground({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "absolute inset-0 h-full w-full opacity-20"}
      viewBox="0 0 800 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M ${i * 140 - 40} 220 C ${i * 140 - 40} 120, ${i * 140 + 60} 120, ${i * 140 + 60} 220`}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

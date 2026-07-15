"use client";

import { useEffect } from "react";

/**
 * Root error boundary. Must render its own <html>/<body> since it replaces
 * the root layout entirely when triggered (per Next.js App Router rules).
 * Kept minimal and dependency-free since this is the last line of defense.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100dvh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2.5rem",
            textAlign: "center",
            backgroundColor: "#F7F4EC",
            color: "#1A2420",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0B3B2E" }}>
            حدث خطأ غير متوقع في التطبيق
          </h1>
          <p style={{ maxWidth: "32rem", color: "#5B6560" }}>
            نعتذر عن هذا الخلل. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى.
          </p>
          <button
            onClick={reset}
            style={{
              height: "3.5rem",
              padding: "0 2rem",
              borderRadius: "1rem",
              backgroundColor: "#145C43",
              color: "white",
              fontWeight: 600,
              fontSize: "1.05rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}

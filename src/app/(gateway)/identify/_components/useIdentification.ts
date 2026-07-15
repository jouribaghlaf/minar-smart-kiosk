"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/hooks/useSession";
import type { IdentificationMethod, IdentificationResult, Pilgrim } from "@/types/pilgrim";

export type VerificationStep = 0 | 1 | 2 | 3;
export type IdentificationStatus = "idle" | "processing" | "success" | "error";

interface UseIdentificationResult {
  status: IdentificationStatus;
  step: VerificationStep;
  pilgrim: Pilgrim | null;
  errorMessage: string | null;
  /** Kicks off verification. `value` is omitted for FACE_RECOGNITION. */
  identify: (value?: string) => Promise<void>;
  reset: () => void;
}

const STEP_ADVANCE_INTERVAL_MS = 550;

/**
 * Encapsulates the entire identification workflow as a small state
 * machine, independent of any particular UI. The visual stepper is
 * advanced on a client-side timer (since the mock API resolves in one
 * shot rather than streaming progress) while the real request is
 * in-flight, then jumps to its final position once the response lands.
 *
 * SWAP POINT: when a real verification backend is connected, nothing
 * here needs to change except the `fetch("/api/identify", ...)` call
 * itself moving from a mocked response to a live one — the route already
 * returns the same `IdentificationResult` shape either way.
 */
export function useIdentification(method: IdentificationMethod): UseIdentificationResult {
  const [status, setStatus] = useState<IdentificationStatus>("idle");
  const [step, setStep] = useState<VerificationStep>(0);
  const [pilgrim, setPilgrimState] = useState<Pilgrim | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setPilgrim } = useSession();
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearStepTimer, [clearStepTimer]);

  const reset = useCallback(() => {
    clearStepTimer();
    setStatus("idle");
    setStep(0);
    setPilgrimState(null);
    setErrorMessage(null);
  }, [clearStepTimer]);

  const identify = useCallback(
    async (value?: string) => {
      clearStepTimer();
      setStatus("processing");
      setStep(0);
      setErrorMessage(null);

      // Advance the visible stepper up to "loading data" (index 2) while
      // the request is in flight; the final step (3, "تحديد اللغة") is
      // only reached once we actually have a response.
      stepTimerRef.current = setInterval(() => {
        setStep((prev) => (prev < 2 ? ((prev + 1) as VerificationStep) : prev));
      }, STEP_ADVANCE_INTERVAL_MS);

      try {
        const res = await fetch("/api/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method, value }),
        });
        const result: IdentificationResult = await res.json();

        clearStepTimer();
        setStep(3);

        if (result.success && result.pilgrim) {
          setPilgrimState(result.pilgrim);
          setPilgrim(result.pilgrim);
          setStatus("success");
        } else {
          setErrorMessage(result.errorMessage ?? null);
          setStatus("error");
        }
      } catch {
        clearStepTimer();
        setStep(3);
        setErrorMessage(null);
        setStatus("error");
      }
    },
    [method, clearStepTimer, setPilgrim]
  );

  return { status, step, pilgrim, errorMessage, identify, reset };
}

/**
 * Adds a small, randomized delay to mock service calls so loading states
 * (spinners, skeletons, "جاري التحقق...") behave the way they will once
 * real APIs (government ID verification, OpenAI, Maps) are wired in.
 *
 * Usage: `await simulateLatency()` before returning mock data from a
 * service function.
 */
export async function simulateLatency(minMs = 400, maxMs = 1100): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

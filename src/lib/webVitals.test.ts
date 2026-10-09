import { afterEach, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({
  callbacks: {} as Record<
    string,
    (metric: {
      name: string;
      value: number;
      rating: string;
      id: string;
    }) => void
  >,
}));
vi.mock("web-vitals", () =>
  Object.fromEntries(
    ["CLS", "INP", "LCP", "FCP", "TTFB"].map((name) => [
      `on${name}`,
      (callback: (typeof mock.callbacks)[string]) => {
        mock.callbacks[name] = callback;
      },
    ]),
  ),
);
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
}));
import { reportWebVitals, getPerformanceMetrics } from "./webVitals";
afterEach(() => vi.useRealTimers());
it("records measured Web Vitals without inventing TBT or TTI from unrelated timing entries", () => {
  vi.useFakeTimers();
  reportWebVitals();
  mock.callbacks.LCP({
    name: "LCP",
    value: 1800,
    rating: "good",
    id: "fixture",
  });
  window.dispatchEvent(new Event("load"));
  vi.advanceTimersByTime(4000);
  expect(getPerformanceMetrics().LCP.value).toBe(1800);
  expect(getPerformanceMetrics().TBT).toBeUndefined();
  expect(getPerformanceMetrics().TTI).toBeUndefined();
});

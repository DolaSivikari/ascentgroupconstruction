import { expect, it } from "vitest";
import { rateLimitDecision } from "../../../supabase/functions/_shared/rate-limit-contract";
it("preserves a real denied result rather than treating it as an infrastructure failure", () => {
  expect(
    rateLimitDecision(
      { allowed: false, retry_after_seconds: 30 },
      false,
      "allow",
    ),
  ).toEqual({ allowed: false, retry_after_seconds: 30 });
});
it.each([null, {}, { allowed: "yes" }])(
  "fails closed for costly operations on missing or malformed decisions",
  (data) => {
    expect(() => rateLimitDecision(data, false, "deny")).toThrow("unavailable");
  },
);
it("keeps validated intake available on infrastructure failures only when explicitly requested", () => {
  expect(rateLimitDecision(null, true, "allow")).toEqual({ allowed: true });
  expect(() => rateLimitDecision({ allowed: true }, true, "deny")).toThrow(
    "unavailable",
  );
});

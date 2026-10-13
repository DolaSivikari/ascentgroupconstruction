export interface RateLimitResult {
  allowed: boolean;
  request_count?: number;
  limit?: number;
  retry_after_seconds?: number;
}
/** Intake explicitly preserves availability; costly operations require a valid limit decision. */
export function rateLimitDecision(
  data: unknown,
  failed: boolean,
  failureMode: "allow" | "deny",
): RateLimitResult {
  if (
    !failed &&
    data !== null &&
    typeof data === "object" &&
    "allowed" in data &&
    typeof data.allowed === "boolean"
  ) {
    return data as RateLimitResult;
  }
  if (failureMode === "allow") return { allowed: true };
  throw new Error("Rate limit service unavailable; try again later");
}

export const ESTIMATING_EMAIL = "estimating@ascentgroupconstruction.com";
export function aggregateAlertStatus(statuses: string[]) {
  return !statuses.length
    ? "skipped"
    : statuses.every((s) => s === "sent")
      ? "sent"
      : statuses.every((s) => s === "suppressed")
        ? "suppressed"
        : statuses.some((s) => s === "sent")
          ? "partial"
          : "failed";
}
export function recipientList(rows: { email: string }[]) {
  return [
    ...new Set(rows.map((r) => r.email.trim().toLowerCase()).filter(Boolean)),
  ].sort();
}
export async function recipientKey(email: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(email.toLowerCase()),
  );
  return [...new Uint8Array(bytes)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
export function emailErrorCode(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "send_failed";
  return /^[a-zA-Z0-9_-]{1,100}$/.test(code) ? code : "send_failed";
}

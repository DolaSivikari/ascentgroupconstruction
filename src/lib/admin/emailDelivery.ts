export function maskRecipient(email: string): string {
  const split = email.lastIndexOf("@");
  return split > 0 ? `${email[0]}***${email.slice(split)}` : "Hidden recipient";
}
export function maskEmailAddresses(value: string): string {
  return value.replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    maskRecipient,
  );
}
export function emailLeadHref(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
    return null;
  const row = metadata as Record<string, unknown>;
  if (typeof row.rfp_id === "string" && /^[a-f0-9-]{36}$/i.test(row.rfp_id))
    return `/admin/inbox?tab=rfp&highlight=${encodeURIComponent(row.rfp_id)}`;
  if (
    typeof row.inquiry_id === "string" &&
    /^[a-f0-9-]{36}$/i.test(row.inquiry_id)
  )
    return `/admin/inbox?tab=leads&source=inquiry&highlight=${encodeURIComponent(row.inquiry_id)}`;
  return null;
}
export function emailDateRange(
  from: string,
  to: string,
): { start?: string; end?: string } {
  // Explicit UTC dates avoid silently changing filters with the browser timezone.
  return {
    start: from ? `${from}T00:00:00.000Z` : undefined,
    end: to
      ? new Date(Date.parse(`${to}T00:00:00.000Z`) + 86_400_000).toISOString()
      : undefined,
  };
}

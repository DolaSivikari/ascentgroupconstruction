/** Shared by the content editors; database text fields remain text. */
export const normalizeSlug = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const nullableDate = (value: string | null | undefined): string | null =>
  value?.trim() || null;

export const nullableInteger = (
  value: string | number | null | undefined,
  label: string,
): number | null => {
  if (value == null || (typeof value === "string" && !value.trim()))
    return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0)
    throw new Error(`${label} must be a non-negative whole number.`);
  return parsed;
};

export function adminErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const failure = error as { code?: string; message?: string };
    const reason =
      failure.code === "23505"
        ? "That value is already in use. Choose a unique slug or value."
        : failure.code === "22007" || failure.code === "22P02"
          ? "A date or number is invalid. Check the fields and try again."
          : failure.code === "42501"
            ? "Your account does not have permission for this change."
            : failure.message;
    if (reason) return reason;
  }
  return "The request could not be completed. Your edits are retained; try again.";
}

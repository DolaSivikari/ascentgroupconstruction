import { COMPANY_NAME, SITE_URL } from "@/constants/company";

export function pageTitle(title?: string): string {
  if (!title) return `${COMPANY_NAME} | Building Envelope & Restoration`;
  // Existing pages use both the full company name and the shorter trading name.
  return /\bascent(?:\s+group(?:\s+construction)?)?\b/i.test(title)
    ? title
    : `${title} | ${COMPANY_NAME}`;
}

/** Stored images may already be absolute; never prepend the site twice. */
export function publicImageUrl(image?: string): string {
  const fallback = `${SITE_URL}/og-image.png`;
  if (!image) return fallback;
  try {
    const url = new URL(image, `${SITE_URL}/`);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : fallback;
  } catch {
    return fallback;
  }
}

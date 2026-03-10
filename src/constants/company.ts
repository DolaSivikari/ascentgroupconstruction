/**
 * Canonical company constants.
 * Import from here instead of hardcoding values throughout the codebase.
 * SITE_URL falls back to the production URL if the env var is not set.
 */

export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://ascentgroupconstruction.com";

export const COMPANY_NAME = "Ascent Group Construction";

export const COMPANY_PHONE = "647-528-6804";
export const COMPANY_PHONE_E164 = "+1-647-528-6804";
export const COMPANY_PHONE_TEL = "tel:6475286804";

export const COMPANY_EMAIL = "info@ascentgroupconstruction.com";

export const COMPANY_ADDRESS = {
  street: "2 Jody Ave",
  city: "North York",
  province: "ON",
  postalCode: "M3N 1H1",
  country: "CA",
  full: "2 Jody Ave, North York, ON M3N 1H1",
};

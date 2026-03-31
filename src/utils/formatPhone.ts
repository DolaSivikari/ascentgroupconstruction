import { COMPANY_PHONE, COMPANY_PHONE_TEL } from "@/constants/company";

/**
 * Formats a raw digit string (e.g. "6475286804") into display format "(647) 528-6804".
 * Falls back to COMPANY_PHONE from constants if input is empty/invalid.
 */
export function formatPhoneDisplay(raw?: string | null): string {
  if (!raw) return COMPANY_PHONE;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw; // already formatted or non-standard
}

/**
 * Formats a raw digit string into a tel: link value (e.g. "tel:6475286804").
 * Falls back to COMPANY_PHONE_TEL from constants.
 */
export function formatPhoneTel(raw?: string | null): string {
  if (!raw) return COMPANY_PHONE_TEL;
  const digits = raw.replace(/\D/g, "");
  return digits ? `tel:${digits}` : COMPANY_PHONE_TEL;
}

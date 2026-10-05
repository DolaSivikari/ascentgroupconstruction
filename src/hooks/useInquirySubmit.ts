import { useRef } from "react";
import {
  inquirySchema,
  CONSENT_TEXT_VERSION,
  type InquirySubmission,
} from "@/lib/inquiry/schema";
import { visitorSupabase } from "@/lib/publicSettings";
/** Keep one key across an ambiguous retry; rotate it when the submitted fields change. */
export function useInquirySubmit() {
  const started = useRef(Date.now());
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);
  return async (
    input: Record<string, unknown>,
    honeypot = "",
    startedAt?: number,
  ) => {
    const normalized = JSON.parse(JSON.stringify(input));
    const fingerprint = JSON.stringify(normalized);
    if (!attempt.current || attempt.current.fingerprint !== fingerprint)
      attempt.current = { fingerprint, key: crypto.randomUUID() };
    const data: InquirySubmission = inquirySchema.parse({
      ...normalized,
      submission_key: attempt.current.key,
      consent_text_version: CONSENT_TEXT_VERSION,
      source_path: location.pathname,
    });
    const result = await visitorSupabase.functions.invoke("submit-form", {
      body: {
        formType: "inquiry",
        data,
        honeypot,
        startedAt: startedAt ?? started.current,
      },
    });
    if (
      result.error ||
      result.data?.success !== true ||
      typeof result.data.reference_code !== "string"
    )
      throw new Error(
        "Your request could not be confirmed. Retry with the same fields; an identical retry will not create another lead.",
      );
    // Retain the key through the success UI too, so a second click cannot create another row.
    return result.data as {
      success: true;
      id: string;
      reference_code: string;
      duplicate: boolean;
    };
  };
}

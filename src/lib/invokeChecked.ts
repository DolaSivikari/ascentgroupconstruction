import { supabase } from "@/integrations/supabase/client";

const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

/** Supabase reports HTTP/provider failures as resolved results, not only throws. */
export async function invokeChecked(
  name: string,
  options: { body: Record<string, unknown> },
) {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      supabase.functions.invoke<unknown>(name, {
        ...options,
        signal: controller.signal,
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("The request could not be confirmed in time."));
        }, 10000);
      }),
    ]);
    const data = record(result.data);
    if (
      result.error ||
      !data ||
      data.error ||
      data.success === false ||
      record(data.adminEmail)?.error ||
      record(data.userEmail)?.error
    ) {
      // Do not expose provider payloads, submitted contact details or secrets.
      throw new Error("The server could not confirm this request.");
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

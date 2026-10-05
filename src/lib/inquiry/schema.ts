import { z } from "zod";
export const CONSENT_TEXT_VERSION = "2026-10-04-v1";
export const CONSENT_TEXT =
  "I agree that Ascent Group Construction may contact me about this request.";
export const INQUIRY_TYPES = [
  "general",
  "estimate",
  "bid_invitation",
  "rfp",
  "prequal_request",
] as const;
export const INQUIRY_STATUSES = [
  "new",
  "reviewing",
  "bidding",
  "submitted",
  "won",
  "lost",
  "no_bid",
] as const;
export const PRIORITIES = ["urgent", "high", "normal", "low"] as const;
export function safeDrawingsUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      host.includes(".") &&
      !host.endsWith(".local") &&
      !host.endsWith(".localhost") &&
      host !== "localhost" &&
      !/^[\d.]+$/.test(host) &&
      !host.includes(":") &&
      value.length <= 2000
    );
  } catch {
    return false;
  }
}
const base = {
  submission_key: z.string().uuid(),
  contact_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).nullable().optional(),
  company: z.string().trim().max(200).nullable().optional(),
  requester_role: z
    .enum([
      "owner",
      "property_manager",
      "condo_board",
      "developer",
      "gc",
      "cm",
      "consultant",
      "architect",
      "homeowner",
      "other",
    ])
    .nullable()
    .optional(),
  project_name: z.string().trim().max(300).nullable().optional(),
  project_location: z.string().trim().max(500).nullable().optional(),
  message: z.string().trim().min(10).max(5000),
  urgency: z
    .enum(["emergency", "this_month", "planning"])
    .nullable()
    .optional(),
  bid_due_at: z.string().datetime({ offset: true }).nullable().optional(),
  drawings_url: z
    .string()
    .refine(
      safeDrawingsUrl,
      "Use a public HTTPS plan-room link without credentials",
    )
    .nullable()
    .optional(),
  attachment_paths: z
    .array(
      z
        .string()
        .max(1000)
        .regex(/^[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+$/)
        .refine((v) => !v.split("/").includes("..")),
    )
    .max(10)
    .optional(),
  prequal_requested: z.boolean().optional(),
  source_path: z
    .string()
    .max(500)
    .regex(/^\/(?!\/)[^?#]*$/),
  service_origin: z.string().max(200).nullable().optional(),
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
    })
    .strict()
    .optional(),
  details: z
    .record(
      z.string().regex(/^[a-zA-Z0-9_]{1,80}$/),
      z.union([
        z.string().max(5000),
        z.number().finite(),
        z.boolean(),
        z.array(z.string().max(500)).max(50),
        z.null(),
      ]),
    )
    .refine(
      (v) => JSON.stringify(v).length <= 20000,
      "Request details are too long",
    )
    .optional(),
  consent_given: z.literal(true),
  consent_text_version: z.literal(CONSENT_TEXT_VERSION),
};
export const inquirySchema = z.discriminatedUnion("inquiry_type", [
  z.object({ ...base, inquiry_type: z.literal("general") }).strict(),
  z
    .object({
      ...base,
      inquiry_type: z.literal("estimate"),
      project_location: z.string().trim().min(1).max(500),
    })
    .strict(),
  z
    .object({
      ...base,
      inquiry_type: z.literal("bid_invitation"),
      project_name: z.string().trim().min(1).max(300),
      company: z.string().trim().min(1).max(200),
      bid_due_at: z.string().datetime({ offset: true }),
    })
    .strict(),
  z
    .object({
      ...base,
      inquiry_type: z.literal("rfp"),
      project_name: z.string().trim().min(1).max(300),
    })
    .strict(),
  z.object({ ...base, inquiry_type: z.literal("prequal_request") }).strict(),
]);
export type InquirySubmission = z.infer<typeof inquirySchema>;
export function torontoDateTime(value: string): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error("Choose a complete date and time.");
  const parts = (instant: Date) =>
    Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(instant)
        .map((p) => [p.type, p.value]),
    );
  for (const offset of ["-04:00", "-05:00"]) {
    const date = new Date(`${value}:00${offset}`);
    if (!Number.isFinite(date.getTime())) continue;
    const p = parts(date);
    if (`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}` === value)
      return date.toISOString();
  }
  throw new Error(
    "That Toronto time does not exist because of daylight saving. Choose another time.",
  );
}
export function toTorontoInput(value: string | null) {
  if (!value) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

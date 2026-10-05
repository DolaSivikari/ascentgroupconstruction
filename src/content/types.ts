import { z } from "zod";
import { isSafeContentImage, isSafeEditorLink } from "@/lib/richText";
export type ContentKind =
  | "text"
  | "richtext"
  | "image"
  | "link"
  | "list"
  | "seo"
  | "flag";
export interface FieldMeta {
  label: string;
  section: string;
  kind: ContentKind;
  maxLength?: number;
  locked?: boolean;
  help?: string;
  consumers?: string[];
}
export interface ContentModule {
  id: string;
  defaults: Record<string, unknown>;
  meta: Record<string, FieldMeta>;
  schema: z.ZodType<Record<string, unknown>>;
}
export const PROTECTED_PAGES = new Set([
  "/",
  "/contact",
  "/services",
  "/projects",
  "/for-general-contractors",
  "/property-managers",
  "/prequalification",
  "/submit-rfp",
  "/estimate",
]);
export const PROTECTED_CONTENT_PAGES = new Set([
  "/capabilities",
  "/company/technology",
  "/resources/contractor-portal",
  "/company/certifications-insurance",
]);
export const isCredentialClaim = (text: string) =>
  /\b(WSIB|COR|CGL|insured|insurance|licensed|licensing|bond(?:ed|ing)|certif(?:ied|ication)|Sto|warranty|warranties|24\/7|years? experience|years? in business|clearance|training|tickets)\b|\$[\d,.]+[mM]?|\b\d+[- ](?:hour|year)|\b\d+%/i.test(
    text,
  );
export function fieldSchema(meta: FieldMeta) {
  if (meta.kind === "flag") return z.boolean();
  if (meta.kind === "seo")
    return z
      .object({
        title: z.string().max(120),
        description: z.string().max(320),
        image: z
          .string()
          .refine(
            (v) => !v || isSafeContentImage(v),
            "Choose an image from the media library",
          ),
        noindex: z.boolean(),
      })
      .strict();
  if (meta.kind === "image")
    return z
      .object({
        url: z
          .string()
          .refine(
            (v) => !v || isSafeContentImage(v),
            "Choose an image from the media library",
          ),
        alt: z.string().max(300),
      })
      .strict();
  if (meta.kind === "link")
    return z
      .string()
      .max(2000)
      .refine(
        (v) =>
          isSafeEditorLink(v) || /^\/(?!\/)/.test(v) || /^#[\w-]+$/.test(v),
      );
  return z.string().max(meta.maxLength || 5000);
}
export function defineContent(
  id: string,
  defaults: Record<string, unknown>,
  meta: Record<string, FieldMeta>,
): ContentModule {
  const protectedMeta = Object.fromEntries(
    Object.entries(meta).map(([key, field]) => [
      key,
      {
        ...field,
        locked:
          field.locked ||
          (typeof defaults[key] === "string" &&
            isCredentialClaim(defaults[key] as string)),
      },
    ]),
  );
  return {
    id,
    defaults,
    meta: protectedMeta,
    schema: z
      .object(
        Object.fromEntries(
          Object.entries(protectedMeta).map(([key, value]) => [
            key,
            fieldSchema(value),
          ]),
        ),
      )
      .strict(),
  };
}
export function pageId(path: string) {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}
export async function defaultHash(value: unknown) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(value)),
  );
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function resolveContentValues(
  module: ContentModule,
  values: Record<string, unknown>,
  enabled: boolean,
) {
  return Object.fromEntries(
    Object.entries(module.defaults).map(([key, fallback]) => {
      const meta = module.meta[key];
      const raw = enabled ? values[`${module.id}.${key}`] : undefined;
      if (!meta || meta.locked || raw === undefined || raw === null)
        return [key, fallback];
      const parsed = fieldSchema(meta).safeParse(raw);
      return [key, parsed.success ? parsed.data : fallback];
    }),
  );
}

/// <reference types="node" />
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  inquirySchema,
  torontoDateTime,
  toTorontoInput,
  safeDrawingsUrl,
  CONSENT_TEXT_VERSION,
} from "./schema";
const base = {
  inquiry_type: "general",
  submission_key: "00000000-0000-4000-8000-000000000001",
  contact_name: "李明 José O'Neil",
  email: "fixture@example.test",
  message: "This is a project inquiry.",
  source_path: "/contact",
  consent_given: true,
  consent_text_version: CONSENT_TEXT_VERSION,
};
describe("inquiry intake", () => {
  it("accepts international names and requires explicit consent", () => {
    expect(inquirySchema.safeParse(base).success).toBe(true);
    expect(
      inquirySchema.safeParse({ ...base, consent_given: false }).success,
    ).toBe(false);
  });
  it("requires project location for estimates and company/project/due time for bid invitations", () => {
    expect(
      inquirySchema.safeParse({ ...base, inquiry_type: "estimate" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({
        ...base,
        inquiry_type: "bid_invitation",
        company: "Fixture",
        project_name: "Demo",
        bid_due_at: "2026-11-02T14:00:00Z",
      }).success,
    ).toBe(true);
    expect(
      inquirySchema.safeParse({ ...base, inquiry_type: "bid_invitation" })
        .success,
    ).toBe(false);
  });
  it.each([
    "http://example.test/plans",
    "https://127.0.0.1/plans",
    "https://[::1]/plans",
    "https://localhost/plans",
    "https://user:pass@example.test/plans",
    "javascript:alert(1)",
  ])("rejects unsupported drawings URL %s", (url) =>
    expect(safeDrawingsUrl(url)).toBe(false),
  );
  it("converts Toronto deadlines through summer/winter time and rejects non-existent DST times", () => {
    expect(torontoDateTime("2026-07-01T09:00")).toBe(
      "2026-07-01T13:00:00.000Z",
    );
    expect(torontoDateTime("2026-12-01T09:00")).toBe(
      "2026-12-01T14:00:00.000Z",
    );
    expect(() => torontoDateTime("2026-03-08T02:30")).toThrow(/does not exist/);
    expect(torontoDateTime("2026-11-01T01:30")).toBe(
      "2026-11-01T05:30:00.000Z",
    );
    expect(toTorontoInput("2026-12-01T14:00:00Z")).toBe("2026-12-01T09:00");
  });
  it("keeps the frontend and edge discriminated-union contracts identical", () => {
    const frontend = readFileSync("src/lib/inquiry/schema.ts", "utf8")
      .split("export function torontoDateTime")[0]
      .replace('from "zod"', 'from "https://deno.land/x/zod@v3.22.4/mod.ts"')
      .trim();
    const backend = readFileSync(
      "supabase/functions/_shared/inquiry-schema.ts",
      "utf8",
    ).trim();
    expect(frontend).toBe(backend);
  });
});

it("preserves quote/RFP metadata and uploaded filenames with version dots, while rejecting nested or oversized detail data", () => {
  expect(
    inquirySchema.safeParse({
      ...base,
      attachment_paths: ["00000000-drawings.rev1.pdf"],
      details: {
        quote_type: "site_visit",
        nte_budget: 10000,
        scope_categories: ["masonry"],
        bonding_required: false,
      },
    }).success,
  ).toBe(true);
  expect(
    inquirySchema.safeParse({ ...base, attachment_paths: ["../private.pdf"] })
      .success,
  ).toBe(false);
  expect(
    inquirySchema.safeParse({
      ...base,
      details: { hidden: { nested: "object" } },
    }).success,
  ).toBe(false);
});

import { describe, expect, it, vi } from "vitest";
import {
  credentialExpiry,
  validatePackageDocuments,
  type CredentialDocument,
} from "./credentials";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
const document: CredentialDocument = {
  id: "fixture",
  title: "Insurance",
  description: null,
  category: "insurance",
  file_url: "restricted:fixture/document.pdf",
  file_name: "document.pdf",
  expiry_date: null,
  is_active: true,
  requires_authentication: true,
  version: "1",
};
describe("credentials packages", () => {
  it("reports unknown expiry honestly and separates expired/expiring/current documents", () => {
    const now = new Date("2026-10-04T15:00:00Z");
    expect(credentialExpiry(null, now).state).toBe("unknown");
    expect(credentialExpiry("2026-10-03", now).state).toBe("expired");
    expect(credentialExpiry("2026-10-20", now).state).toBe("expiring");
    expect(credentialExpiry("2027-01-01", now).state).toBe("current");
  });
  it("refuses public, inactive and expired documents before building a share package", () => {
    expect(() => validatePackageDocuments([document])).not.toThrow();
    expect(() =>
      validatePackageDocuments([
        { ...document, file_url: "https://example.test/file.pdf" },
      ]),
    ).toThrow();
    expect(() =>
      validatePackageDocuments([
        { ...document, requires_authentication: false },
      ]),
    ).toThrow();
    expect(() =>
      validatePackageDocuments([{ ...document, expiry_date: "2020-01-01" }]),
    ).toThrow();
    expect(() => validatePackageDocuments([])).toThrow();
  });
});

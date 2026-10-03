import { describe, expect, it } from "vitest";
import {
  filterStatuses,
  inboxUpdate,
  normalizeInboxItem,
  rfpAttachmentPath,
  supportsAdminNotes,
  matchesInboxSearch,
} from "./model";

const record = { id: "lead-1", email: "client@example.test", status: "new" };
describe("inbox compatibility", () => {
  it("uses quote statuses and never sends a nonexistent notes column", () => {
    const item = normalizeInboxItem("quote", {
      ...record,
      additional_notes: "Client scope",
    });
    expect(filterStatuses("quote")).toEqual([
      "new",
      "contacted",
      "quoted",
      "won",
      "lost",
    ]);
    expect(inboxUpdate(item, "quoted", "Internal note")).toEqual({
      status: "quoted",
    });
    expect(inboxUpdate(item, "new", "Internal note")).toEqual({});
    expect(() => inboxUpdate(item, "completed", "")).toThrow();
    expect(item.additional_notes).toBe("Client scope");
    expect(supportsAdminNotes(item)).toBe(false);
  });
  it("preserves existing notes during a status-only update", () => {
    const item = normalizeInboxItem("rfp", {
      ...record,
      admin_notes: "Called Tuesday",
      scope_of_work: "Masonry repair",
      attachment_urls: ["drawings.pdf"],
    });
    expect(inboxUpdate(item, "contacted", "Called Tuesday")).toEqual({
      status: "contacted",
    });
    expect(inboxUpdate(item, "new", "Follow up Friday")).toEqual({
      admin_notes: "Follow up Friday",
    });
    expect(matchesInboxSearch(item, " masonry ")).toBe(true);
    expect(item.attachment_urls).toEqual(["drawings.pdf"]);
  });
  it("normalizes the prequalification date and does not invent notes", () => {
    const item = normalizeInboxItem("prequal", {
      ...record,
      downloaded_at: "2026-10-02T15:00:00Z",
    });
    expect(item.created_at).toBe("2026-10-02T15:00:00Z");
    expect(inboxUpdate(item, "contacted", "note")).toEqual({
      status: "contacted",
    });
  });
  it("keeps a legacy status unchanged when only notes are edited", () => {
    const item = normalizeInboxItem("contact", {
      ...record,
      status: "legacy",
      admin_notes: null,
    });
    expect(inboxUpdate(item, "legacy", "Call back")).toEqual({
      admin_notes: "Call back",
    });
  });
});
describe("private RFP attachment paths", () => {
  const backend = "https://example.supabase.co";
  it("accepts stored paths and converts legacy private-bucket URLs", () => {
    expect(rfpAttachmentPath("folder/drawings.pdf", backend)).toBe(
      "folder/drawings.pdf",
    );
    expect(
      rfpAttachmentPath(
        `${backend}/storage/v1/object/public/rfp-attachments/folder/roof%20plan.pdf`,
        backend,
      ),
    ).toBe("folder/roof plan.pdf");
    expect(
      rfpAttachmentPath(
        `${backend}/storage/v1/object/sign/rfp-attachments/plan.pdf?token=old`,
        backend,
      ),
    ).toBe("plan.pdf");
  });
  it.each([
    "../secrets",
    "/plan.pdf",
    "folder/../plan.pdf",
    "javascript:alert(1)",
    "https://evil.test/plan.pdf",
    `${backend}/storage/v1/object/public/other-bucket/plan.pdf`,
    "folder\\plan.pdf",
  ])("rejects an unsupported path: %s", (path) => {
    expect(() => rfpAttachmentPath(path, backend)).toThrow();
  });
});

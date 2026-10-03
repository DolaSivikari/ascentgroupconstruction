import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadInbox, saveInboxItem, signRfpAttachment } from "./api";
import { normalizeInboxItem } from "./model";
const mock = vi.hoisted(() => ({
  from: vi.fn(),
  storageFrom: vi.fn(),
  sign: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: mock.from, storage: { from: mock.storageFrom } },
}));

beforeEach(() => {
  vi.clearAllMocks();
});
describe("inbox loading", () => {
  it("loads complete details past the REST row cap", async () => {
    const rows = Array.from({ length: 1001 }, (_, index) => ({
      id: String(index),
      email: "client@example.test",
      scope_of_work: "Saved scope",
      admin_notes: "Saved notes",
      attachment_urls: ["plan.pdf"],
      created_at: "2026-10-02T15:00:00Z",
    }));
    const range = vi.fn((start: number, end: number) =>
      Promise.resolve({ data: rows.slice(start, end + 1), error: null }),
    );
    const query = {
      select: vi.fn(() => query),
      order: vi.fn(() => query),
      range,
    };
    mock.from.mockReturnValue(query);
    const result = await loadInbox("rfp");
    expect(result.failed).toEqual([]);
    expect(result.items).toHaveLength(1001);
    expect(result.items[1000].admin_notes).toBe("Saved notes");
    expect(result.items[1000].scope_of_work).toBe("Saved scope");
    expect(query.select).toHaveBeenCalledWith("*");
    expect(range.mock.calls).toEqual([
      [0, 999],
      [1000, 1999],
    ]);
  });
  it("reports a failed source while retaining other sources", async () => {
    mock.from.mockImplementation((table: string) => {
      const query = {
        select: () => query,
        order: () => query,
        range: async () =>
          table === "rfp_submissions"
            ? { data: null, error: new Error("denied") }
            : {
                data: [
                  {
                    id: table,
                    email: "client@example.test",
                    created_at: "2026-10-02T15:00:00Z",
                    downloaded_at: "2026-10-01T15:00:00Z",
                  },
                ],
                error: null,
              },
      };
      return query;
    });
    const result = await loadInbox("all");
    expect(result.failed).toEqual(["RFP"]);
    expect(result.items).toHaveLength(5);
    expect(result.items.some((item) => item.type === "Newsletter")).toBe(true);
  });
  it("combines RFPs with all quotes, including estimator records, without loading unrelated inbox sources", async () => {
    mock.from.mockImplementation((table: string) => {
      const query = {
        select: () => query,
        order: () => query,
        range: async () => ({
          data:
            table === "rfp_submissions"
              ? [
                  {
                    id: "rfp",
                    email: "bid@example.test",
                    created_at: "2026-10-02T15:00:00Z",
                    scope_of_work: "Facade restoration",
                    attachment_urls: ["plans.pdf"],
                  },
                ]
              : [
                  {
                    id: "estimate",
                    email: "owner@example.test",
                    source: "estimator",
                    target_deadline: null,
                    created_at: "2026-10-01T15:00:00Z",
                  },
                  {
                    id: "quote",
                    email: "gc@example.test",
                    source: "service-page",
                    target_deadline: "2026-10-10",
                    created_at: "2026-10-01T14:00:00Z",
                  },
                ],
          error: null,
        }),
      };
      return query;
    });
    const result = await loadInbox("work");
    expect(mock.from.mock.calls.map(([table]) => table)).toEqual([
      "rfp_submissions",
      "quote_requests",
    ]);
    expect(result.items.map((item) => item.id)).toEqual([
      "rfp",
      "estimate",
      "quote",
    ]);
    expect(result.items[0].attachment_urls).toEqual(["plans.pdf"]);
    expect(result.failed).toEqual([]);
  });
});
describe("inbox saves and signing", () => {
  const single = vi.fn();
  const update = vi.fn();
  beforeEach(() => {
    const query = {
      update: (patch: unknown) => {
        update(patch);
        return query;
      },
      eq: () => query,
      select: () => query,
      single,
    };
    mock.from.mockReturnValue(query);
    single.mockResolvedValue({ data: { id: "lead" }, error: null });
    update.mockClear();
    mock.storageFrom.mockReturnValue({ createSignedUrl: mock.sign });
  });
  it.each(["quote", "prequal"] as const)(
    "saves %s without admin_notes",
    async (kind) => {
      await saveInboxItem(
        normalizeInboxItem(kind, {
          id: "lead",
          email: "test@example.test",
          status: "new",
        }),
        "contacted",
        "notes",
      );
      expect(update).toHaveBeenCalledWith({ status: "contacted" });
    },
  );
  it("does not report a rejected or zero-row save as success", async () => {
    single.mockResolvedValueOnce({
      data: null,
      error: new Error("No authorized row"),
    });
    await expect(
      saveInboxItem(
        normalizeInboxItem("contact", {
          id: "lead",
          email: "test@example.test",
          status: "new",
          admin_notes: "Existing",
        }),
        "contacted",
        "Existing",
      ),
    ).rejects.toThrow("No authorized row");
    expect(update).toHaveBeenCalledWith({ status: "contacted" });
  });
  it("signs only a valid RFP path for five minutes", async () => {
    mock.sign.mockResolvedValueOnce({
      data: { signedUrl: "https://files.example.test/signed" },
      error: null,
    });
    expect(await signRfpAttachment("drawings/plan.pdf")).toBe(
      "https://files.example.test/signed",
    );
    expect(mock.storageFrom).toHaveBeenCalledWith("rfp-attachments");
    expect(mock.sign).toHaveBeenCalledWith("drawings/plan.pdf", 300);
    await expect(signRfpAttachment("../bad")).rejects.toThrow();
    expect(mock.sign).toHaveBeenCalledTimes(1);
  });
});

describe("inbox counts", () => {
  it("includes all five inquiry sources and counts active newsletter subscribers separately", async () => {
    const { loadInboxCounts } = await import("./api");
    const counts: Record<string, number> = {
      rfp_submissions: 1,
      contact_submissions: 2,
      resume_submissions: 3,
      prequalification_downloads: 4,
      quote_requests: 5,
      newsletter_subscribers: 6,
    };
    const filters: unknown[][] = [];
    mock.from.mockImplementation((table: string) => {
      const query = {
        select: () => query,
        eq: (field: string, value: unknown) => {
          filters.push([table, field, value]);
          return Promise.resolve({ count: counts[table], error: null });
        },
      };
      return query;
    });
    expect(await loadInboxCounts()).toEqual({
      rfp: 1,
      contact: 2,
      resume: 3,
      prequal: 4,
      quote: 5,
      newsletter: 6,
    });
    expect(filters).toContainEqual([
      "newsletter_subscribers",
      "is_active",
      true,
    ]);
    expect(filters.filter((filter) => filter[1] === "status")).toHaveLength(5);
  });
  it("reports unavailable counts instead of turning a failed query into zero", async () => {
    const { loadInboxCounts } = await import("./api");
    const query = {
      select: () => query,
      eq: async () => ({ count: null, error: new Error("offline") }),
    };
    mock.from.mockReturnValue(query);
    await expect(loadInboxCounts()).rejects.toThrow(
      "Could not load inbox counts",
    );
  });
});

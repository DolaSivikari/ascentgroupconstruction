import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadDashboardContent,
  loadInquirySummaryCapability,
  loadLegacyLeadSummary,
  dashboardLeadDestination,
} from "./dashboard-v2";
import { INBOX_SOURCES } from "./model";
import { LEAD_SOURCES } from "@/lib/leads/model";
const mock = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: mock }));
const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const row = (n: number, status: string | null = "new") => ({
  id: id(n),
  status,
  email: "fixture@example.test",
  name: `Request ${n}`,
  created_at: `2026-10-03T17:00:${String(n % 60).padStart(2, "0")}Z`,
  downloaded_at: "2026-10-03T16:00:00Z",
});
type Row = Record<string, unknown>;
interface Read {
  table: string;
  fields: string;
  options?: { count?: string; head?: boolean };
  filters: Array<[string, string, unknown]>;
  limit?: number;
  signal?: AbortSignal;
}
function fake(
  options: {
    rows?: Record<string, Row[]>;
    failed?: (read: Read) => boolean;
    missingCount?: (read: Read) => boolean;
    cap?: number;
  } = {},
) {
  const reads: Read[] = [];
  const rows = options.rows || {
    contact_submissions: [row(1), row(2, null), row(3, "resolved")],
    rfp_submissions: [row(4)],
    quote_requests: [row(5, "won"), row(6, "lost")],
    prequalification_downloads: [row(7, "contacted")],
  };
  mock.from.mockImplementation((table: string) => {
    const read: Read = { table, fields: "", filters: [] };
    reads.push(read);
    const filter = (field: string, op: string, value: unknown) => {
      read.filters.push([field, op, value]);
      return query;
    };
    const answer = () => {
      if (options.failed?.(read))
        return { data: null, count: null, error: { code: "42501" } };
      const filtered = (rows[table] || []).filter((row) =>
        read.filters.every(([field, op, value]) =>
          op === "or"
            ? row.status == null || row.status === "new"
            : op === "gt"
              ? String(row[field]) > String(value)
              : op === "neq"
                ? row[field] !== value
                : row[field] === value,
        ),
      );
      const sorted = [...filtered].sort((a, b) =>
        String(a.id).localeCompare(String(b.id)),
      );
      const limited = sorted.slice(
        0,
        Math.min(read.limit || sorted.length, options.cap ?? Infinity),
      );
      return {
        data: read.options?.head ? null : limited,
        count: options.missingCount?.(read) ? null : filtered.length,
        error: null,
      };
    };
    const query = {
      select: (fields: string, options?: Read["options"]) => {
        read.fields = fields;
        read.options = options;
        return query;
      },
      eq: (field: string, value: unknown) => filter(field, "eq", value),
      filter,
      or: (value: string) => filter("status", "or", value),
      gt: (field: string, value: unknown) => filter(field, "gt", value),
      order: () => query,
      limit: (value: number) => {
        read.limit = value;
        return query;
      },
      abortSignal: (signal: AbortSignal) => {
        read.signal = signal;
        return query;
      },
      then: (
        fulfilled?: (value: ReturnType<typeof answer>) => unknown,
        rejected?: (error: unknown) => unknown,
      ) => Promise.resolve().then(answer).then(fulfilled, rejected),
    };
    return query;
  });
  return reads;
}
beforeEach(() => vi.clearAllMocks());

describe("legacy dashboard summary", () => {
  it("counts all four active lead sources and null statuses exactly as the Leads new filter", async () => {
    const reads = fake();
    const signal = new AbortController().signal;
    const result = await loadLegacyLeadSummary(signal);
    expect(result.newBySource).toEqual({
      contact: 2,
      rfp: 1,
      quote: 0,
      prequal: 0,
    });
    expect(result.newTotal).toBe(3);
    expect(result.byStatus).toEqual({
      new: 3,
      resolved: 1,
      won: 1,
      lost: 1,
      contacted: 1,
    });
    expect(result.total).toBe(7);
    expect(result.failed).toEqual([]);
    expect(new Set(reads.map((read) => read.table))).toEqual(
      new Set(LEAD_SOURCES.map((source) => INBOX_SOURCES[source].table)),
    );
    expect(reads).toHaveLength(12);
    expect(reads.every((read) => read.signal === signal)).toBe(true);
    expect(reads.filter((read) => read.fields === "id,status")).toHaveLength(4);
    expect(
      reads
        .filter((read) => read.fields === "*")
        .every((read) => read.limit === 10),
    ).toBe(true);
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it("preserves genuine zero counts without querying resumes or newsletters", async () => {
    fake({ rows: {} });
    const result = await loadLegacyLeadSummary();
    expect(result.newTotal).toBe(0);
    expect(result.total).toBe(0);
    expect(result.byStatus).toEqual({});
  });
  it.each(["rejected", "missing count"])(
    "shows a %s new-count source as unavailable while keeping healthy sources",
    async (failure) => {
      const bad = (read: Read) =>
        read.table === "rfp_submissions" && !!read.options?.head;
      fake({
        failed: failure === "rejected" ? bad : undefined,
        missingCount: failure === "missing count" ? bad : undefined,
      });
      const result = await loadLegacyLeadSummary();
      expect(result.newTotal).toBeNull();
      expect(result.newBySource.rfp).toBeNull();
      expect(result.newBySource.contact).toBe(2);
      expect(result.total).toBe(7);
      expect(result.failed).toEqual(["RFP"]);
    },
  );
  it("marks pipeline totals unavailable if one status source fails, while preserving new counts and activity", async () => {
    fake({
      failed: (read) =>
        read.table === "quote_requests" && read.fields === "id,status",
    });
    const result = await loadLegacyLeadSummary();
    expect(result.byStatus).toBeNull();
    expect(result.total).toBeNull();
    expect(result.newTotal).toBe(3);
    expect(result.activity.items).toHaveLength(7);
    expect(result.failed).toEqual(["Quote"]);
  });
  it("keeps healthy activity and counts when one activity source fails", async () => {
    fake({
      failed: (read) => read.table === "rfp_submissions" && read.fields === "*",
    });
    const result = await loadLegacyLeadSummary();
    expect(result.activity.failed).toEqual(["RFP"]);
    expect(result.activity.items).toHaveLength(6);
    expect(result.newTotal).toBe(3);
  });
  it("pages minimal status records past a 500-row REST cap without undercounting", async () => {
    const rows = {
      contact_submissions: Array.from({ length: 2501 }, (_, n) =>
        row(n + 1, n % 2 ? "resolved" : null),
      ),
    };
    const reads = fake({ rows, cap: 500 });
    const result = await loadLegacyLeadSummary();
    expect(result.total).toBe(2501);
    expect(result.byStatus).toEqual({ new: 1251, resolved: 1250 });
    expect(result.newTotal).toBe(1251);
    const pages = reads.filter(
      (read) =>
        read.table === "contact_submissions" && read.fields === "id,status",
    );
    expect(pages).toHaveLength(6);
    expect(pages[1].filters).toContainEqual(["id", "gt", id(500)]);
    expect(pages.every((read) => read.limit === 1000)).toBe(true);
  });
  it("rejects an incomplete pipeline response instead of claiming there are no rows", async () => {
    fake({ cap: 0 });
    const result = await loadLegacyLeadSummary();
    expect(result.byStatus).toBeNull();
    expect(result.total).toBeNull();
    expect(result.newTotal).toBe(3);
  });
  it("does not treat historical unusual status names as object properties", async () => {
    fake({
      rows: {
        contact_submissions: [row(1, "__proto__"), row(2, "constructor")],
      },
    });
    const result = await loadLegacyLeadSummary();
    expect(result.byStatus?.["__proto__"]).toBe(1);
    expect(result.byStatus?.constructor).toBe(1);
    expect(result.total).toBe(2);
  });
  it("encodes exact status/source filters for the Leads destination", () => {
    const url = new URL(
      dashboardLeadDestination("new", "contact"),
      "https://fixture.test",
    );
    expect(url.pathname).toBe("/admin/inbox");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      tab: "leads",
      status: "new",
      lead_source: "contact",
    });
  });
});

describe("dashboard content", () => {
  it("loads content separately using nine counts and no intake-table totals", async () => {
    const reads = fake({
      rows: {
        projects: [
          { id: id(1), publish_state: "published" },
          { id: id(2), publish_state: "draft" },
        ],
        services: [row(1)],
        hero_slides: [
          { id: id(1), is_active: true },
          { id: id(2), is_active: false },
        ],
      },
    });
    const content = await loadDashboardContent();
    expect(content.projectsPublished).toBe(1);
    expect(content.projectsDraft).toBe(1);
    expect(content.heroSlides).toBe(1);
    expect(reads).toHaveLength(9);
    expect(reads.every((read) => read.options?.head)).toBe(true);
    expect(reads.some((read) => read.table.endsWith("submissions"))).toBe(
      false,
    );
  });
  it("keeps healthy content counts when another tile fails", async () => {
    fake({ failed: (read) => read.table === "services" });
    const content = await loadDashboardContent();
    expect(content.services).toBeNull();
    expect(content.projectsPublished).toBe(0);
  });
});

describe("future inquiry capability", () => {
  it("does not probe or call the RPC before P4b explicitly enables it", async () => {
    expect(await loadInquirySummaryCapability()).toEqual({
      available: false,
      reason: "disabled",
    });
    expect(mock.rpc).not.toHaveBeenCalled();
  });
  it.each(["PGRST202", "42883"])(
    "treats missing function %s as not yet available",
    async (code) => {
      mock.rpc.mockResolvedValue({ data: null, error: { code } });
      expect(await loadInquirySummaryCapability(true)).toEqual({
        available: false,
        reason: "missing",
      });
    },
  );
  it("does not swallow permission failures as missing capability", async () => {
    mock.rpc.mockResolvedValue({ data: null, error: { code: "42501" } });
    await expect(loadInquirySummaryCapability(true)).rejects.toThrow(
      "Inquiry summary unavailable",
    );
  });
});

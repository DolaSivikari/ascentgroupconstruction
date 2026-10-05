import { beforeEach, describe, expect, it, vi } from "vitest";
import { leadSearchFilter, loadLeadDetail, loadLeadPage } from "./api";
import { leadType, formatLeadReceived, type LeadFilters } from "./model";
import { normalizeInboxItem } from "@/lib/inbox/model";

const mock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: mock.from },
}));
type Row = Record<string, unknown>;
interface Request {
  table: string;
  filters: string[];
  orders: Array<[string, boolean]>;
  limit?: number;
}
const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const row = (
  n: number,
  date: string | null = "2026-10-02T20:00:00Z",
  extra: Row = {},
): Row => ({
  id: id(n),
  email: "fixture@example.test",
  created_at: date,
  status: "new",
  ...extra,
});
const filters: LeadFilters = { type: "all", status: "all", search: "" };
let tables: Record<string, Row[]>;
let unavailable: Set<string>;
let requests: Request[];

// Interpret the request predicates independently, rather than returning canned
// pages: incorrect cursor boundaries will duplicate or omit actual fixtures.
function split(input: string): string[] {
  let depth = 0,
    quoted = false,
    start = 0;
  const parts: string[] = [];
  for (let index = 0; index < input.length; index++) {
    if (quoted && input[index] === "\\") {
      index++;
      continue;
    }
    if (input[index] === '"') quoted = !quoted;
    if (!quoted) {
      if (input[index] === "(") depth++;
      if (input[index] === ")") depth--;
      if (input[index] === "," && depth === 0) {
        parts.push(input.slice(start, index));
        start = index + 1;
      }
    }
  }
  return [...parts, input.slice(start)];
}
function like(pattern: string): RegExp {
  let result = "";
  const escape = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === "\\") result += escape(pattern[++i]);
    else result += c === "%" || c === "*" ? ".*" : c === "_" ? "." : escape(c);
  }
  return new RegExp(`^${result}$`, "isu");
}
function timestamp(value: string): bigint {
  const fraction = (value.match(/\.(\d+)/)?.[1] || "")
    .padEnd(6, "0")
    .slice(3, 6);
  return BigInt(Date.parse(value)) * 1000n + BigInt(fraction);
}
function matches(record: Row, expression: string): boolean {
  if (expression.startsWith("or("))
    return split(expression.slice(3, -1)).some((part) => matches(record, part));
  if (expression.startsWith("and("))
    return split(expression.slice(4, -1)).every((part) =>
      matches(record, part),
    );
  const [, field, negate, operator, encoded] =
    /^([a-z_]+)\.(not\.)?([a-z]+)\.(.*)$/s.exec(expression)!;
  const actual = record[field];
  if (operator === "is") return actual == null;
  if (actual == null) return false; // SQL comparisons with NULL are not true.
  const value = encoded.startsWith('"') ? JSON.parse(encoded) : encoded;
  let result: boolean;
  if (operator === "in")
    result = split(value.slice(1, -1)).includes(String(actual));
  else if (operator === "ilike") result = like(value).test(String(actual));
  else if (operator === "eq")
    result = field.endsWith("_at")
      ? timestamp(String(actual)) === timestamp(value)
      : String(actual) === value;
  else if (operator === "neq") result = String(actual) !== value;
  else if (operator === "gt" || operator === "lt") {
    const first = field.endsWith("_at")
      ? timestamp(String(actual))
      : String(actual);
    const second = field.endsWith("_at") ? timestamp(value) : value;
    result = operator === "gt" ? first > second : first < second;
  } else throw new Error(`Unsupported fixture predicate ${expression}`);
  return negate ? !result : result;
}
beforeEach(() => {
  tables = {};
  unavailable = new Set();
  requests = [];
  vi.clearAllMocks();
  mock.from.mockImplementation((table: string) => {
    const request: Request = { table, filters: [], orders: [] };
    requests.push(request);
    const answer = () => {
      if (unavailable.has(table))
        return { data: null, error: new Error("Unavailable") };
      const data = (tables[table] || []).filter((record) =>
        request.filters.every((filter) => matches(record, filter)),
      );
      data.sort((a, b) => {
        for (const [field, ascending] of request.orders) {
          if (a[field] == null && b[field] == null) continue;
          if (a[field] == null) return 1;
          if (b[field] == null) return -1;
          const comparison = field.endsWith("_at")
            ? timestamp(String(a[field])) > timestamp(String(b[field]))
              ? 1
              : timestamp(String(a[field])) < timestamp(String(b[field]))
                ? -1
                : 0
            : String(a[field]).localeCompare(String(b[field]));
          if (comparison) return ascending ? comparison : -comparison;
        }
        return 0;
      });
      return { data: data.slice(0, request.limit), error: null };
    };
    const query = {
      select: () => query,
      order: (field: string, options: { ascending: boolean }) => {
        request.orders.push([field, options.ascending]);
        return query;
      },
      eq: (field: string, value: unknown) => {
        request.filters.push(`${field}.eq.${value}`);
        return query;
      },
      is: (field: string) => {
        request.filters.push(`${field}.is.null`);
        return query;
      },
      gt: (field: string, value: string) => {
        request.filters.push(`${field}.gt.${value}`);
        return query;
      },
      in: (field: string, values: string[]) => {
        request.filters.push(`${field}.in.(${values.join(",")})`);
        return query;
      },
      or: (value: string) => {
        request.filters.push(`or(${value})`);
        return query;
      },
      abortSignal: () => query,
      limit: async (limit: number) => {
        request.limit = limit;
        return answer();
      },
      maybeSingle: async () => {
        const result = answer();
        return { ...result, data: result.data?.[0] || null };
      },
    };
    return query;
  });
});

describe("bounded lead paging", () => {
  it("reads only the dashboard's selected source and includes its null/new rows", async () => {
    tables.contact_submissions = [
      row(1, undefined, { status: null }),
      row(2, undefined, { status: "new", submission_type: "estimate" }),
      row(3, undefined, { status: "resolved" }),
    ];
    tables.rfp_submissions = [row(4)];
    const result = await loadLeadPage({
      ...filters,
      status: "new",
      source: "contact",
    });
    expect(result.items.map((item) => item.id)).toEqual([id(1), id(2)]);
    expect(requests.map((request) => request.table)).toEqual([
      "contact_submissions",
    ]);
  });
  it("preserves PostgreSQL microsecond precision across source ordering and cursor boundaries", async () => {
    tables.contact_submissions = [
      row(1, "2026-10-02T20:00:00.123500Z"),
      row(2, "2026-10-02T20:00:00.123450+00:00"),
    ];
    tables.quote_requests = [
      row(3, "2026-10-02T20:00:00.123475Z"),
      row(4, "2026-10-02T20:00:00.123400Z"),
    ];
    tables.rfp_submissions = [row(5, "2026-10-02T20:00:00.123460Z")];
    const seen: string[] = [];
    let cursor = null;
    do {
      const page = await loadLeadPage(filters, cursor, undefined, 2);
      seen.push(...page.items.map((item) => item.id));
      expect(seen.length).toBeLessThan(10);
      cursor = page.nextCursor;
    } while (cursor);
    expect(seen).toEqual([1, 3, 5, 2, 4].map(id));
  });

  it("walks mixed sources and tied/missing dates without skips or duplicates when a newer request arrives", async () => {
    tables.contact_submissions = [1, 2, 3, 4].map((n) => row(n));
    tables.contact_submissions.push(row(99, null));
    tables.quote_requests = [row(10), row(11)];
    tables.rfp_submissions = [
      row(30),
      row(31, "2026-10-01T10:00:00Z"),
      row(32, null),
    ];
    tables.prequalification_downloads = [row(20, null), row(21, null)];
    const first = await loadLeadPage(filters, null, undefined, 3);
    const seen = [...first.items];
    let cursor = first.nextCursor;
    tables.contact_submissions.push(row(777, "2026-10-03T10:00:00Z"));
    tables.contact_submissions = tables.contact_submissions.filter(
      (record) => record.id !== id(1),
    );
    while (cursor) {
      const next = await loadLeadPage(filters, cursor, undefined, 3);
      seen.push(...next.items);
      cursor = next.nextCursor;
      expect(seen.length).toBeLessThan(20);
    }
    expect(seen.map((item) => item.id)).toEqual(
      [1, 2, 3, 4, 10, 11, 30, 31, 99, 20, 21, 32].map(id),
    );
    expect(new Set(seen.map((item) => `${item.table}/${item.id}`)).size).toBe(
      seen.length,
    );
    expect(requests.every((request) => request.limit === 4)).toBe(true);
  });
  it("keeps successful sources visible but prevents advancing over an unavailable source", async () => {
    tables.contact_submissions = [row(1), row(2), row(3)];
    unavailable.add("rfp_submissions");
    const result = await loadLeadPage(filters, null, undefined, 2);
    expect(result.items).toHaveLength(2);
    expect(result.failed).toEqual(["RFP"]);
    expect(result.nextCursor).toBeNull();
    unavailable.clear();
    expect(
      (await loadLeadPage(filters, null, undefined, 2)).nextCursor,
    ).not.toBeNull();
  });
  it("classifies contact estimates/quotes and UTM wizard quotes in the matching server filters", async () => {
    tables.contact_submissions = [
      row(1, undefined, { submission_type: "estimate" }),
      row(2, undefined, { submission_type: "quote_request" }),
      row(3),
    ];
    tables.quote_requests = [
      row(4, undefined, {
        quote_type: "trade_package",
        source: '{"utm_source":"google"}',
      }),
      row(5, undefined, { source: "estimator" }),
      row(6, undefined, { source: "service-page" }),
    ];
    const estimates = await loadLeadPage({ ...filters, type: "estimate" });
    expect(estimates.items.map((item) => item.id)).toEqual([1, 4, 5].map(id));
    expect(estimates.items.every((item) => leadType(item) === "estimate")).toBe(
      true,
    );
    const quotes = await loadLeadPage({ ...filters, type: "quote" });
    expect(quotes.items.map((item) => item.id)).toEqual([2, 6].map(id));
    expect(quotes.items.every((item) => leadType(item) === "quote")).toBe(true);
    expect(
      (await loadLeadPage({ ...filters, type: "general" })).items.map(
        (item) => item.id,
      ),
    ).toEqual([id(3)]);
  });
  it("filters statuses on the server and retains null/legacy open statuses", async () => {
    tables.contact_submissions = [
      row(1),
      row(2, undefined, { status: null }),
      row(3, undefined, { status: "completed" }),
      row(4, undefined, { status: "legacy" }),
    ];
    expect(
      (await loadLeadPage({ ...filters, status: "open" })).items.map(
        (item) => item.id,
      ),
    ).toEqual([1, 2, 4].map(id));
    expect(
      (await loadLeadPage({ ...filters, status: "closed" })).items.map(
        (item) => item.id,
      ),
    ).toEqual([id(3)]);
    expect(
      (await loadLeadPage({ ...filters, status: "new" })).items.map(
        (item) => item.id,
      ),
    ).toEqual([1, 2].map(id));
  });
  it("searches literal punctuation/LIKE characters without creating extra filter predicates", async () => {
    const search = 'Zoë, "GC" (50%_ready)';
    tables.contact_submissions = [
      row(1, undefined, { name: search }),
      row(2, undefined, { name: "Other GC" }),
    ];
    const result = await loadLeadPage({ ...filters, search });
    expect(result.failed).toEqual([]);
    expect(result.items.map((item) => item.id)).toEqual([id(1)]);
    expect(split(leadSearchFilter(["name", "email"], search))).toHaveLength(2);
  });
  it("bounds every source read even when thousands of records exist", async () => {
    tables.contact_submissions = Array.from({ length: 2000 }, (_, n) => row(n));
    const result = await loadLeadPage(filters);
    expect(result.items).toHaveLength(50);
    expect(result.nextCursor).not.toBeNull();
    expect(requests.every((request) => request.limit === 51)).toBe(true);
  });
});

describe("new inquiries alongside legacy leads", () => {
  it("merges inquiry and legacy cursor pages without omitting same-time records", async () => {
    tables.contact_submissions = [row(1), row(2)];
    tables.inquiries = [
      row(3, undefined, {
        contact_name: "New inquiry",
        inquiry_type: "general",
      }),
      row(4),
    ];
    const first = await loadLeadPage(filters, null, undefined, 3, true);
    expect(first.items.map((i) => i.id)).toEqual([id(1), id(2), id(3)]);
    expect(first.inquiryAvailable).toBe(true);
    const second = await loadLeadPage(
      filters,
      first.nextCursor,
      undefined,
      3,
      true,
    );
    expect(second.items.map((i) => i.id)).toEqual([id(4)]);
    expect(second.nextCursor).toBeNull();
  });
  it("retains legacy results and stops paging if new inquiries cannot load", async () => {
    tables.contact_submissions = [row(1), row(2), row(3)];
    unavailable.add("inquiries");
    const page = await loadLeadPage(filters, null, undefined, 2, true);
    expect(page.items).toHaveLength(2);
    expect(page.failed).toEqual(["New inquiries"]);
    expect(page.nextCursor).toBeNull();
  });
  it("filters bid invitations at the server without querying legacy sources", async () => {
    tables.inquiries = [
      row(1, undefined, { inquiry_type: "bid_invitation" }),
      row(2, undefined, { inquiry_type: "general" }),
    ];
    const page = await loadLeadPage(
      { ...filters, type: "bid" },
      null,
      undefined,
      50,
      true,
    );
    expect(page.items.map((i) => i.id)).toEqual([id(1)]);
    expect(requests.map((r) => r.table)).toEqual(["inquiries"]);
  });
});

describe("independent request detail loading", () => {
  it("opens an old closed request directly, independent of page or list filters", async () => {
    tables.contact_submissions = [
      row(1, "2000-01-01T00:00:00Z", {
        status: "completed",
        message: "Full saved scope",
        admin_notes: "Saved note",
      }),
    ];
    const detail = await loadLeadDetail({ id: id(1), source: "contact" });
    expect(detail.message).toBe("Full saved scope");
    expect(detail.admin_notes).toBe("Saved note");
    expect(requests.map((request) => request.table)).toEqual([
      "contact_submissions",
    ]);
  });
  it("resolves a bookmarked id without a source, and rejects ambiguous matches", async () => {
    tables.quote_requests = [row(1)];
    expect((await loadLeadDetail({ id: id(1) })).table).toBe("quote_requests");
    tables.contact_submissions = [row(1)];
    await expect(loadLeadDetail({ id: id(1) })).rejects.toThrow(
      "More than one request",
    );
  });
  it("reports missing and unavailable records without presenting cached success", async () => {
    await expect(
      loadLeadDetail({ id: id(1), source: "contact" }),
    ).rejects.toThrow("not found");
    unavailable.add("contact_submissions");
    await expect(
      loadLeadDetail({ id: id(1), source: "contact" }),
    ).rejects.toThrow("Could not load");
    await expect(loadLeadDetail({ id: "invalid" })).rejects.toThrow("invalid");
  });
  it("formats daylight-saving time using Toronto's actual offset", () => {
    expect(formatLeadReceived("2026-01-01T15:00:00Z")).toContain("10:00");
    expect(formatLeadReceived("2026-07-01T15:00:00Z")).toContain("11:00");
    expect(
      leadType(
        normalizeInboxItem("contact", { ...row(1), submission_type: "quote" }),
      ),
    ).toBe("quote");
  });
});

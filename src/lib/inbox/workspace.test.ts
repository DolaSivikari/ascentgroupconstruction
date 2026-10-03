import { describe, expect, it } from "vitest";
import {
  normalizeInboxItem,
  inboxKinds,
  filterStatuses,
  type InboxItem,
} from "./model";
import {
  commercialType,
  deadlineCue,
  formatRequestedDeadline,
  inboxCsv,
  isOpenInboxItem,
  requestedDeadline,
  sortInboxItems,
  torontoDate,
} from "./workspace";

const quote = (
  id: string,
  deadline: string | null,
  extra: Record<string, unknown> = {},
): InboxItem =>
  normalizeInboxItem("quote", {
    id,
    name: "Client",
    email: "client@example.test",
    status: "new",
    target_deadline: deadline,
    ...extra,
  });

describe("commercial inbox compatibility", () => {
  it("keeps existing quote and RFP status contracts and identifies estimator submissions", () => {
    expect(inboxKinds("work")).toEqual(["rfp", "quote"]);
    expect(inboxKinds("quote")).toEqual(["quote"]);
    expect(inboxKinds("all")).toHaveLength(6);
    expect(filterStatuses("work")).toEqual(
      expect.arrayContaining(["in_progress", "quoted", "won", "lost"]),
    );
    expect(
      commercialType(quote("estimate", null, { source: "estimator" })),
    ).toBe("estimate");
    expect(commercialType(quote("quote", null))).toBe("quote");
    expect(isOpenInboxItem(quote("quoted", null, { status: "quoted" }))).toBe(
      true,
    );
    expect(isOpenInboxItem(quote("lost", null, { status: "lost" }))).toBe(
      false,
    );
  });
});

describe("requested calendar deadlines", () => {
  it("uses Toronto's date across UTC midnight and daylight saving changes", () => {
    expect(torontoDate(new Date("2026-10-03T01:30:00Z"))).toBe("2026-10-02");
    expect(torontoDate(new Date("2026-10-03T04:00:00Z"))).toBe("2026-10-03");
    expect(torontoDate(new Date("2026-01-03T04:30:00Z"))).toBe("2026-01-02");
    expect(torontoDate(new Date("2026-01-03T05:00:00Z"))).toBe("2026-01-03");
    expect(torontoDate(new Date("2026-11-01T05:30:00Z"))).toBe("2026-11-01");
    expect(torontoDate(new Date("2026-11-01T06:30:00Z"))).toBe("2026-11-01");
  });
  it("flags overdue open requests and today without inventing a closing time", () => {
    expect(deadlineCue(quote("past", "2026-10-01"), "2026-10-02")).toBe(
      "overdue",
    );
    expect(deadlineCue(quote("today", "2026-10-02"), "2026-10-02")).toBe(
      "today",
    );
    expect(deadlineCue(quote("future", "2026-10-03"), "2026-10-02")).toBeNull();
    expect(
      deadlineCue(quote("won", "2026-10-01", { status: "won" }), "2026-10-02"),
    ).toBeNull();
    expect(
      deadlineCue(
        quote("lost", "2026-10-01", { status: "lost" }),
        "2026-10-02",
      ),
    ).toBeNull();
    expect(deadlineCue(quote("missing", null), "2026-10-02")).toBeNull();
  });
  it("never treats an RFP project start date as a bid deadline", () => {
    const rfp = normalizeInboxItem("rfp", {
      id: "rfp",
      email: "gc@example.test",
      project_start_date: "2026-09-01",
      target_deadline: "2026-09-01",
    });
    expect(requestedDeadline(rfp)).toBeNull();
    expect(deadlineCue(rfp, "2026-10-02")).toBeNull();
  });
  it.each([
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-01",
    "2026-10-00",
    "0000-01-01",
    "2026-10-02T14:00:00Z",
    "October 2, 2026",
    "",
  ])("leaves invalid or non-DATE values blank: %s", (value) => {
    expect(requestedDeadline(quote("invalid", value))).toBeNull();
  });
  it("retains leap days and displays the stored date without a timezone shift", () => {
    expect(requestedDeadline(quote("leap", "2028-02-29"))).toBe("2028-02-29");
    expect(formatRequestedDeadline("2026-10-02")).toContain("Oct 2");
  });
  it("places missing dates last and preserves ties and the original records", () => {
    const items = [
      quote("missing-first", null),
      quote("later", "2026-10-10"),
      quote("early-first", "2026-10-02"),
      quote("early-second", "2026-10-02"),
      quote("missing-second", null),
    ];
    expect(sortInboxItems(items, "deadline").map((item) => item.id)).toEqual([
      "early-first",
      "early-second",
      "later",
      "missing-first",
      "missing-second",
    ]);
    expect(items[0].id).toBe("missing-first");
    expect(items[0].target_deadline).toBeNull();
    expect(
      sortInboxItems(
        [
          quote("old", null, { created_at: "2026-10-01T15:00:00Z" }),
          quote("missing", null),
          quote("new", null, { created_at: "2026-10-02T15:00:00Z" }),
        ],
        "received",
      ).map((item) => item.id),
    ).toEqual(["new", "old", "missing"]);
  });
});

describe("staff summary CSV", () => {
  it("exports selected summary fields only and preserves Unicode and multiline scope", () => {
    const item = quote("lead", "2026-10-02", {
      source: "estimator",
      name: "Zoë O’Connor",
      company: 'Example, "Ltd"',
      scope_categories: ["Masonry", "Roofing"],
      admin_notes: "PRIVATE_NOTE",
      additional_notes: "PRIVATE_CLIENT_NOTE",
      consent_ip: "PRIVATE_IP",
      consent_timestamp: "PRIVATE_CONSENT",
      uploaded_files: [
        "https://files.example.test/PRIVATE_URL?token=PRIVATE_TOKEN",
      ],
    });
    const rfp = normalizeInboxItem("rfp", {
      id: "bid",
      email: "gc@example.test",
      scope_of_work: "Line one\nLine two",
      attachment_urls: ["PRIVATE_DRAWING.pdf"],
      admin_notes: "PRIVATE_RFP_NOTE",
    });
    const result = inboxCsv([item, rfp]);
    expect(result).toContain('"Estimate","lead"');
    expect(result).toContain('"Zoë O’Connor"');
    expect(result).toContain('"Example, ""Ltd"""');
    expect(result).toContain('"Masonry, Roofing"');
    expect(result).toContain('"Line one\nLine two"');
    expect(result).toContain('"2026-10-02"');
    expect(result).not.toContain("PRIVATE_");
  });
  it.each([
    '=HYPERLINK("https://evil.test")',
    "+123",
    "-2+3",
    "@SUM(A1)",
    " \t=1+1",
    "\tmalicious",
    "\rmalicious",
    "\u0000=1+1",
  ])(
    "neutralizes spreadsheet formulas and control-prefixed values: %s",
    (name) => {
      const result = inboxCsv([quote("lead", null, { name })]);
      expect(result).toContain(`"'${name.replace(/"/g, '""')}"`);
    },
  );
});

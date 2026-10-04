import { describe, expect, it } from "vitest";
import {
  distinctIssues,
  healthPayloadSchema,
  missingHealthSchema,
  nightlyPilotDays,
  newSeriousIssues,
  type HealthIssue,
  type HealthRun,
} from "./contract";
const finding: HealthIssue = {
  code: "broken_image",
  severity: "error",
  message: "Image failed",
  fingerprint: "a".repeat(64),
};
const result = {
  id: "22222222-2222-4222-a222-222222222222",
  path: "/",
  viewport: "desktop",
  http_status: 200,
  load_ms: 100,
  title: "Home",
  h1: "Home",
  canonical: "https://www.ascentgroupconstruction.com/",
  text_hash: "b".repeat(64),
  console_errors: 0,
  failed_requests: 0,
  issues: [],
  checked_at: "2026-10-04T07:00:00.000Z",
};
const report = {
  version: 1,
  id: "11111111-1111-4111-a111-111111111111",
  kind: "full_crawl",
  target_origin: "https://www.ascentgroupconstruction.com",
  commit_ref: null,
  started_at: "2026-10-04T07:00:00.000Z",
  finished_at: "2026-10-04T07:10:00.000Z",
  paths: ["/"],
  results: [
    result,
    {
      ...result,
      id: "33333333-3333-4333-a333-333333333333",
      viewport: "mobile",
    },
  ],
  blocked: false,
  failure: null,
};
describe("health report boundaries", () => {
  it("accepts complete desktop and mobile coverage", () =>
    expect(healthPayloadSchema.safeParse(report).success).toBe(true));
  it("rejects incomplete coverage unless explicitly aborted", () => {
    expect(
      healthPayloadSchema.safeParse({ ...report, results: [result] }).success,
    ).toBe(false);
    expect(
      healthPayloadSchema.safeParse({
        ...report,
        results: [result],
        failure: "Stopped",
      }).success,
    ).toBe(true);
  });
  it("rejects duplicated cells and foreign pages", () => {
    expect(
      healthPayloadSchema.safeParse({ ...report, results: [result, result] })
        .success,
    ).toBe(false);
    expect(
      healthPayloadSchema.safeParse({ ...report, paths: ["/admin"] }).success,
    ).toBe(false);
    expect(
      healthPayloadSchema.safeParse({
        ...report,
        target_origin: "https://example.com",
      }).success,
    ).toBe(false);
  });
  it("records blocked discovery without pretending zero coverage passed", () => {
    expect(
      healthPayloadSchema.safeParse({
        ...report,
        results: [],
        paths: [],
        blocked: true,
        failure: "HTTP 403",
      }).success,
    ).toBe(true);
    expect(
      healthPayloadSchema.safeParse({ ...report, results: [], paths: [] })
        .success,
    ).toBe(false);
  });
  it("rejects reversed times and oversized findings", () => {
    expect(
      healthPayloadSchema.safeParse({
        ...report,
        finished_at: "2026-10-03T07:00:00.000Z",
      }).success,
    ).toBe(false);
    expect(
      healthPayloadSchema.safeParse({
        ...report,
        results: [
          { ...result, issues: [{ ...finding, message: "x".repeat(501) }] },
        ],
      }).success,
    ).toBe(false);
  });
});
describe("pilot and alert decisions", () => {
  const run = (date: string, changes: Partial<HealthRun> = {}): HealthRun => ({
    id: date,
    started_at: date,
    finished_at: date,
    kind: "baseline",
    target_origin: "https://www.ascentgroupconstruction.com",
    commit_ref: null,
    pages_checked: 86,
    errors: 0,
    warnings: 0,
    status: "passed",
    ...changes,
  });
  it("counts distinct successful nightly dates, excluding manual, blocked and partial runs", () =>
    expect(
      nightlyPilotDays([
        run("2026-10-01T07:00:00Z"),
        run("2026-10-01T08:00:00Z"),
        run("2026-10-02T07:00:00Z", { kind: "manual" }),
        run("2026-10-03T07:00:00Z", { status: "blocked" }),
        run("2026-10-04T07:00:00Z", { finished_at: null }),
        run("2026-10-05T07:00:00Z", { status: "failed" }),
      ]),
    ).toBe(2));
  it("deduplicates an issue observed at both widths", () =>
    expect(
      distinctIssues([{ issues: [finding] }, { issues: [finding] }]),
    ).toEqual([finding]));
  it("alerts only new errors and suppresses ignored findings", () => {
    expect(newSeriousIssues([finding], [finding], [])).toEqual([]);
    expect(
      newSeriousIssues([{ ...finding, severity: "warning" }], [], []),
    ).toEqual([]);
    expect(
      newSeriousIssues(
        [finding],
        [],
        [
          {
            fingerprint: finding.fingerprint,
            state: "ignored",
            reason: "Known",
            updated_at: "",
            updated_by: null,
          },
        ],
      ),
    ).toEqual([]);
  });
  it("does not hide a recurring error merely because it was marked fixed", () =>
    expect(
      newSeriousIssues(
        [finding],
        [],
        [
          {
            fingerprint: finding.fingerprint,
            state: "fixed",
            reason: "Repaired",
            updated_at: "",
            updated_by: null,
          },
        ],
      ),
    ).toEqual([finding]));
  it("distinguishes absent schema from denied permission", () => {
    expect(missingHealthSchema({ code: "PGRST205" })).toBe(true);
    expect(missingHealthSchema({ code: "42501" })).toBe(false);
  });
});

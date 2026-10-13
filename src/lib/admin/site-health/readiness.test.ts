import { describe, expect, it } from "vitest";
import { healthFailure, healthPingFailure, validHealthPing } from "./readiness";

describe("monitoring failure evidence", () => {
  it.each([
    ["42P01", "missing-schema"],
    ["42703", "incompatible-schema"],
    ["PGRST204", "schema-cache"],
    ["PGRST205", "schema-cache"],
    ["PGRST002", "schema-cache"],
    ["42501", "permission"],
  ])("classifies %s without guessing deployment status", (code, kind) => {
    expect(healthFailure({ code }).kind).toBe(kind);
  });
  it("does not mistake an API lookup failure for catalog proof", () => {
    expect(healthFailure({ code: "PGRST205" }).message).toMatch(
      /may be missing.*cache may be stale/,
    );
    expect(healthFailure(new TypeError("Failed to fetch")).kind).toBe(
      "request-failure",
    );
  });
  it.each([
    [401, /denied/],
    [403, /denied/],
    [404, /endpoint was not found/],
    [503, /service failed/],
  ])(
    "reports function HTTP %s independently of schema setup",
    (status, text) => {
      expect(healthPingFailure({ context: { status } })).toMatch(text);
    },
  );
  it("reports network failures without leaking raw responses", () => {
    expect(
      healthPingFailure({ name: "FunctionsFetchError", message: "private" }),
    ).toMatch(/network/);
    expect(healthPingFailure({ message: "private" })).not.toContain("private");
  });
  it("requires measured latency and a usable timestamp before rendering success", () => {
    const ping = {
      status: "ok",
      latency_ms: 0,
      checked_at: "2026-10-13T00:00:00Z",
    };
    expect(validHealthPing(ping)).toBe(true);
    for (const data of [
      null,
      {},
      { ...ping, latency_ms: -1 },
      { ...ping, latency_ms: 1.5 },
      { ...ping, checked_at: "invalid" },
      { ...ping, status: "unavailable" },
    ])
      expect(validHealthPing(data)).toBe(false);
  });
});

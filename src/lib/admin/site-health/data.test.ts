import { beforeEach, describe, expect, it, vi } from "vitest";
const fixture = vi.hoisted(() => ({
  responses: new Map<string, { data: unknown; error: unknown }>(),
  from: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: fixture.from },
}));
import { loadHealthOverview } from "./data";

beforeEach(() => {
  fixture.responses.clear();
  fixture.from.mockReset().mockImplementation((name: string) => {
    const builder = {
      select: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      order: vi.fn(() => builder),
      then: (
        resolve: (value: unknown) => unknown,
        reject: (reason: unknown) => unknown,
      ) =>
        Promise.resolve(
          fixture.responses.get(name) || { data: [], error: null },
        ).then(resolve, reject),
    };
    return builder;
  });
});
describe("read-only monitoring prerequisites", () => {
  it("keeps an accessible but empty database distinct from missing setup", async () => {
    expect(await loadHealthOverview()).toEqual({ available: true, runs: [] });
  });
  it("returns setup only for a database missing-relation error", async () => {
    fixture.responses.set("site_health_runs", {
      data: null,
      error: { code: "42P01" },
    });
    const result = await loadHealthOverview();
    expect(result.available).toBe(false);
    expect("reason" in result && result.reason.kind).toBe("missing-schema");
  });
  it.each(["PGRST205", "PGRST204", "42501"])(
    "retains %s for an honest failure state",
    async (code) => {
      fixture.responses.set("site_health_results", {
        data: null,
        error: { code },
      });
      await expect(loadHealthOverview()).rejects.toEqual({ code });
    },
  );
  it("does not hide denied access behind another missing table", async () => {
    fixture.responses.set("site_health_results", {
      data: null,
      error: { code: "42P01" },
    });
    fixture.responses.set("site_health_issue_states", {
      data: null,
      error: { code: "42501" },
    });
    await expect(loadHealthOverview()).rejects.toEqual({ code: "42501" });
  });
});

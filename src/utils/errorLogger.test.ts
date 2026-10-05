import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initErrorLogging, logError, errorFromRejection } from "./errorLogger";
const mock = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: () => ({ insert: mock.insert }) },
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DEV", false);
  mock.insert.mockResolvedValue({ error: null });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
it("keeps crawler errors in its own artifact without writing visitor telemetry or mounting interceptors", async () => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
    "AscentSiteHealth/1.0",
  );
  const originalConsole = console.error,
    originalWindow = window.onerror;
  initErrorLogging();
  await logError(new Error("Fixture crawler error"));
  expect(mock.insert).not.toHaveBeenCalled();
  expect(console.error).toBe(originalConsole);
  expect(window.onerror).toBe(originalWindow);
});
it("preserves normal visitor error reporting", async () => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Ordinary browser");
  await logError(new Error("Fixture visitor error"));
  expect(mock.insert).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Fixture visitor error",
      user_agent: "Ordinary browser",
    }),
  );
  expect(
    JSON.parse(mock.insert.mock.calls[0][0].context).buildVersion,
  ).toBeTruthy();
});

describe("promise rejection diagnostics", () => {
  it("retains the failure stack and existing message grouping", () => {
    const reason = new TypeError("this.o.at is not a function");
    reason.stack =
      "TypeError: this.o.at is not a function\n at original-bundle.js:123:4";
    const logged = errorFromRejection(reason);
    expect(logged.message).toBe(
      "Unhandled Promise Rejection: TypeError: this.o.at is not a function",
    );
    expect(logged.stack).toBe(reason.stack);
    expect(reason.message).toBe("this.o.at is not a function");
  });
  it("handles non-Error rejections without failing the interceptor", () => {
    expect(errorFromRejection(null).message).toBe(
      "Unhandled Promise Rejection: null",
    );
    expect(errorFromRejection("Object Not Found").message).toContain(
      "Object Not Found",
    );
  });
});

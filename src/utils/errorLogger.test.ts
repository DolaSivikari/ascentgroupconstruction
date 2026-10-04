import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { initErrorLogging, logError } from "./errorLogger";
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
});

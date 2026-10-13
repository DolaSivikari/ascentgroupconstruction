import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { invokeChecked } from "./invokeChecked";
const mock = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: mock },
}));
beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.useRealTimers());
it.each([
  { data: null, error: new Error("HTTP failure") },
  { data: { success: false }, error: null },
  {
    data: { adminEmail: { error: { message: "private provider payload" } } },
    error: null,
  },
])(
  "rejects resolved function/provider failure without exposing its payload",
  async (result) => {
    mock.invoke.mockResolvedValue(result);
    await expect(invokeChecked("notification", { body: {} })).rejects.toThrow(
      "could not confirm",
    );
  },
);
it("accepts a confirmed result", async () => {
  mock.invoke.mockResolvedValue({ data: { success: true }, error: null });
  await expect(invokeChecked("notification", { body: {} })).resolves.toEqual({
    success: true,
  });
});
it("aborts a stalled request without waiting forever", async () => {
  vi.useFakeTimers();
  mock.invoke.mockReturnValue(new Promise(() => {}));
  const outcome = expect(
    invokeChecked("notification", { body: {} }),
  ).rejects.toThrow("in time");
  await vi.advanceTimersByTimeAsync(10000);
  await outcome;
  expect(mock.invoke.mock.calls[0][1].signal.aborted).toBe(true);
});

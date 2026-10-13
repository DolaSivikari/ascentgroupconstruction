import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { defineContent } from "@/content/types";
const mock = vi.hoisted(() => ({
  flags: vi.fn(),
  content: vi.fn(),
  from: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: vi.fn(),
    },
  },
}));
vi.mock("@/lib/publicSettings", () => ({
  visitorSupabase: { from: mock.from },
}));
import {
  bootstrapContent,
  disableContentOverrides,
  refreshContentOverrides,
  useResolvedContent,
} from "./store";
const module = defineContent(
  "test-page",
  { heading: "Default" },
  {
    heading: { label: "Heading", section: "Hero", kind: "text" },
  },
);
const flags = {
  data: [
    { key: "content_overrides", enabled: true },
    { key: "content_overrides_admin_only", enabled: false },
  ],
  error: null,
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("VITE_PAGE_OVERRIDES_ENABLED", "true");
  disableContentOverrides();
  mock.flags.mockResolvedValue(flags);
  mock.content.mockResolvedValue({
    data: [{ key: "test-page.heading", published_value: "Published" }],
    error: null,
  });
  mock.from.mockImplementation((table) => {
    if (table === "site_flags") return { select: () => mock.flags() };
    let id: string;
    const query = {
      select: () => query,
      eq: (field: string, value: string) => {
        expect(field).toBe("page_id");
        id = value;
        return query;
      },
      not: () => query,
      order: () => query,
      range: () => mock.content(id),
    };
    return query;
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("applies a late first response after the bootstrap deadline instead of freezing defaults", async () => {
  vi.useFakeTimers();
  let resolve!: (value: typeof flags) => void;
  mock.flags.mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  const boot = bootstrapContent();
  const hook = renderHook(() => useResolvedContent(module));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(601);
    await boot;
  });
  expect(hook.result.current.heading).toBe("Default");
  await act(async () => {
    resolve(flags);
  });
  expect(hook.result.current.heading).toBe("Published");
  expect(mock.content).toHaveBeenCalledWith("test-page");
});
it("deduplicates mounted consumers and fetches only their module", async () => {
  await refreshContentOverrides();
  const hook = renderHook(() => [
    useResolvedContent(module),
    useResolvedContent(module),
  ]);
  await waitFor(() => expect(hook.result.current[0].heading).toBe("Published"));
  expect(mock.content).toHaveBeenCalledTimes(1);
  expect(mock.content).toHaveBeenCalledWith("test-page");
});
it("does not restore overrides from an in-flight response after disabling them", async () => {
  let resolve!: (value: unknown) => void;
  mock.content.mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  await refreshContentOverrides();
  const hook = renderHook(() => useResolvedContent(module));
  await act(async () => {
    disableContentOverrides();
    resolve({
      data: [{ key: "test-page.heading", published_value: "Late" }],
      error: null,
    });
  });
  expect(hook.result.current.heading).toBe("Default");
});

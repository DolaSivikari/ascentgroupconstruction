import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePublicSettings } from "./usePublicSettings";
const mock = vi.hoisted(() => ({ read: vi.fn(), select: vi.fn() }));
vi.mock("@/lib/publicSettings", () => ({
  PUBLIC_SETTINGS_PROJECTIONS: {
    about_page_settings: "id,hero_headline,is_active",
  },
  visitorSupabase: {
    from: () => ({
      select: (columns: string) => {
        mock.select(columns);
        return { eq: () => ({ limit: () => ({ maybeSingle: mock.read }) }) };
      },
    }),
  },
}));
afterEach(cleanup);
describe("anonymous settings reads", () => {
  it("uses the visitor client with an explicit projection and refetches only on the matching save event", async () => {
    mock.read.mockResolvedValue({
      data: { hero_headline: "First" },
      error: null,
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(
      () => usePublicSettings<{ hero_headline: string }>("about_page_settings"),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.data?.hero_headline).toBe("First"),
    );
    expect(mock.select).toHaveBeenCalledWith("id,hero_headline,is_active");
    act(() =>
      window.dispatchEvent(
        new CustomEvent("ascent-settings-updated", {
          detail: "footer_settings",
        }),
      ),
    );
    expect(mock.read).toHaveBeenCalledTimes(1);
    mock.read.mockResolvedValue({
      data: { hero_headline: "Published" },
      error: null,
    });
    act(() =>
      window.dispatchEvent(
        new CustomEvent("ascent-settings-updated", {
          detail: "about_page_settings",
        }),
      ),
    );
    await waitFor(() =>
      expect(result.current.data?.hero_headline).toBe("Published"),
    );
  });
});

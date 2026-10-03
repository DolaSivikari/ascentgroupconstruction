import { act, cleanup, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsConsent } from "@/lib/analyticsConsent";
import { useSearchAnalytics } from "./useSearchAnalytics";
import { useServiceAnalytics } from "./useServiceAnalytics";
import { useABTest, trackABTestConversion } from "./useABTest";
import { personalization } from "@/utils/personalization";
const mock = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: mock }));
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  setAnalyticsConsent("rejected");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe("optional first-party tracking", () => {
  it("does not assign A/B test identifiers or write conversions after Reject", async () => {
    const { result } = renderHook(() => useABTest("fixture-test"));
    expect(result.current).toBe("control");
    await trackABTestConversion("fixture-test", 1);
    expect(mock.from).not.toHaveBeenCalled();
    expect(localStorage.getItem("ab_test_user_id")).toBeNull();
  });
  it("does not track search clicks or create a search identifier after Reject", async () => {
    const { result } = renderHook(useSearchAnalytics);
    await act(async () => {
      await result.current.trackSearch({
        search_query: "masonry",
        results_count: 2,
      });
      await result.current.trackResultClick(
        "masonry",
        "Masonry",
        "/services/masonry",
      );
    });
    expect(mock.from).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("search_session_id")).toBeNull();
  });
  it("cancels a pending debounced search write when consent is revoked", async () => {
    vi.useFakeTimers();
    setAnalyticsConsent("accepted");
    const { result } = renderHook(useSearchAnalytics);
    await result.current.trackSearch({
      search_query: "masonry",
      results_count: 2,
    });
    setAnalyticsConsent("rejected");
    await vi.advanceTimersByTimeAsync(1001);
    expect(mock.from).not.toHaveBeenCalled();
  });
  it("does not write service events or interactions after Reject", async () => {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const { result } = renderHook(useServiceAnalytics, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });
    await act(async () => {
      result.current.trackEvent({
        service_link: "/services/masonry",
        service_name: "Masonry",
        event_type: "click",
      });
      result.current.trackInteraction({ serviceLink: "/services/masonry" });
    });
    expect(mock.from).not.toHaveBeenCalled();
    expect(mock.rpc).not.toHaveBeenCalled();
    expect(localStorage.getItem("user_identifier")).toBeNull();
    client.clear();
  });
  it("does not request IP geolocation or persist a visitor profile after Reject", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    personalization.initialize();
    personalization.trackInteraction("service_view", { service: "Masonry" });
    expect(fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem("user_profile")).toBeNull();
    fetch.mockRestore();
  });
});

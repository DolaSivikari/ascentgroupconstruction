import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  document.getElementById("consented-google-analytics")?.remove();
  window.dataLayer = [];
  delete window.gtag;
});
describe("analytics consent", () => {
  it.each([null, "rejected"])(
    "does not load or queue analytics with choice %s",
    async (choice) => {
      if (choice) localStorage.setItem("cookie-consent", choice);
      const { initializeAnalyticsConsent } = await import("./analyticsConsent");
      const { trackPageView, trackConversion } = await import("./analytics");
      initializeAnalyticsConsent();
      trackPageView("/services", "Services");
      trackConversion("form_submit");
      window.gtag?.("event", "email_click");
      expect(
        document.querySelector('script[src*="googletagmanager"]'),
      ).toBeNull();
      expect(window.dataLayer).toEqual([]);
    },
  );
  it("loads once on Accept and tracks subsequent SPA page views", async () => {
    const { initializeAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    const { trackPageView } = await import("./analytics");
    initializeAnalyticsConsent();
    setAnalyticsConsent("accepted");
    setAnalyticsConsent("accepted");
    expect(
      document.querySelectorAll('script[src*="googletagmanager"]'),
    ).toHaveLength(1);
    expect(localStorage.getItem("cookie-consent")).toBe("accepted");
    trackPageView("/services", "Services");
    expect(window.dataLayer).toContainEqual([
      "event",
      "page_view",
      { page_path: "/services", page_title: "Services" },
    ]);
  });
  it("honours a returning accepted choice and disables events after Reject", async () => {
    localStorage.setItem("cookie-consent", "accepted");
    const { initializeAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    const { trackConversion } = await import("./analytics");
    initializeAnalyticsConsent();
    expect(document.getElementById("consented-google-analytics")).toBeTruthy();
    setAnalyticsConsent("rejected");
    const length = window.dataLayer.length;
    trackConversion("form_submit");
    window.gtag?.("event", "email_click");
    expect(window.dataLayer).toHaveLength(length);
    expect(
      (window as unknown as Record<string, unknown>)["ga-disable-G-42L85RG6M6"],
    ).toBe(true);
  });
});

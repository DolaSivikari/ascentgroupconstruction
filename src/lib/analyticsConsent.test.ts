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
    expect(window.dataLayer.filter(entry => Array.isArray(entry) && entry[0] === "event" && entry[1] === "page_view" && entry[2].page_path === "/services")).toHaveLength(1);
  });
  it("delivers custom and lead events through gtag without personal form values", async () => {
    const { setAnalyticsConsent } = await import("./analyticsConsent");
    const { trackSavedFormSubmit, trackConversion } = await import("./analytics");
    setAnalyticsConsent("accepted");
    trackConversion("cta_click", { cta_name: "Estimate" });
    trackSavedFormSubmit("contact_form", { success: true, id: "fixture", name: "Private name", email: "private@example.com" }, { has_phone: true });
    expect(window.dataLayer).toContainEqual(["event", "cta_click", { cta_name: "Estimate" }]);
    expect(window.dataLayer).toContainEqual(["event", "generate_lead", { form_name: "contact_form", has_phone: true }]);
    expect(JSON.stringify(window.dataLayer)).not.toContain("private@example.com");
    expect(JSON.stringify(window.dataLayer)).not.toContain("Private name");
  });
  it.each([null, {}, { success: false, id: "blocked" }, { success: true }, { success: true, id: "" }])("does not count an unconfirmed or blocked result: %j", async (response) => {
    const { setAnalyticsConsent } = await import("./analyticsConsent");
    const { trackSavedFormSubmit } = await import("./analytics");
    setAnalyticsConsent("accepted");
    const before = window.dataLayer.length;
    trackSavedFormSubmit("rfp_form", response);
    expect(window.dataLayer).toHaveLength(before);
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

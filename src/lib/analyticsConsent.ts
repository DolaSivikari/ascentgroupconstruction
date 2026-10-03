const MEASUREMENT_ID = "G-42L85RG6M6";
let enabled = false;
let configured = false;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function readAnalyticsConsent(): string | null {
  try {
    return localStorage.getItem("cookie-consent");
  } catch {
    return null;
  }
}
export const hasAnalyticsConsent = () => enabled;

function applyConsent(accepted: boolean) {
  enabled = accepted;
  // GA respects this switch even when its script has already been loaded.
  (window as unknown as Record<string, unknown>)[
    `ga-disable-${MEASUREMENT_ID}`
  ] = !accepted;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    if (enabled || args[0] === "consent") window.dataLayer.push(args);
  };
  if (!accepted) {
    if (configured)
      window.gtag("consent", "update", { analytics_storage: "denied" });
    return;
  }
  window.gtag("consent", configured ? "update" : "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (!configured) {
    configured = true;
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
    const script = document.createElement("script");
    script.id = "consented-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

export function initializeAnalyticsConsent() {
  applyConsent(readAnalyticsConsent() === "accepted");
}
export function setAnalyticsConsent(choice: "accepted" | "rejected") {
  try {
    localStorage.setItem("cookie-consent", choice);
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
  } catch {
    /* Keep the choice for this visit when storage is unavailable. */
  }
  applyConsent(choice === "accepted");
  window.dispatchEvent(new Event("analytics-consent-changed"));
  if (enabled)
    window.gtag?.("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
}

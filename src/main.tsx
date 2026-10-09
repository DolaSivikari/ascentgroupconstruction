import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider";
import "./styles/animations.css";
import "./styles/mobile-nav.css";
import "./styles/textures.css";
import "./index.css";
import { initErrorLogging } from "./utils/errorLogger";
import { initializeServiceWorker } from "./utils/serviceWorker";

import { initializeAnalyticsConsent } from "./lib/analyticsConsent";

import { bootstrapContent } from "./lib/content/store";

const privatePackagePage =
  window.location.pathname.startsWith("/prequal-package/");
if (!privatePackagePage) initializeAnalyticsConsent();

async function mount() {
  await bootstrapContent();

  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>,
  );
}
void mount();

// Defer non-critical boot work until the browser is idle so it doesn't
// compete with hydration / first interaction. Falls back to setTimeout for Safari.
const runIdle = (cb: () => void, timeout = 2000) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, 1);
  }
};

if (!privatePackagePage)
  runIdle(() => {
    // Web Vitals tracking
    void import("./lib/webVitals").then(({ reportWebVitals }) => reportWebVitals());
    // Error logging
    initErrorLogging();
  });

// Updates activate after existing tabs close. Never reload an open form or editor.
if (import.meta.env.PROD && !privatePackagePage) initializeServiceWorker();

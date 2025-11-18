import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/mobile-nav.css";
import "./styles/textures.css";
import "./index.css";
import { reportWebVitals } from "./lib/webVitals";
import { initErrorLogging } from "./utils/errorLogger";
import { checkForDeploymentUpdate, clearAllCaches } from "./utils/cacheBuster";

// Reload guard to prevent multiple simultaneous reloads
let isReloading = false;

const safeReload = () => {
  if (!isReloading) {
    isReloading = true;
    console.log('[App] Reloading application...');
    window.location.reload();
  }
};

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Initialize Web Vitals tracking
reportWebVitals();

// Initialize error logging
initErrorLogging();

// Check for deployment updates
checkForDeploymentUpdate().then(async (hasUpdate) => {
  if (hasUpdate) {
    console.log('[Cache Buster] New deployment detected, clearing caches...');
    await clearAllCaches();
    safeReload();
  }
});

// Register service worker for offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[Service Worker] Registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[Service Worker] New version available, clearing caches...');
                
                // Clear all caches before activating new worker
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    Promise.all(names.map(name => caches.delete(name)))
                      .then(() => {
                          // Ask current controller to clear caches
                          if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
                          }
                          // Send skip waiting message (will trigger controllerchange)
                          newWorker.postMessage({ type: 'SKIP_WAITING' });
                      });
                  });
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}

// Listen for controller changes to ensure new SW takes control
if ('serviceWorker' in navigator) {
  let isFirstControllerChange = true;
  
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Skip the first controller change (happens on initial page load)
    if (isFirstControllerChange) {
      isFirstControllerChange = false;
      console.log('[Service Worker] Initial controller set');
      return;
    }
    
    // Only reload if this is a genuine update (not initial page load)
    console.log('[Service Worker] New version activated');
    safeReload();
  });
}

// Keyboard shortcut: Ctrl/Cmd + Shift + U to force clear caches
window.addEventListener('keydown', async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
    console.log('[Cache Buster] Shortcut triggered - clearing caches');
    await clearAllCaches();
    safeReload();
  }
});

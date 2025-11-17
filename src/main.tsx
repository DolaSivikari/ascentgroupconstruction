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
checkForDeploymentUpdate().then((hasUpdate) => {
  if (hasUpdate) {
    console.log('[Cache Buster] New deployment detected, clearing caches...');
    clearAllCaches();
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
                
                // Clear all caches before reloading
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    Promise.all(names.map(name => caches.delete(name)))
                      .then(() => {
                          // Ask current controller to clear caches
                          if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
                          }
                          // Send skip waiting message
                          newWorker.postMessage({ type: 'SKIP_WAITING' });
                          
                          // Reload page after cache clear
                          setTimeout(() => {
                            console.log('[Service Worker] Reloading for update...');
                            window.location.reload();
                          }, 100);
                      });
                  });
                }
              }
            });
}

// Listen for controller changes to ensure new SW takes control
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[Service Worker] Controller changed, reloading...');
    window.location.reload();
  });
}

// Keyboard shortcut: Ctrl/Cmd + Shift + U to force clear caches
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
    console.log('[Cache Buster] Shortcut triggered - clearing caches');
    clearAllCaches();
  }
});
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}

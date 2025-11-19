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

// Check for deployment updates - only in production and after initial load
if (import.meta.env.PROD) {
  const hasCheckedThisSession = sessionStorage.getItem('deployment-check-done');
  
  if (!hasCheckedThisSession) {
    // Wait 30 seconds before checking to avoid interfering with initial load
    setTimeout(() => {
      checkForDeploymentUpdate().then(async (hasUpdate) => {
        if (hasUpdate) {
          sessionStorage.setItem('deployment-check-done', 'true');
          console.log('[Cache Buster] Update available. Will apply on next visit.');
          // Update will be applied on next page load, not immediately
        }
      });
    }, 30000);
  }
}

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
                console.log('[Service Worker] Update ready, will apply on next visit');
                
                // Store update flag for next page load
                sessionStorage.setItem('sw-update-ready', 'true');
                
                // Send skip waiting message
                newWorker.postMessage({ type: 'SKIP_WAITING' });
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

// Track user activity for smart reload timing
let lastActivity = Date.now();
const updateActivity = () => {
  lastActivity = Date.now();
  sessionStorage.setItem('last-activity', lastActivity.toString());
};

['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  window.addEventListener(event, updateActivity, { passive: true });
});

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
    
    // Only clear caches and reload if SW update flag is set
    const hasUpdate = sessionStorage.getItem('sw-update-ready');
    if (hasUpdate) {
      console.log('[Service Worker] Update detected');
      
      // Check if user has been inactive for 5+ seconds
      const timeSinceActivity = Date.now() - lastActivity;
      
      if (timeSinceActivity > 5000) {
        // User is idle, safe to reload
        console.log('[Service Worker] User idle, applying update...');
        sessionStorage.removeItem('sw-update-ready');
        clearAllCaches().then(() => safeReload());
      } else {
        // User is active, defer reload
        console.log('[Service Worker] User active, deferring update...');
        sessionStorage.setItem('deferred-reload', 'true');
        
        // Check again in 10 seconds
        setTimeout(() => {
          const stillHasUpdate = sessionStorage.getItem('deferred-reload');
          if (stillHasUpdate) {
            sessionStorage.removeItem('deferred-reload');
            sessionStorage.removeItem('sw-update-ready');
            clearAllCaches().then(() => safeReload());
          }
        }, 10000);
      }
    }
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

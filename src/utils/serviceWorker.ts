/** Register once after load, without replacing a worker used by an open tab. */
export const initializeServiceWorker = (): (() => void) => {
  if (!('serviceWorker' in navigator)) return () => undefined;

  const register = () => {
    void navigator.serviceWorker.register('/service-worker.js', { updateViaCache: 'none' })
      .catch(error => console.error('[Service Worker] Registration failed:', error));
  };
  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
  return () => window.removeEventListener('load', register);
};

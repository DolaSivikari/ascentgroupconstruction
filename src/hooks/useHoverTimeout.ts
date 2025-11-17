import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage hover timeouts with automatic cleanup
 * Prevents memory leaks when components unmount during pending timeouts
 */
export const useHoverTimeout = () => {
  const [timeout, setTimeout] = useState<NodeJS.Timeout | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  }, [timeout]);

  const scheduleAction = useCallback((action: () => void, delay: number) => {
    clearPendingTimeout();
    const newTimeout = globalThis.setTimeout(action, delay);
    setTimeout(newTimeout);
  }, [clearPendingTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPendingTimeout();
  }, [clearPendingTimeout]);

  return {
    scheduleAction,
    clearPendingTimeout,
  };
};

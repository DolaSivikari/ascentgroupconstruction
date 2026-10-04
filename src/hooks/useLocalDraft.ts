import { useCallback, useEffect, useState } from "react";

export interface LocalDraft<T> {
  data: T;
  timestamp: string;
}

/** Autosave stays on this device. Explicit Save is the only server write. */
export function useLocalDraft<T>(
  data: T,
  storageKey: string,
  enabled: boolean,
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLastSaved(null);
    setError(null);
  }, [storageKey]);
  useEffect(() => {
    if (!enabled) return;
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify({ data, timestamp }));
      setLastSaved(new Date(timestamp));
      setError(null);
    } catch {
      setError(
        "The draft could not be saved on this device. Keep this page open and use Save Project.",
      );
    }
  }, [data, storageKey, enabled]);
  const loadFromLocalStorage = useCallback((): LocalDraft<T> | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const draft = JSON.parse(raw) as LocalDraft<T>;
      return draft &&
        typeof draft.timestamp === "string" &&
        Number.isFinite(Date.parse(draft.timestamp)) &&
        draft.data
        ? draft
        : null;
    } catch {
      return null;
    }
  }, [storageKey]);
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setLastSaved(null);
      setError(null);
    } catch {
      setError(
        "The saved local draft could not be cleared. Discard it before restoring another draft.",
      );
    }
  }, [storageKey]);
  return { lastSaved, error, loadFromLocalStorage, clearLocalStorage };
}

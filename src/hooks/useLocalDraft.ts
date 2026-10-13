import { useCallback, useEffect, useRef, useState } from "react";

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
  const pending = useRef<{ key: string; data: T } | null>(null);
  const flush = useCallback(() => {
    const draft = pending.current;
    if (!draft) return;
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem(
        draft.key,
        JSON.stringify({ data: draft.data, timestamp }),
      );
      pending.current = null;
      setLastSaved(new Date(timestamp));
      setError(null);
    } catch {
      setError(
        "The draft could not be saved on this device. Keep this page open and use Save.",
      );
    }
  }, []);
  useEffect(() => {
    if (pending.current?.key !== storageKey) flush();
    setLastSaved(null);
    setError(null);
  }, [storageKey, flush]);
  useEffect(() => {
    if (!enabled) {
      pending.current = null;
      return;
    }
    pending.current = { key: storageKey, data };
    const timer = setTimeout(flush, 500);
    return () => clearTimeout(timer);
  }, [data, storageKey, enabled, flush]);
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
      flush();
    };
  }, [flush]);
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
    if (pending.current?.key === storageKey) pending.current = null;
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
  return { lastSaved, error, loadFromLocalStorage, clearLocalStorage, flush };
}

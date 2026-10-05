import { useEffect, useState } from "react";
import { Button } from "@/ui/Button";
import type { LocalDraft } from "@/hooks/useLocalDraft";
export function LocalDraftRecovery<T>({
  storageKey,
  load,
  restore,
  discard,
}: {
  storageKey: string;
  load: () => LocalDraft<T> | null;
  restore: (value: T) => void;
  discard: () => void;
}) {
  const [draft, setDraft] = useState<LocalDraft<T> | null>(null);
  useEffect(() => {
    setDraft(load());
  }, [storageKey, load]);
  if (!draft) return null;
  return (
    <div className="rounded-lg border p-4 flex flex-wrap gap-3 items-center">
      <p>
        Unsaved changes from {new Date(draft.timestamp).toLocaleString()} are
        stored on this device.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          restore(draft.data);
          setDraft(null);
        }}
      >
        Restore draft
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          discard();
          setDraft(null);
        }}
      >
        Discard local draft
      </Button>
    </div>
  );
}

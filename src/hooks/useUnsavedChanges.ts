import { useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  message?: string;
  /** Screens within one mounted editor retain the same draft state. */
  preserveDraftPaths?: readonly string[];
  /** Changing only these section selectors keeps the same mounted editor. */
  preserveDraftQueryKeys?: readonly string[];
}

export const useUnsavedChanges = ({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
  preserveDraftPaths = [],
  preserveDraftQueryKeys = [],
}: UseUnsavedChangesProps) => {
  const dirty = useRef(hasUnsavedChanges);
  const proceeding = useRef(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  dirty.current = hasUnsavedChanges;
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const currentQuery = new URLSearchParams(currentLocation.search);
    const nextQuery = new URLSearchParams(nextLocation.search);
    for (const key of preserveDraftQueryKeys) {
      currentQuery.delete(key);
      nextQuery.delete(key);
    }
    currentQuery.sort();
    nextQuery.sort();
    const sameQueryWorkspace =
      preserveDraftQueryKeys.length > 0 &&
      currentLocation.pathname === nextLocation.pathname &&
      currentLocation.hash === nextLocation.hash &&
      currentQuery.toString() === nextQuery.toString();
    return (
      dirty.current &&
      !sameQueryWorkspace &&
      !(
        preserveDraftPaths.includes(currentLocation.pathname) &&
        preserveDraftPaths.includes(nextLocation.pathname)
      ) &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash)
    );
  });
  useEffect(() => {
    if (blocker.state !== "blocked") proceeding.current = false;
  }, [blocker.state]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = message;
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [message]);
  return {
    showDialog: !!pendingAction || blocker.state === "blocked",
    confirmNavigation: () => {
      if (pendingAction) {
        setPendingAction(null);
        pendingAction();
      } else if (blocker.state === "blocked") {
        proceeding.current = true;
        blocker.proceed();
      }
    },
    cancelNavigation: () => {
      setPendingAction(null);
      if (blocker.state === "blocked" && !proceeding.current) blocker.reset();
    },
    requestDiscard: (action: () => void) => {
      if (dirty.current) setPendingAction(() => action);
      else action();
    },
    // Successful saves can navigate before React commits the clean state.
    markSaved: () => {
      dirty.current = false;
    },
    message,
  };
};

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { setAuthCache, clearAuthCache } from "@/utils/authCache";

const AUTH_TIMEOUT = 10000;
const MAX_RETRIES = 3;
export type AdminAccessStatus = "loading" | "allowed" | "signed-out" | "denied" | "error";
interface AdminAccess {
  status: AdminAccessStatus;
  user: User | null;
}

export const useAdminAuth = () => {
  const [access, setAccess] = useState<AdminAccess>({ status: "loading", user: null });
  const currentAccess = useRef(access);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verification, setVerification] = useState(0);
  const updateAccess = useCallback((next: AdminAccess) => {
    currentAccess.current = next;
    setAccess(next);
  }, []);

  useEffect(() => {
    let mounted = true;
    let sequence = 0;
    let backgroundUserId: string | null = null;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const controllers = new Set<AbortController>();

    const cancelPending = () => {
      sequence += 1;
      timers.forEach(clearTimeout);
      timers.clear();
      controllers.forEach(controller => controller.abort());
      controllers.clear();
      backgroundUserId = null;
    };
    const isCurrent = (request: number) => mounted && request === sequence;

    const check = async (request: number, attempt: number) => {
      const controller = new AbortController();
      controllers.add(controller);
      let timeout: ReturnType<typeof setTimeout>;
      const verify = async (): Promise<AdminAccess> => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!isCurrent(request) || controller.signal.aborted) throw new Error("CANCELLED");
        if (error) throw error;
        if (!session) return { status: "signed-out", user: null };
        if (backgroundUserId && session.user.id !== backgroundUserId) {
          // A different account must never inherit the previous user's screen.
          backgroundUserId = null;
          setIsVerifying(false);
          updateAccess({ status: "loading", user: null });
        }

        // Never grant access from sessionStorage. The protected role query also
        // verifies the session against the backend's existing RLS policies.
        const { data: role, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .in("role", ["admin", "super_admin"])
          .limit(1)
          .abortSignal(controller.signal)
          .maybeSingle();
        if (roleError) throw roleError;
        return { status: role ? "allowed" : "denied", user: session.user };
      };

      try {
        const result = await Promise.race([
          verify(),
          new Promise<never>((_, reject) => {
            timeout = setTimeout(() => {
              controller.abort();
              reject(new Error("TIMEOUT"));
            }, AUTH_TIMEOUT);
            timers.add(timeout);
          }),
        ]);
        if (!isCurrent(request)) return;
        setAuthCache(result.status === "allowed");
        backgroundUserId = null;
        setIsVerifying(false);
        updateAccess(result);
      } catch {
        if (!isCurrent(request)) return;
        clearAuthCache();
        if (attempt < MAX_RETRIES) {
          const retryTimer = setTimeout(() => {
            timers.delete(retryTimer);
            void check(request, attempt + 1);
          }, 1000 * 2 ** attempt);
          timers.add(retryTimer);
        } else {
          backgroundUserId = null;
          setIsVerifying(false);
          updateAccess({ status: "error", user: null });
        }
      } finally {
        clearTimeout(timeout);
        timers.delete(timeout);
        controller.abort();
        controllers.delete(controller);
      }
    };

    const start = (preserveEditor = false) => {
      cancelPending();
      backgroundUserId = preserveEditor ? currentAccess.current.user?.id ?? null : null;
      setIsVerifying(preserveEditor);
      if (!preserveEditor) updateAccess({ status: "loading", user: null });
      void check(sequence, 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        cancelPending();
        clearAuthCache();
        if (mounted) {
          setIsVerifying(false);
          updateAccess({ status: "signed-out", user: null });
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        const preserveEditor = currentAccess.current.status === "allowed"
          && !!session && session.user.id === currentAccess.current.user?.id;
        // Repeated same-account events must not restart the bounded retry budget.
        if (preserveEditor && backgroundUserId === session.user.id) return;
        // Supabase auth callbacks must finish before starting another auth call.
        cancelPending();
        backgroundUserId = preserveEditor ? session.user.id : null;
        setIsVerifying(preserveEditor);
        if (!preserveEditor) updateAccess({ status: "loading", user: null });
        const timer = setTimeout(() => {
          timers.delete(timer);
          if (mounted) start(preserveEditor);
        }, 0);
        timers.add(timer);
      }
    });
    start();
    return () => {
      mounted = false;
      cancelPending();
      subscription.unsubscribe();
    };
  }, [verification, updateAccess]);

  const retry = useCallback(() => {
    setIsVerifying(false);
    updateAccess({ status: "loading", user: null });
    setVerification(current => current + 1);
  }, [updateAccess]);

  return {
    ...access,
    isLoading: access.status === "loading",
    isAdmin: access.status === "allowed",
    isVerifying,
    retry,
  };
};

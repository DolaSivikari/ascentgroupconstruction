import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ADMIN_IDLE_TIMEOUT,
  ADMIN_IDLE_WARNING,
} from "@/lib/admin/preferences";

export const useIdleTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const navigate = useNavigate();
  const { activate, getRemainingTime } = useIdleTimer({
    timeout: ADMIN_IDLE_TIMEOUT,
    promptBeforeIdle: ADMIN_IDLE_WARNING,
    crossTab: true,
    throttle: 500,
    onPrompt: () => setShowWarning(true),
    onActive: () => setShowWarning(false),
    onIdle: async () => {
      window.dispatchEvent(new Event("admin-before-idle-signout"));
      let error: unknown;
      try {
        error = (await supabase.auth.signOut()).error;
      } catch (reason) {
        error = reason;
      }
      if (error) {
        toast.error(
          "Could not sign out after inactivity. Please retry using the user menu.",
        );
        return;
      }
      setShowWarning(false);
      navigate("/tekev", { replace: true });
    },
  });
  useEffect(() => {
    if (!showWarning) return;
    const interval = setInterval(
      () => setRemainingTime(Math.max(0, Math.ceil(getRemainingTime() / 1000))),
      1000,
    );
    return () => clearInterval(interval);
  }, [showWarning, getRemainingTime]);
  // Supabase's existing autoRefreshToken continues independently of this idle timer.
  return {
    showWarning,
    remainingTime,
    extendSession: () => {
      activate();
      setShowWarning(false);
    },
  };
};

import { useEffect, useState, useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_TIME = 14 * 60 * 1000; // Show warning at 14 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check for token refresh every minute

export const useIdleTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const navigate = useNavigate();

  const onIdle = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const onActive = () => {
    if (showWarning) {
      setShowWarning(false);
      reset();
    }
  };

  const { reset, getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: IDLE_TIMEOUT,
    throttle: 500,
    crossTab: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingTime();
      const remainingSeconds = Math.floor(remaining / 1000);
      
      // Show warning when 1 minute left
      if (remaining <= 60 * 1000 && remaining > 0) {
        setShowWarning(true);
        setRemainingTime(remainingSeconds);
      } else if (remaining <= 0) {
        setShowWarning(false);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  const extendSession = () => {
    reset();
    setShowWarning(false);
  };

  // Throttled activity tracker for subtle interactions (scroll, mouse movement)
  // Refreshes session token if user is active, maintaining security while improving UX
  const trackActivity = useCallback(() => {
    let lastActivityTime = Date.now();
    
    const refreshSessionIfNeeded = async () => {
      const timeSinceActivity = Date.now() - lastActivityTime;
      
      // Only refresh if there's been recent activity (within last minute)
      if (timeSinceActivity < ACTIVITY_CHECK_INTERVAL) {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Refresh token if session exists and is approaching expiry
        if (session) {
          const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
          const timeUntilExpiry = expiresAt - Date.now();
          
          // Refresh if less than 5 minutes until token expiry
          if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            await supabase.auth.refreshSession();
          }
        }
      }
    };

    const handleActivity = () => {
      lastActivityTime = Date.now();
    };

    // Throttled event listeners for subtle activity
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('mousemove', handleActivity, { passive: true });
    
    // Check for token refresh periodically
    const intervalId = setInterval(refreshSessionIfNeeded, ACTIVITY_CHECK_INTERVAL);

    return () => {
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      clearInterval(intervalId);
    };
  }, []);

  // Set up activity tracking
  useEffect(() => {
    const cleanup = trackActivity();
    return cleanup;
  }, [trackActivity]);

  return {
    showWarning,
    remainingTime,
    extendSession,
  };
};

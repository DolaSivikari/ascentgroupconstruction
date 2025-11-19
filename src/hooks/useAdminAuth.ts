import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthCache, setAuthCache, clearAuthCache } from "@/utils/authCache";

const AUTH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearAuthCache();
        setIsAdmin(false);
        setIsLoading(false);
        navigate('/');
      }
    });

    checkAdminAuth();

    return () => subscription.unsubscribe();
  }, []);

  const performAuthCheck = async (): Promise<boolean> => {
    // Check cache first
    const cached = getAuthCache();
    if (cached !== null) {
      return cached.isAdmin;
    }

    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('NO_SESSION');
    }

    // Check if user has admin or super_admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (roleError) {
      throw new Error('ROLE_CHECK_FAILED');
    }

    const hasAdminRole = !!roleData;
    
    // Cache the result
    setAuthCache(hasAdminRole);
    
    return hasAdminRole;
  };

  const checkAdminAuth = async () => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), AUTH_TIMEOUT)
      );

      const isAdminUser = await Promise.race([
        performAuthCheck(),
        timeoutPromise
      ]);

      if (!isAdminUser) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this area.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      const errorMessage = error?.message || 'UNKNOWN';
      
      if (errorMessage === 'TIMEOUT') {
        if (retryCount < MAX_RETRIES) {
          // Retry with exponential backoff
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkAdminAuth();
          }, delay);
          return;
        }
        
        toast({
          title: "Connection Timeout",
          description: "Unable to verify access. Please try again.",
          variant: "destructive",
        });
      } else if (errorMessage === 'NO_SESSION') {
        // Silent redirect for no session
        navigate("/");
        return;
      } else if (errorMessage === 'ROLE_CHECK_FAILED') {
        if (retryCount < MAX_RETRIES) {
          // Retry once for database errors
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkAdminAuth();
          }, 1000);
          return;
        }
        
        toast({
          title: "Verification Failed",
          description: "Unable to verify permissions. Please try again.",
          variant: "destructive",
        });
      }
      
      if (import.meta.env.DEV) {
        console.error("Admin auth check failed:", error);
      }
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    setIsLoading(true);
    setRetryCount(0);
    checkAdminAuth();
  };

  return { isLoading, isAdmin, retry };
};

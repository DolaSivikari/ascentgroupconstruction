import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export interface RateLimitResult {
  allowed: boolean;
  request_count?: number;
  limit?: number;
  retry_after_seconds?: number;
}

/**
 * Check and update rate limit for a given identifier and endpoint
 * @param supabase Supabase client instance
 * @param identifier Unique identifier (IP address, user ID, etc.)
 * @param endpoint Endpoint name being rate limited
 * @param limit Maximum requests allowed in window (default: 50)
 * @param windowMinutes Time window in minutes (default: 1)
 * @returns Promise<RateLimitResult>
 */
export const checkRateLimit = async (
  supabase: SupabaseClient,
  identifier: string,
  endpoint: string,
  limit: number = 50,
  windowMinutes: number = 1
): Promise<RateLimitResult> => {
  try {
    const { data, error } = await supabase.rpc('check_and_update_rate_limit', {
      p_identifier: identifier,
      p_endpoint: endpoint,
      p_limit: limit,
      p_window_minutes: windowMinutes
    });

    if (error) {
      console.error('[Rate Limiter] Check failed:', error);
      // On error, allow request to prevent blocking legitimate users
      return { allowed: true };
    }

    return data as RateLimitResult;
  } catch (err) {
    console.error('[Rate Limiter] Exception:', err);
    // On exception, allow request
    return { allowed: true };
  }
};

/**
 * Get client identifier from request headers
 * @param req Request object
 * @returns string identifier (IP address or 'unknown')
 */
export const getClientIdentifier = (req: Request): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || forwarded?.split(',')[0] || realIP || 'unknown';
};

/**
 * Create rate limit exceeded response
 * @param retryAfterSeconds Seconds to wait before retrying
 * @param corsHeaders CORS headers to include
 * @returns Response object
 */
export const createRateLimitResponse = (
  retryAfterSeconds: number,
  corsHeaders: Record<string, string>
): Response => {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
      retry_after: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfterSeconds.toString(),
        ...corsHeaders,
      },
    }
  );
};

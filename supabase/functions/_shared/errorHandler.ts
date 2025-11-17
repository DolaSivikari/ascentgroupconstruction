/**
 * Shared error handling utilities for edge functions
 * Sanitizes error messages to prevent information leakage
 */

interface ErrorResponse {
  error: string;
  code?: string;
}

/**
 * Sanitizes error messages to remove sensitive information
 * @param error - The error object or message
 * @param context - Optional context for logging
 * @returns Sanitized error message safe for client
 */
export const sanitizeErrorMessage = (error: any, context?: string): string => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Remove database-specific details
  let sanitized = errorMessage
    // Remove table names (e.g., "public.users")
    .replace(/\b(public|auth|storage)\.\w+\b/g, '[table]')
    // Remove column names (e.g., "column 'email'")
    .replace(/column\s+'[^']+'/gi, "column '[field]'")
    // Remove constraint names
    .replace(/constraint\s+"[^"]+"/gi, 'constraint "[name]"')
    // Remove UUIDs
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[id]')
    // Remove IP addresses
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[ip]')
    // Remove file paths
    .replace(/\/[^\s]+\.(ts|js|json)/g, '[file]');

  // Log full error server-side for debugging
  if (context) {
    console.error(`[${context}] Full error:`, {
      message: errorMessage,
      stack: error?.stack,
      code: error?.code,
      details: error?.details,
    });
  }

  return sanitized;
};

/**
 * Creates a standardized error response for clients
 * @param error - The error object
 * @param defaultMessage - Fallback message if error can't be sanitized
 * @param statusCode - HTTP status code (default 500)
 * @param context - Context for server-side logging
 * @returns Response object with CORS headers
 */
export const createErrorResponse = (
  error: any,
  defaultMessage: string = 'Internal server error',
  statusCode: number = 500,
  context?: string
): Response => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Determine if error is a validation error (safe to show) or system error (hide details)
  const isValidationError = statusCode === 400 || statusCode === 422;
  
  let errorMessage: string;
  
  if (isValidationError) {
    // Validation errors are safe to show (user input issues)
    errorMessage = error?.message || defaultMessage;
  } else {
    // System errors should be sanitized
    const originalMessage = error?.message || error?.toString() || '';
    const sanitized = sanitizeErrorMessage(error, context);
    
    // Only show sanitized version if it's meaningfully different from original
    // Otherwise use generic message
    const isMeaningfullySanitized = sanitized.includes('[') || 
      (originalMessage.length > 0 && sanitized.length < originalMessage.length / 2);
    errorMessage = isMeaningfullySanitized ? sanitized : defaultMessage;
  }

  const responseBody: ErrorResponse = {
    error: errorMessage,
    ...(error?.code && isValidationError && { code: error.code }),
  };

  return new Response(
    JSON.stringify(responseBody),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
};

/**
 * Logs security-relevant errors with additional context
 * @param errorType - Type of security error (e.g., 'rate_limit', 'validation', 'auth')
 * @param error - The error object
 * @param metadata - Additional context (user_id, ip, etc.)
 */
export const logSecurityError = (
  errorType: string,
  error: any,
  metadata?: Record<string, any>
): void => {
  console.error(`[SECURITY:${errorType.toUpperCase()}]`, {
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    },
    metadata,
  });
};

/**
 * Handles rate limit exceeded errors with proper response
 * @param retryAfter - Seconds until rate limit resets
 * @returns Response with 429 status and Retry-After header
 */
export const createRateLimitResponse = (retryAfter: number): Response => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  return new Response(
    JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.',
      retry_after: retryAfter 
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        ...corsHeaders,
      },
    }
  );
};

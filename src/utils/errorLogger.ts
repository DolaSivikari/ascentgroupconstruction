import { supabase } from "@/integrations/supabase/client";
import { CRAWLER_USER_AGENT } from "@/lib/baseline/policy";

const isSiteHealthCrawler = () =>
  typeof navigator !== "undefined" &&
  navigator.userAgent.includes(CRAWLER_USER_AGENT);

/**
 * Log client-side errors to database for monitoring
 */
export const logError = async (error: Error, context?: Record<string, any>) => {
  if (isSiteHealthCrawler()) return;
  try {
    // Avoid logging in development to reduce noise
    if (import.meta.env.DEV) {
      console.error("[Error Logger]", error, context);
      return;
    }

    await supabase.from("error_logs").insert({
      message: error.message,
      stack: error.stack || "",
      context: JSON.stringify({
        ...context,
        buildVersion:
          (window as Window & { __BUILD_VERSION?: string }).__BUILD_VERSION ||
          new URL(import.meta.url).pathname,
      }),
      url: window.location.href,
      user_agent: navigator.userAgent,
    });
  } catch (logError) {
    // Silently fail - don't break the app if logging fails
    console.error("[Error Logger] Failed to log error:", logError);
  }
};

/** Keep the original failure location, rather than the logger's own stack. */
export const errorFromRejection = (reason: unknown): Error => {
  const error = new Error(`Unhandled Promise Rejection: ${String(reason)}`);
  if (reason instanceof Error && reason.stack) error.stack = reason.stack;
  return error;
};

/**
 * Initialize error logging interceptors
 */
export const initErrorLogging = () => {
  if (isSiteHealthCrawler()) return;
  // Intercept window.onerror
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (error) {
      logError(error, {
        source,
        line: lineno,
        column: colno,
      });
    }

    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Intercept unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    logError(errorFromRejection(event.reason), {
      reason:
        event.reason instanceof Error
          ? { name: event.reason.name, message: event.reason.message }
          : String(event.reason),
    });
  });

  // List of expected error messages that shouldn't be logged
  const EXPECTED_ERROR_MESSAGES = ["This service requires a custom quote"];

  const shouldLogError = (error: Error): boolean => {
    return !EXPECTED_ERROR_MESSAGES.some((msg) => error.message.includes(msg));
  };

  // Intercept console.error
  const originalError = console.error;
  console.error = (...args) => {
    originalError(...args);

    // Only log if first argument is an Error object and it's not an expected error
    if (args[0] instanceof Error && shouldLogError(args[0])) {
      logError(args[0], { additionalArgs: args.slice(1) });
    }
  };
};

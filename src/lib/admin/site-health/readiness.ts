/** API cache errors cannot prove whether a database object exists. */
export function healthFailure(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  if (code === "42P01")
    return {
      kind: "missing-schema",
      message:
        "A required Site Health table is missing. Review the standalone monitoring activation SQL.",
    } as const;
  if (code === "42703")
    return {
      kind: "incompatible-schema",
      message:
        "The Site Health database columns do not match the application contract. Review the schema before applying changes.",
    } as const;
  if (["PGRST204", "PGRST205"].includes(code))
    return {
      kind: "schema-cache",
      message:
        "The API cannot find a required Site Health object in its schema cache. Check the database catalog first: the object may be missing or the API cache may be stale.",
    } as const;
  if (["PGRST002", "PGRST200"].includes(code))
    return {
      kind: "schema-cache",
      message:
        "The API schema cache is unavailable or out of date. Check API readiness and the database contract before retrying.",
    } as const;
  if (["42501", "PGRST301", "PGRST302", "PGRST303"].includes(code))
    return {
      kind: "permission",
      message:
        "Site Health access was denied. Check the current sign-in and administrator permissions; this does not establish that tables are missing.",
    } as const;
  return {
    kind: "request-failure",
    message:
      "The Site Health request failed. Check the connection and backend response, then retry; readiness is unknown.",
  } as const;
}

export function healthPingFailure(error: unknown): string {
  const failure =
    error && typeof error === "object"
      ? (error as { name?: string; context?: { status?: number } })
      : {};
  const status = failure.context?.status;
  if (status === 401 || status === 403)
    return "The database check was denied. Check your sign-in and administrator permissions.";
  if (status === 404)
    return "The health-ping endpoint was not found. Verify its deployment and function URL.";
  if (status && status >= 500)
    return "The health-ping service failed. Verify function configuration and database reachability; this does not prove a missing deployment.";
  if (
    ["FunctionsFetchError", "FunctionsRelayError"].includes(failure.name || "")
  )
    return "The health-ping request could not reach the function. Check the network and function service, then retry.";
  return "The database check failed; function and database readiness are unknown. Retry and inspect the backend response.";
}

export function validHealthPing(data: unknown): data is {
  status: "ok";
  latency_ms: number;
  checked_at: string;
} {
  if (!data || typeof data !== "object") return false;
  const result = data as Record<string, unknown>;
  return (
    result.status === "ok" &&
    Number.isInteger(result.latency_ms) &&
    Number(result.latency_ms) >= 0 &&
    typeof result.checked_at === "string" &&
    Number.isFinite(Date.parse(result.checked_at))
  );
}

/** Keep error locations while removing URL queries, credentials and contact data. */
export function diagnosticText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s<>"']+/gi, (url) => {
      try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname.replace(/(\/prequal-package\/)[^/]+/g, "$1[redacted]")}`;
      } catch {
        return "[url]";
      }
    })
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g, "[token]")
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[email]")
    .replace(/\b(?:\+?\d[\d ()-]{7,}\d)\b/g, "[number]")
    .slice(0, 4000);
}

export function diagnosticContext(context: Record<string, unknown> = {}) {
  return Object.fromEntries(
    ["feature", "source", "line", "column", "componentStack"]
      .filter(
        (key) =>
          typeof context[key] === "string" || typeof context[key] === "number",
      )
      .map((key) => [
        key,
        typeof context[key] === "string"
          ? diagnosticText(context[key])
          : context[key],
      ]),
  );
}

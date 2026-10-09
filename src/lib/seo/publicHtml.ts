export interface HtmlFinding {
  path: string;
  status: number;
  title: string;
  h1: string[];
  canonical: string | null;
  contentWords: number;
  signature: string;
  issues: string[];
}

/** Assess the received HTML, without executing scripts or assuming crawler treatment. */
export function inspectPublicDocument(
  document: Document,
  url: URL,
  status: number,
  canonicalOrigin = url.origin,
): HtmlFinding {
  const title = document.title.trim();
  const h1 = Array.from(document.querySelectorAll("h1")).map(
    (node) => node.textContent?.trim() || "",
  );
  const canonical =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
    null;
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();
  const content = (
    document.querySelector("main") || document.getElementById("root")
  )?.cloneNode(true) as HTMLElement | undefined;
  content
    ?.querySelectorAll("script,style,nav")
    .forEach((node) => node.remove());
  const text = content?.textContent?.replace(/\s+/g, " ").trim() || "";
  const contentWords = text ? text.split(/\s+/).length : 0;
  const issues: string[] = [];
  const expected = new URL(url.pathname, canonicalOrigin).href;
  if (status !== 200) issues.push(`Expected HTTP 200, received ${status}.`);
  if (!title) issues.push("Missing title in initial HTML.");
  if (!description) issues.push("Missing description in initial HTML.");
  if (h1.length !== 1 || !h1[0])
    issues.push("Initial HTML needs one non-empty H1.");
  if (canonical !== expected)
    issues.push(`Initial canonical must be ${expected}.`);
  if (contentWords < 10)
    issues.push(
      "Initial HTML does not contain readable page content in main/root.",
    );
  if (
    /noindex/i.test(
      document.querySelector('meta[name="robots"]')?.getAttribute("content") ||
        "",
    )
  )
    issues.push("Public sitemap page is marked noindex.");
  const scripts = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  );
  if (!scripts.length) issues.push("No JSON-LD in initial HTML.");
  for (const script of scripts) {
    try {
      JSON.parse(script.textContent || "");
    } catch {
      issues.push("Invalid JSON-LD in initial HTML.");
    }
  }
  if (
    document
      .querySelector('meta[property="og:url"]')
      ?.getAttribute("content") !== expected
  )
    issues.push("Social URL does not match the canonical page.");
  if (
    !document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content")
  )
    issues.push("Missing social image in initial HTML.");
  return {
    path: url.pathname,
    status,
    title,
    h1,
    canonical,
    contentWords,
    signature: JSON.stringify([title, h1, text]),
    issues,
  };
}

export function markSharedShells(findings: HtmlFinding[]) {
  const groups = new Map<string, HtmlFinding[]>();
  for (const finding of findings) {
    const group = groups.get(finding.signature) || [];
    group.push(finding);
    groups.set(finding.signature, group);
  }
  for (const group of groups.values())
    if (group.length > 1) {
      for (const finding of group)
        finding.issues.push(
          `Same initial page content as ${group
            .filter((other) => other !== finding)
            .map((other) => other.path)
            .join(", ")}.`,
        );
    }
  return findings;
}

/**
 * Service Page SEO/GEO Audit
 *
 * Static analysis of every public service page (Wave 1+2 static pages + DB
 * services). Writes a markdown report and a JSON file to /mnt/documents/.
 *
 * Run:  bunx tsx scripts/audit-service-pages.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { SERVICE_REGISTRY } from "../src/data/service-registry";
import { WAVE1_PAGES } from "../src/data/wave1-services";

type Status = "pass" | "warn" | "fail";
interface Check {
  name: string;
  status: Status;
  detail?: string;
}
interface PageReport {
  slug: string;
  path: string;
  source: "static" | "db";
  title: string;
  checks: Check[];
}

const GTA_CITIES = ["toronto", "mississauga", "brampton", "vaughan", "markham", "gta", "ontario"];

function check(cond: boolean, name: string, fail: string, warn?: boolean): Check {
  return cond
    ? { name, status: "pass" }
    : { name, status: warn ? "warn" : "fail", detail: fail };
}

function auditCommon(opts: {
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  faqs: { question: string; answer: string }[];
  primaryKeyword?: string;
  heroAlt?: string;
  related?: string[];
}): Check[] {
  const checks: Check[] = [];
  const { title, description, h1, directAnswer, faqs, primaryKeyword, heroAlt, related } = opts;

  checks.push(check(!!title && title !== "Lovable App", "Title present", "Missing or default"));
  checks.push(check(!!title && title.length <= 60, "Title ≤ 60 chars", `length=${title?.length ?? 0}`, true));
  checks.push(
    check(
      !!description && description !== "Lovable Generated Project",
      "Meta description present",
      "Missing or default"
    )
  );
  checks.push(
    check(
      !!description && description.length >= 120 && description.length <= 165,
      "Meta description 120–165 chars",
      `length=${description?.length ?? 0}`,
      true
    )
  );
  checks.push(check(!!h1, "H1 present", "Missing"));
  if (primaryKeyword) {
    const kw = primaryKeyword.toLowerCase();
    checks.push(
      check(
        (title ?? "").toLowerCase().includes(kw.split(" ")[0]) ||
          (h1 ?? "").toLowerCase().includes(kw.split(" ")[0]),
        "Primary keyword in title/H1",
        `keyword="${primaryKeyword}"`,
        true
      )
    );
  }
  const daWords = (directAnswer ?? "").trim().split(/\s+/).filter(Boolean).length;
  checks.push(
    check(daWords >= 40, "DirectAnswer ≥ 40 words", `words=${daWords}`)
  );
  const daLower = (directAnswer ?? "").toLowerCase();
  const hasGeo =
    GTA_CITIES.some((c) => daLower.includes(c)) ||
    faqs.some((f) => GTA_CITIES.some((c) => (f.answer ?? "").toLowerCase().includes(c)));
  checks.push(check(hasGeo, "GEO signal (GTA city / Ontario)", "No GTA city mentioned"));
  checks.push(check(faqs.length >= 3, "≥ 3 FAQs", `count=${faqs.length}`));
  checks.push(
    check(
      faqs.every((f) => f.question.trim() && f.answer.trim()),
      "FAQ entries non-empty",
      "Empty Q or A"
    )
  );
  if (heroAlt !== undefined) {
    checks.push(check(!!heroAlt && heroAlt.length > 5, "Hero alt text", "Missing or too short"));
  }
  if (related !== undefined) {
    checks.push(check(related.length >= 2, "≥ 2 related links", `count=${related.length}`));
  }
  return checks;
}

function auditStaticPage(slug: string): PageReport | null {
  const data = WAVE1_PAGES[slug];
  if (!data) return null;
  return {
    slug,
    path: `/services/${slug}`,
    source: "static",
    title: data.title,
    checks: auditCommon({
      title: data.title,
      description: data.metaDescription,
      h1: data.h1,
      directAnswer: data.directAnswer,
      faqs: data.faqs,
      primaryKeyword: data.primaryKeyword,
      heroAlt: data.heroAlt,
      related: data.related,
    }),
  };
}

interface DbRow {
  slug: string;
  name: string;
  seo_title: string | null;
  seo_description: string | null;
  service_overview: string | null;
  long_description: string | null;
  featured_image: string | null;
  faq_items: { question: string; answer: string }[] | null;
}

function fetchDbServices(): DbRow[] {
  const sql = `select json_agg(t) from (
    select slug, name, seo_title, seo_description, service_overview, long_description, featured_image,
           coalesce(faq_items,'[]'::jsonb) as faq_items
    from public.services where publish_state='published' order by slug
  ) t;`;
  const out = execSync(`psql -At -c "${sql.replace(/"/g, '\\"')}"`, { encoding: "utf8" }).trim();
  if (!out || out === "null") return [];
  return JSON.parse(out);
}

function auditDbPage(row: DbRow): PageReport {
  const directAnswer = row.service_overview ?? row.long_description ?? "";
  const faqs = Array.isArray(row.faq_items) ? row.faq_items : [];
  return {
    slug: row.slug,
    path: `/services/${row.slug}`,
    source: "db",
    title: row.seo_title ?? row.name,
    checks: auditCommon({
      title: row.seo_title ?? row.name,
      description: row.seo_description ?? "",
      h1: row.name,
      directAnswer,
      faqs,
      heroAlt: row.featured_image ? "(image set)" : "",
      related: undefined,
    }),
  };
}

function renderReport(reports: PageReport[]): string {
  const icon = (s: Status) => (s === "pass" ? "✅" : s === "warn" ? "⚠️" : "❌");
  const totals = { pass: 0, warn: 0, fail: 0 };
  reports.forEach((r) => r.checks.forEach((c) => totals[c.status]++));
  const cleanPages = reports.filter((r) => r.checks.every((c) => c.status === "pass")).length;
  const failingPages = reports.filter((r) => r.checks.some((c) => c.status === "fail")).length;
  const warningPages = reports.length - cleanPages - failingPages;

  const lines: string[] = [];
  lines.push(`# Service Pages — SEO/GEO Audit`);
  lines.push("");
  lines.push(`_Generated: ${new Date().toISOString()}_`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push(`- Pages audited: **${reports.length}**`);
  lines.push(`- ✅ Clean: ${cleanPages} · ⚠️ Warnings: ${warningPages} · ❌ Failing: ${failingPages}`);
  lines.push(`- Check totals — pass ${totals.pass} · warn ${totals.warn} · fail ${totals.fail}`);
  lines.push("");

  for (const r of reports) {
    const worst = r.checks.some((c) => c.status === "fail")
      ? "❌"
      : r.checks.some((c) => c.status === "warn")
        ? "⚠️"
        : "✅";
    lines.push(`## ${worst} ${r.path}  _(${r.source})_`);
    lines.push(`**${r.title}**`);
    lines.push("");
    lines.push(`| Check | Status | Detail |`);
    lines.push(`|---|---|---|`);
    for (const c of r.checks) {
      lines.push(`| ${c.name} | ${icon(c.status)} | ${c.detail ?? ""} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const reports: PageReport[] = [];

  for (const entry of SERVICE_REGISTRY.filter((e) => e.source === "static")) {
    const r = auditStaticPage(entry.slug);
    if (r) reports.push(r);
  }

  try {
    const dbRows = fetchDbServices();
    for (const row of dbRows) reports.push(auditDbPage(row));
  } catch (err) {
    console.error("DB fetch failed (psql env vars set?):", err);
  }

  mkdirSync("/mnt/documents", { recursive: true });
  const md = renderReport(reports);
  writeFileSync("/mnt/documents/service-seo-geo-audit.md", md);
  writeFileSync(
    "/mnt/documents/service-seo-geo-audit.json",
    JSON.stringify(reports, null, 2)
  );

  const fails = reports.reduce(
    (n, r) => n + r.checks.filter((c) => c.status === "fail").length,
    0
  );
  const warns = reports.reduce(
    (n, r) => n + r.checks.filter((c) => c.status === "warn").length,
    0
  );
  console.log(
    `Audited ${reports.length} pages → fail=${fails} warn=${warns}. ` +
      `Report: /mnt/documents/service-seo-geo-audit.md`
  );
}

main();

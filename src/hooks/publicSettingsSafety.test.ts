import { describe, expect, it } from "vitest";
import ts from "typescript";
import {
  PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS,
  PUBLIC_SITE_SETTINGS_COLUMNS,
} from "@/constants/siteSettingsColumns";

const sources = import.meta.glob(
  [
    "/src/pages/Contact.tsx",
    "/src/pages/company/CertificationsInsurance.tsx",
    "/src/hooks/useSiteSettings.ts",
    "/src/hooks/useCompanySettings.ts",
    "/src/components/Footer.tsx",
    "/src/components/shared/PhoneLink.tsx",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

// Parse call expressions rather than relying on a formatting-specific regexp.
const calls = (file: string) => {
  const tree = ts.createSourceFile(
    file,
    sources[`/${file}`],
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const result: ts.CallExpression[] = [];
  const walk = (node: ts.Node) => {
    if (ts.isCallExpression(node)) result.push(node);
    ts.forEachChild(node, walk);
  };
  walk(tree);
  return result;
};
describe("visitor-safe settings reads", () => {
  it.each([
    "src/pages/Contact.tsx",
    "src/pages/company/CertificationsInsurance.tsx",
    "src/hooks/useSiteSettings.ts",
    "src/hooks/useCompanySettings.ts",
  ])("requires an explicit visitor projection in %s", (file) => {
    const reads = calls(file).filter(
      (call) =>
        ts.isIdentifier(call.expression) &&
        ["useSettingsData", "fetchActiveSettingsRow"].includes(
          call.expression.text,
        ),
    );
    expect(reads.length).toBeGreaterThan(0);
    for (const read of reads) {
      expect(read.arguments.length).toBe(2);
      expect(read.arguments[1].getText()).not.toBe("'*'");
      expect(read.arguments[1].getText()).not.toBe('"*"');
    }
  });
  it("excludes restricted contact fields and preserves the canonical PhoneLink", () => {
    for (const columns of [
      PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS,
      PUBLIC_SITE_SETTINGS_COLUMNS,
    ]) {
      expect(columns).not.toContain("*");
      expect(columns.split(",").map((value) => value.trim())).not.toEqual(
        expect.arrayContaining(["phone", "email"]),
      );
    }
    for (const name of [
      "main_phone",
      "toll_free_phone",
      "general_email",
      "projects_email",
      "careers_email",
      "rfp_email",
    ])
      expect(PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS).not.toContain(name);
    const phone = sources["/src/components/shared/PhoneLink.tsx"];
    expect(phone).toContain("COMPANY_PHONE");
    expect(phone).not.toContain("supabase");
  });
  it("keeps footer reads explicit without dropping its configured navigation links", () => {
    const footer = sources["/src/components/Footer.tsx"];
    expect(footer).not.toMatch(
      /from\(['"](?:site_settings|footer_settings)['"]\)\.select\(['"]\*['"]\)/,
    );
    expect(footer).toContain("quick_links,sectors_links,trust_bar_items");
  });
});

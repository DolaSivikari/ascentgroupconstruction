import { describe, expect, it } from "vitest";

const sources = import.meta.glob(
  [
    "/src/components/admin/UnifiedSidebar.tsx",
    "/src/pages/admin/HomepageBuilder.tsx",
    "/src/pages/admin/ServicesManager.tsx",
    "/src/pages/admin/Settings.tsx",
    "/src/components/admin/InviteUserDialog.tsx",
    "/src/components/admin/ProjectEditorHeader.tsx",
    "/src/components/admin/project-tabs/SEOTab.tsx",
    "/src/pages/admin/Monitoring.tsx",
    "/src/pages/admin/HeroSlidesManager.tsx",
    "/src/pages/admin/ServiceEditor.tsx",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

describe("supported admin control registration", () => {
  it("does not expose unsupported sidebar destinations", () => {
    const sidebar = sources["/src/components/admin/UnifiedSidebar.tsx"];
    for (const path of [
      "email-templates",
      "testimonials",
      "navigation",
      "redirects",
      "content-versions",
    ])
      expect(sidebar).not.toContain(`to="/admin/${path}"`);
  });
  it("does not register unsupported editor tabs", () => {
    for (const [file, tabs] of [
      ["HomepageBuilder", ["overview"]],
      ["ServicesManager", ["featured", "promotions"]],
      ["Settings", ["security"]],
    ] as const) {
      for (const tab of tabs)
        expect(sources[`/src/pages/admin/${file}.tsx`]).not.toContain(
          `<TabsTrigger value="${tab}"`,
        );
    }
  });
  it("keeps only supported invite roles and removes the false password-change promise", () => {
    const invite = sources["/src/components/admin/InviteUserDialog.tsx"];
    for (const role of ["editor", "contributor", "viewer"])
      expect(invite).not.toContain(`<SelectItem value="${role}"`);
    expect(invite).not.toContain(
      "User will be prompted to change this on first login",
    );
  });
  it("uses the actual dashboard destination and clean admin label encoding", () => {
    expect(sources["/src/pages/admin/HeroSlidesManager.tsx"]).toContain(
      'backTo="/admin"',
    );
    for (const source of Object.values(sources))
      expect(source).not.toMatch(/[\uFFFD]|â€™|â€“|â€”|ðŸ|Ã©/);
  });
});

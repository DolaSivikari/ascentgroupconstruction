import { describe, expect, it } from "vitest";
import {
  completeSnapshots,
  blockedHost,
  forbiddenSource,
  inventory,
  metadataDifferences,
  pixelRatio,
  publicBackendRead,
  type Snapshot,
} from "./policy";
const sample: Snapshot = {
  path: "/contact",
  width: 390,
  status: 200,
  finalPath: "/contact",
  visibleText: "Office hours",
  title: "Contact",
  h1: ["Contact"],
  canonical: "https://example.test/contact",
  jsonLdHash: "hash",
  screenshot: "image.png",
  pageErrors: [],
  consoleErrors: [],
  scripts: [],
};
describe("baseline read-only policy and comparison", () => {
  it("requires exactly one capture at each agreed width for every unique path", () => {
    const pages = [{ ...sample, width: 1440 }, sample];
    expect(completeSnapshots(["/contact"], pages)).toBe(true);
    expect(completeSnapshots(["/contact"], pages.slice(1))).toBe(false);
    expect(completeSnapshots(["/contact"], [sample, sample])).toBe(false);
    expect(
      completeSnapshots(["/contact"], [sample, { ...sample, width: 600 }]),
    ).toBe(false);
    expect(
      completeSnapshots(["/contact", "/contact"], [...pages, ...pages]),
    ).toBe(false);
  });
  it("deduplicates real URLs and excludes private, utility and unresolved routes", () => {
    expect(
      inventory(
        ["https://example.test/contact"],
        [
          "/contact",
          "/admin/settings",
          "/tekev",
          "/404",
          "/unsubscribe",
          "/projects/:slug",
          "/case-studies",
        ],
        "https://example.test",
      ),
    ).toEqual(["/case-studies", "/contact"]);
    expect(() =>
      inventory(["https://other.test/"], [], "https://example.test"),
    ).toThrow("another origin");
  });
  it("never permits submissions, RPCs, private tables or signed storage", () => {
    expect(
      publicBackendRead(
        new URL("https://fixture.supabase.co/rest/v1/projects"),
        "GET",
      ),
    ).toBe(true);
    for (const method of ["POST", "PATCH", "DELETE", "PUT"])
      expect(
        publicBackendRead(
          new URL("https://fixture.supabase.co/rest/v1/projects"),
          method,
        ),
      ).toBe(false);
    for (const path of [
      "/rest/v1/contact_submissions",
      "/rest/v1/user_roles",
      "/rest/v1/rpc/get_preview_project",
      "/functions/v1/submit-form",
      "/storage/v1/object/sign/private/file.pdf",
    ])
      expect(
        publicBackendRead(new URL("https://fixture.supabase.co" + path), "GET"),
      ).toBe(false);
  });
  it("blocks analytics, maps and geolocation without blocking fonts", () => {
    expect(blockedHost(new URL("https://ipapi.co/json"))).toBe(true);
    expect(blockedHost(new URL("https://maps.googleapis.com/maps/api"))).toBe(
      true,
    );
    expect(
      blockedHost(new URL("https://www.google-analytics.com/collect")),
    ).toBe(true);
    expect(blockedHost(new URL("https://fonts.gstatic.com/font.woff2"))).toBe(
      false,
    );
  });
  it("fails exact text, metadata, missing schema and new errors while retaining known errors", () => {
    expect(metadataDifferences(sample, { ...sample })).toEqual([]);
    expect(
      metadataDifferences(sample, {
        ...sample,
        visibleText: "Changed hours",
        jsonLdHash: "changed",
        pageErrors: ["Crash"],
      }),
    ).toEqual(["visibleText", "jsonLdHash", "pageErrors"]);
    expect(
      metadataDifferences({ ...sample, pageErrors: ["Known error"] }, sample),
    ).toEqual([]);
  });
  it("measures changed pixels per page, includes alpha and detects dimension changes", () => {
    const image = { width: 10, height: 10, data: new Uint8Array(400) };
    expect(pixelRatio(image, image)).toBe(0);
    const changed = image.data.slice();
    changed[0] = 1;
    expect(pixelRatio(image, { ...image, data: changed })).toBe(0.01);
    const alpha = image.data.slice();
    alpha[3] = 1;
    expect(pixelRatio(image, { ...image, data: alpha })).toBe(0.01);
    expect(pixelRatio(image, { ...image, width: 5 })).toBe(1);
    expect(() =>
      pixelRatio(image, { ...image, data: new Uint8Array(1) }),
    ).toThrow("Invalid PNG");
  });
  it("rejects admin libraries from loaded public chunks on all supported path formats", () => {
    for (const source of [
      "../../node_modules/@tiptap/react/index.js",
      "../../node_modules/recharts/es6/index.js",
      "C:\\node_modules\\chart.js\\index.js",
    ])
      expect(forbiddenSource(source)).toBe(true);
    expect(forbiddenSource("../../node_modules/react/index.js")).toBe(false);
  });
});

import { Suspense, type ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppRoutes } from "./AppRoutes";

vi.mock("@/pages/Index", () => ({ default: () => <p>Public home</p> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <p>Missing page</p> }));
vi.mock("@/components/animations/PageTransition", () => ({ PageTransition: ({ children }: { children: ReactNode }) => <>{children}</> }));
// These tests exercise destinations only; real authorization has separate tests.
vi.mock("@/components/admin/UnifiedAdminLayout", () => ({ UnifiedAdminLayout: () => <Outlet /> }));
const Destination = () => {
  const location = useLocation();
  return <output data-testid="destination">{JSON.stringify({
    pathname: location.pathname,
    params: [...new URLSearchParams(location.search).entries()],
    hash: location.hash,
  })}</output>;
};
vi.mock("@/pages/admin/UnifiedInbox", () => ({ default: () => <Destination /> }));
vi.mock("@/pages/admin/SEODashboard", () => ({ default: () => <Destination /> }));
const renderRoute = (url: string) => render(
  <MemoryRouter initialEntries={[url]}><Suspense fallback={<p>Loading route</p>}><AppRoutes /></Suspense></MemoryRouter>,
);
const destination = async (): Promise<{ pathname: string; params: string[][]; hash: string }> =>
  JSON.parse((await screen.findByTestId("destination")).textContent ?? "{}");
afterEach(cleanup);

describe("legacy admin inquiry destinations", () => {
  it.each([
    ["contacts", "contact"],
    ["resumes", "resume"],
    ["prequalifications", "prequal"],
    ["rfp", "rfp"],
    ["rfp-submissions", "rfp"],
    ["newsletter-subscribers", "newsletter"],
    ["quote-requests", "quote"],
  ])("moves /admin/%s to its corresponding inbox tab without losing a bookmarked reference", async (path, tab) => {
    renderRoute(`/admin/${path}?highlight=lead-1&status=new&label=a&label=b#reference`);
    const result = await destination();
    expect(result.pathname).toBe("/admin/inbox");
    expect(result.hash).toBe("#reference");
    expect(new URLSearchParams(result.params).get("tab")).toBe(tab);
    expect(result.params).toEqual(expect.arrayContaining([
      ["highlight", "lead-1"], ["status", "new"], ["label", "a"], ["label", "b"],
    ]));
  });

  it("translates a legacy selected id while retaining the original id parameter", async () => {
    renderRoute("/admin/quote-requests?id=selected-lead&tab=contact&search=Envelope%20repair");
    const params = new URLSearchParams((await destination()).params);
    expect(params.get("tab")).toBe("quote");
    expect(params.get("id")).toBe("selected-lead");
    expect(params.get("highlight")).toBe("selected-lead");
    expect(params.get("search")).toBe("Envelope repair");
  });

  it("honours an explicit highlight rather than replacing it with an unrelated id", async () => {
    renderRoute("/admin/rfp?id=old-lead&highlight=current-lead");
    const params = new URLSearchParams((await destination()).params);
    expect(params.get("id")).toBe("old-lead");
    expect(params.get("highlight")).toBe("current-lead");
  });

  it("retains an existing tab and reference on the legacy notifications link", async () => {
    renderRoute("/admin/notifications?tab=resume&id=application-1#application");
    const result = await destination();
    expect(result.pathname).toBe("/admin/inbox");
    expect(result.hash).toBe("#application");
    expect(new URLSearchParams(result.params).get("tab")).toBe("resume");
    expect(new URLSearchParams(result.params).get("highlight")).toBe("application-1");
  });

  it("routes legacy stats to the supported SEO dashboard", async () => {
    renderRoute("/admin/stats");
    expect((await destination()).pathname).toBe("/admin/seo-dashboard");
  });
});

describe("unavailable admin feature routes", () => {
  it.each(["navigation", "navigation-builder"])("explains /admin/%s is code managed without presenting a live menu editor", async path => {
    renderRoute(`/admin/${path}`);
    expect(await screen.findByRole("heading", { name: "Navigation management", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/A menu editor is not connected to the live navigation/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View website" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Site settings" })).toHaveAttribute("href", "/admin/settings");
    expect(screen.queryByRole("button", { name: /save|publish/i })).not.toBeInTheDocument();
  });

  it("explains redirects are code managed and provides a supported SEO destination", async () => {
    renderRoute("/admin/redirects");
    expect(await screen.findByRole("heading", { name: "URL redirects", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/A redirect editor is not connected to the live website/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "SEO dashboard" })).toHaveAttribute("href", "/admin/seo-dashboard");
  });

  it("does not promise a working version restore and links to actual content editors", async () => {
    renderRoute("/admin/content-versions");
    expect(await screen.findByRole("heading", { name: "Content version history", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Version restore is not available in this admin panel.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/admin/projects");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/admin/services-manager");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("href", "/admin/blog");
    expect(screen.queryByRole("button", { name: /restore/i })).not.toBeInTheDocument();
  });
});

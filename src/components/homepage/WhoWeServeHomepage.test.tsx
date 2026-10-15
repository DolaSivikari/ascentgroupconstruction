import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { DeferredBoundary } from "@/components/DeferredBoundary";
import WhoWeServeHomepage from "./WhoWeServeHomepage";
import { defaults } from "@/content/pages/home-audiences";

const content = vi.hoisted(() => ({ overrides: {} as Record<string, string> }));
vi.mock("@/hooks/usePageContent", () => ({
  usePageContent: () => ({ ...defaults, ...content.overrides }),
}));
vi.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: () => true }));
vi.mock("@/hooks/useScrollFadeIn", () => ({
  useScrollFadeIn: () => ({
    ref: { current: null },
    isVisible: true,
    skipAnimation: true,
  }),
}));
vi.mock("@/components/sections/Section", () => ({
  Section: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  ),
}));
vi.mock("@/utils/errorLogger", () => ({ logError: vi.fn() }));

afterEach(() => {
  cleanup();
  content.overrides = {};
  vi.restoreAllMocks();
});
const renderSection = () =>
  render(
    <MemoryRouter>
      <DeferredBoundary name="Who we serve">
        <WhoWeServeHomepage />
      </DeferredBoundary>
    </MemoryRouter>,
  );

describe("homepage audience section after carousel integration", () => {
  it("renders all four audience cards through the actual section error boundary", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderSection();
    expect(
      screen.queryByText("Who we serve could not load."),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: defaults.f023 })).toBeVisible();
    for (const [title, description, href] of [
      [defaults.f032, defaults.f033, "/for-general-contractors"],
      [defaults.f037, defaults.f038, "/property-managers"],
      [defaults.f042, defaults.f043, "/commercial-clients"],
      [defaults.f047, defaults.f048, "/homeowners"],
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(
        screen.getByRole("link", { name: new RegExp(title) }),
      ).toHaveAttribute("href", href);
    }
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(
      screen.queryByRole("heading", { name: defaults.f002 }),
    ).not.toBeInTheDocument();
  });

  it("continues to render saved audience labels and descriptions", () => {
    content.overrides = {
      f023: "Our audiences",
      f032: "Saved contractor label",
      f033: "Saved audience description",
    };
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderSection();
    expect(
      screen.getByRole("heading", { name: "Our audiences" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Saved contractor label/ }),
    ).toHaveAttribute("href", "/for-general-contractors");
    expect(screen.getByText("Saved audience description")).toBeVisible();
  });
});

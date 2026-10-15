import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaults } from "@/content/pages/home-final-cta";
import { HomepageFinalCta } from "./HomepageFinalCta";

const content = vi.hoisted(() => ({ overrides: {} as Record<string, string> }));
vi.mock("@/hooks/usePageContent", () => ({
  usePageContent: () => ({ ...defaults, ...content.overrides }),
}));
afterEach(() => {
  cleanup();
  content.overrides = {};
});
const renderSection = () =>
  render(
    <MemoryRouter>
      <HomepageFinalCta />
    </MemoryRouter>,
  );

describe("homepage secondary contact paths", () => {
  it("renders three descriptive native links in the original destination order", () => {
    renderSection();
    const section = screen.getByRole("region", { name: defaults.f001 });
    expect(within(section).getAllByRole("heading", { level: 2 })).toHaveLength(
      1,
    );
    expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(
      3,
    );
    const links = within(section).getAllByRole("link");
    expect(links).toHaveLength(3);
    for (const [index, [name, href]] of [
      [defaults.f009, "/contact"],
      [defaults.f010, "/projects"],
      [defaults.f011, "/prequalification"],
    ].entries()) {
      expect(links[index]).toHaveAccessibleName(name);
      expect(links[index]).toHaveAttribute("href", href);
    }
    expect(within(section).queryByRole("button")).not.toBeInTheDocument();
  });

  it("continues rendering every original content field", () => {
    renderSection();
    for (const key of [
      "f001",
      "f002",
      "f003",
      "f004",
      "f005",
      "f006",
      "f007",
      "f008",
    ] as const) {
      expect(screen.getByText(defaults[key])).toBeVisible();
    }
  });

  it("preserves saved headings, path titles and the new editable labels", () => {
    content.overrides = {
      f001: "Saved heading",
      f003: "Saved proposal path",
      f009: "Saved contact label",
    };
    renderSection();
    expect(
      screen.getByRole("heading", { level: 2, name: "Saved heading" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: "Saved proposal path" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Saved contact label" }),
    ).toHaveAttribute("href", "/contact");
    expect(screen.queryByText(defaults.f001)).not.toBeInTheDocument();
  });
});

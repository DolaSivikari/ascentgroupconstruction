import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Wrench } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageHero } from "./PageHero";
import { generatedHeroScenes } from "@/data/hero-scenes";

const saved = vi.hoisted(() => ({ url: "", alt: "" }));
vi.mock("@/lib/content/pageSettings", () => ({
  usePageSettings: () => ({ hero: saved }),
}));
beforeEach(() => {
  saved.url = "";
  saved.alt = "";
});
afterEach(cleanup);
const show = (props: Parameters<typeof PageHero>[0]) =>
  render(
    <MemoryRouter>
      <PageHero {...props} />
    </MemoryRouter>,
  );

describe("shared header content and actions", () => {
  it("preserves one copy of each supporting fact outside the image surface, with accessible labels", () => {
    const { container } = show({
      title: "About our team",
      description: "Accountable specialty trades.",
      image: generatedHeroScenes.about.image,
      stats: [
        { value: "15+", label: "Years Experience" },
        { value: "$2M", label: "CGL Coverage" },
      ],
      badges: [{ icon: Wrench, text: "Self-performed work" }],
      primaryCta: { text: "Start a Project", href: "/submit-rfp" },
      secondaryCta: { text: "Contact", href: "/contact" },
    });
    const support = container.querySelector(
      "[data-page-hero-support]",
    ) as HTMLElement;
    const surface = container.querySelector("[data-page-hero-visual]")!;
    for (const text of [
      "15+",
      "Years Experience",
      "$2M",
      "CGL Coverage",
      "Self-performed work",
    ]) {
      expect(screen.getAllByText(text)).toHaveLength(1);
      expect(within(support).getByText(text)).toBeInTheDocument();
    }
    expect(surface.contains(support)).toBe(false);
    expect(container.querySelectorAll("[data-hero-primary]")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Start a Project" }),
    ).toHaveAttribute("href", "/submit-rfp");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About our team",
    );
  });

  it("keeps in-page actions as native anchors and marks only the current breadcrumb", () => {
    show({
      title: "Construction technology",
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Company", href: "/about" },
        { label: "Technology" },
      ],
      primaryCta: { text: "Explore models", href: "#models" },
      secondaryCta: { text: "Try workflow", href: "#workflow" },
    });
    expect(
      screen.getByRole("link", { name: "Explore models" }),
    ).toHaveAttribute("href", "#models");
    expect(screen.getByRole("link", { name: "Try workflow" })).toHaveAttribute(
      "href",
      "#workflow",
    );
    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(trail.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(within(trail).getByText("Technology")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(trail).getByRole("link", { name: "Company" }),
    ).toHaveAttribute("href", "/about");
  });

  it("does not invent a primary action or a facts panel on article headers", () => {
    const { container } = show({
      title: "Preparing for envelope restoration",
      subtitle: "Article · 5 min read",
      image: generatedHeroScenes["article-envelope-preparation"].image,
    });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container.querySelector("[data-page-hero-support]")).toBeNull();
    expect(container.querySelector("[data-hero-primary]")).toBeNull();
    expect(screen.getByText("Article · 5 min read")).toBeInTheDocument();
  });

  it("retains a saved editor image and restores the page image with accurate disclosure if it fails", () => {
    saved.url = "https://storage.example/editor-photo.jpg";
    saved.alt = "Owner-selected building photo";
    const scene = generatedHeroScenes["waterproofing-systems"];
    show({
      title: "Waterproofing systems",
      image: scene.image,
      imageAlt: "Original header",
    });
    const initial = screen.getByRole("img", { name: saved.alt });
    expect(initial).toHaveAttribute("src", saved.url);
    fireEvent.error(initial);
    const fallback = screen.getByRole("img", { name: scene.alt });
    expect(fallback).toHaveAttribute("src", scene.image);
    fireEvent.load(fallback);
    expect(
      screen.getByText("Illustrative construction scene"),
    ).toBeInTheDocument();
  });
});

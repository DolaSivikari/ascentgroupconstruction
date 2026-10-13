import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroScrollFrame } from "./HeroScrollFrame";
import { computePin, heroScrollValues, HERO_SCROLL_QUERY } from "./heroScrollPin";

const originalMatchMedia = window.matchMedia;

function mockMedia(matching: string[]) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: matching.includes(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
});

const Hero = () => (
  <section aria-label="Hero slideshow">
    <div data-hero-content="">
      <h1>We Restore, Repair &amp; Protect Buildings Across the GTA</h1>
      <a href="/contact">Request a Proposal</a>
    </div>
  </section>
);

describe("computePin", () => {
  it("is 'before' while the pin is below the top of the viewport", () => {
    expect(computePin(120, 1350, 900)).toEqual({ state: "before", progress: 0 });
  });
  it("pins and reports progress through the half-screen of scroll", () => {
    expect(computePin(-225, 1350, 900)).toEqual({ state: "pinned", progress: 0.5 });
  });
  it("releases ('after') once the scroll distance is used up", () => {
    expect(computePin(-450, 1350, 900)).toEqual({ state: "after", progress: 1 });
    expect(computePin(-2000, 1350, 900).state).toBe("after");
  });
});

describe("heroScrollValues", () => {
  it("starts with the untouched hero", () => {
    expect(heroScrollValues(0)).toEqual({ frame: 0, content: 1, lift: -0, cue: 1, statement: 0 });
  });
  it("ends with the framed video and the full statement", () => {
    const end = heroScrollValues(1);
    expect(end.frame).toBe(1);
    expect(end.content).toBe(0);
    expect(end.statement).toBe(1);
  });
  it("hides the slide copy before the statement appears", () => {
    const mid = heroScrollValues(0.4);
    expect(mid.content).toBe(0);
    expect(mid.statement).toBe(0);
    expect(heroScrollValues(0.6).statement).toBeCloseTo(0.5);
  });
  it("clamps out-of-range progress", () => {
    expect(heroScrollValues(-1)).toEqual(heroScrollValues(0));
    expect(heroScrollValues(2)).toEqual(heroScrollValues(1));
  });
});

describe("HeroScrollFrame", () => {
  it("renders the hero and a static statement on phones and tablets", () => {
    mockMedia([]);
    const { container } = render(
      <HeroScrollFrame>
        <Hero />
      </HeroScrollFrame>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Built to be documented" })).toBeInTheDocument();
    expect(container.querySelector("[data-hero-scroll]")).toBeNull();
    expect(container.querySelector(".hsf-static")).not.toBeNull();
  });

  it("pins the hero on desktop", () => {
    mockMedia([HERO_SCROLL_QUERY]);
    const { container } = render(
      <HeroScrollFrame>
        <Hero />
      </HeroScrollFrame>,
    );
    const stage = container.querySelector(".hsf-stage") as HTMLElement;
    expect(container.querySelector("[data-hero-scroll]")).not.toBeNull();
    expect(stage.dataset.state).toBe("before");
    expect(stage.style.getPropertyValue("--hsf-statement")).toBe("0.0000");
    expect(screen.getByRole("heading", { level: 2, name: "Built to be documented" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps the static layout when the visitor prefers reduced motion", () => {
    mockMedia([HERO_SCROLL_QUERY, "(prefers-reduced-motion: reduce)"]);
    const { container } = render(
      <HeroScrollFrame>
        <Hero />
      </HeroScrollFrame>,
    );
    expect(container.querySelector("[data-hero-scroll]")).toBeNull();
    expect(container.querySelector(".hsf-static")).not.toBeNull();
  });

  it("lists the three commitment points", () => {
    mockMedia([]);
    render(
      <HeroScrollFrame>
        <Hero />
      </HeroScrollFrame>,
    );
    expect(screen.getByText("Self-performed crews")).toBeInTheDocument();
    expect(screen.getByText("Daily field reports")).toBeInTheDocument();
    expect(screen.getByText("Closeout on every job")).toBeInTheDocument();
  });
});

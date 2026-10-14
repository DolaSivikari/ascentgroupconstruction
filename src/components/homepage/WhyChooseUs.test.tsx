import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BENEFIT_ROTATION_MS } from "./useBenefitCarousel";
import WhyChooseUs from "./WhyChooseUs";
import { defaults as clients } from "@/content/pages/home-audiences";
import { defaults as owners } from "@/content/pages/home-why-choose-us";
import {
  benefitSlides,
  clientBenefits,
  ownerBenefits,
} from "./whyChooseUsData";
import type { WhyChooseUsItem } from "@/hooks/useWhyChooseUs";

const state = vi.hoisted(() => ({
  reduced: false,
  width: 1440,
  saved: undefined as WhyChooseUsItem[] | undefined,
}));
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => state.reduced,
}));
vi.mock("@/hooks/useWhyChooseUs", () => ({
  useWhyChooseUs: () => ({ data: state.saved }),
}));
vi.mock("@/hooks/usePageContent", () => ({
  usePageContent: (module: { defaults: Record<string, string> }) =>
    module.defaults,
}));
vi.mock("@/utils/getIcon", () => ({
  getIcon: () => () => <svg aria-hidden="true" />,
}));
vi.mock("react-router-dom", () => ({
  Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
}));

let observe: IntersectionObserverCallback;
let breakpoints: Map<string, () => void>;
let documentHidden = false;
const selectGroup = () =>
  document.querySelector(
    '[data-why-carousel] [aria-roledescription="slide"][data-active="true"]',
  )!;
const show = (visible = true) =>
  act(() =>
    observe(
      [{ isIntersecting: visible } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
const advance = () => act(() => vi.advanceTimersByTime(BENEFIT_ROTATION_MS));

beforeEach(() => {
  state.reduced = false;
  state.width = 1440;
  state.saved = undefined;
  documentHidden = false;
  breakpoints = new Map();
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("1024") ? state.width >= 1024 : state.width >= 640,
    addEventListener: (_event: string, callback: () => void) =>
      breakpoints.set(query, callback),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observe = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(document, "hidden", "get").mockImplementation(() => documentHidden);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("unified Why Choose Us carousel", () => {
  it("supports horizontal swipes without intercepting vertical scrolling", () => {
    const { container } = render(<WhyChooseUs />);
    const stage = container.querySelector(".why-carousel-stage")!;
    const swipe = (x: number, y: number) => {
      fireEvent.touchStart(stage, {
        touches: [{ clientX: 200, clientY: 200 }],
      });
      fireEvent.touchEnd(stage, {
        changedTouches: [{ clientX: x, clientY: y }],
      });
    };
    swipe(180, 100);
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    swipe(100, 190);
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 2 of 5`,
    );
    swipe(300, 190);
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
  });
  it("keeps all 13 original benefits once and balances desktop groups", () => {
    const { container } = render(<WhyChooseUs />);
    expect(container.querySelectorAll("[data-benefit-id]")).toHaveLength(13);
    expect(
      container.querySelectorAll('[aria-roledescription="slide"]'),
    ).toHaveLength(5);
    expect(selectGroup().querySelectorAll("article")).toHaveLength(3);
    const slides = benefitSlides(
      clientBenefits(clients),
      ownerBenefits(owners),
      3,
    );
    expect(slides.map((slide) => slide.items.length)).toEqual([3, 2, 2, 3, 3]);
    expect(
      slides.flatMap((slide) => slide.items).map((item) => item.id),
    ).toHaveLength(13);
    expect(screen.getByRole("heading", { name: clients.f002 })).toBeVisible();
    const inactive = container.querySelector(
      '[aria-roledescription="slide"][data-active="false"]',
    );
    expect(inactive).toHaveAttribute("aria-hidden", "true");
    expect(inactive).toHaveAttribute("inert");
  });

  it("rotates only in view and cycles smoothly between audiences", () => {
    render(<WhyChooseUs />);
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    show();
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 2 of 5`,
    );
    advance();
    advance();
    expect(screen.getByRole("heading", { name: owners.f001 })).toBeVisible();
    advance();
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    show(false);
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
  });

  it("pauses on hover, tab hiding and expanded reading", () => {
    render(<WhyChooseUs />);
    show();
    const region = screen.getByRole("region");
    fireEvent.mouseEnter(region);
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    fireEvent.mouseLeave(region);
    documentHidden = true;
    fireEvent(document, new Event("visibilitychange"));
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    documentHidden = false;
    fireEvent(document, new Event("visibilitychange"));
    const details = region.querySelector("details")!;
    details.open = true;
    fireEvent(details, new Event("toggle"));
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    details.open = false;
    fireEvent(details, new Event("toggle"));
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 2 of 5`,
    );
  });

  it("supports direct audience selection, arrows, wraparound and manual pause", () => {
    render(<WhyChooseUs />);
    show();
    fireEvent.click(screen.getByRole("button", { name: "Property owners" }));
    expect(screen.getByRole("heading", { name: owners.f001 })).toBeVisible();
    expect(screen.getByRole("link", { name: owners.f007 })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: owners.f006 })).toHaveAttribute(
      "href",
      "/contact",
    );
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${owners.f001}, 4 of 5`,
    );
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${owners.f001}, 5 of 5`,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next benefits" }));
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous benefits" }));
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${owners.f001}, 5 of 5`,
    );
  });

  it("keeps rotation controls predictable when they receive focus", () => {
    render(<WhyChooseUs />);
    show();
    const pause = screen.getByRole("button", {
      name: "Pause automatic benefit rotation",
    });
    fireEvent.focus(pause);
    fireEvent.click(pause);
    expect(
      screen.getByRole("button", { name: "Start automatic benefit rotation" }),
    ).toBeEnabled();
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Start automatic benefit rotation" }),
    );
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 2 of 5`,
    );
  });

  it("shows one card on phones and safely resets pagination on resize", () => {
    state.width = 390;
    const { container } = render(<WhyChooseUs />);
    expect(
      container.querySelectorAll('[aria-roledescription="slide"]'),
    ).toHaveLength(13);
    expect(selectGroup().querySelectorAll("article")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Property owners" }));
    state.width = 1440;
    act(() => breakpoints.get("(min-width: 1024px)")?.());
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
  });

  it("uses saved owner benefits instead of appending fallback claims", () => {
    state.saved = [
      {
        id: "saved",
        title: "Saved benefit",
        description: "Saved description",
        icon_name: "Shield",
        stats_badge: "Saved badge",
        display_order: 1,
      },
    ];
    const { container } = render(<WhyChooseUs />);
    expect(container.querySelectorAll("[data-benefit-id]")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: "Property owners" }));
    expect(
      screen.getByRole("heading", { name: "Saved benefit" }),
    ).toBeVisible();
    expect(screen.getByText("Saved description")).toBeVisible();
    expect(screen.queryByText("$2M CGL Insured")).not.toBeInTheDocument();
  });

  it("disables automatic motion but keeps all content reachable for reduced motion", () => {
    state.reduced = true;
    render(<WhyChooseUs />);
    show();
    advance();
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 1 of 5`,
    );
    expect(
      screen.queryByRole("button", { name: /automatic benefit rotation/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next benefits" }));
    expect(selectGroup()).toHaveAttribute(
      "aria-label",
      `${clients.f002}, 2 of 5`,
    );
  });
});

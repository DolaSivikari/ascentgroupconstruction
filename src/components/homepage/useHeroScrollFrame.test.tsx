import { useRef } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHeroScrollFrame } from "./useHeroScrollFrame";

let top = 0;
let heroHeight = 1000;
let reduced = false;
let supported = true;
let resized: (() => void) | undefined;
let observer: { disconnect: ReturnType<typeof vi.fn> };
let frames: Map<number, FrameRequestCallback>;
let nextFrame = 0;

function Harness({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  useHeroScrollFrame(wrapper, hero, reducedMotion);
  return (
    <div ref={wrapper} data-testid="wrapper">
      <section ref={hero}>
        <video src="/unchanged.mp4" />
        <h1>Existing headline</h1>
        <button>Existing action</button>
      </section>
    </div>
  );
}

function flush() {
  act(() => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(0));
  });
}

beforeEach(() => {
  top = 0;
  heroHeight = 1000;
  reduced = false;
  supported = true;
  resized = undefined;
  nextFrame = 0;
  frames = new Map();
  vi.stubGlobal("innerHeight", 1000);
  vi.stubGlobal("CSS", { supports: () => supported });
  vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resized = callback;
        observer = { disconnect: this.disconnect };
      }
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function () {
      return {
        top: this.tagName === "SECTION" ? 0 : top,
        height: heroHeight,
      } as DOMRect;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("homepage scroll frame", () => {
  it("starts full bleed, advances and reverses without replacing media or content", () => {
    const { getByTestId, getByRole, container } = render(<Harness />);
    const wrapper = getByTestId("wrapper");
    const video = container.querySelector("video");
    flush();
    expect(wrapper.dataset.frameMode).toBe("pinned");
    expect(wrapper.style.getPropertyValue("--hero-frame-distance")).toBe(
      "500px",
    );
    expect(wrapper.style.getPropertyValue("--hero-frame-progress")).toBe(
      "0.0000",
    );
    top = -250;
    window.dispatchEvent(new Event("scroll"));
    flush();
    expect(wrapper.style.getPropertyValue("--hero-frame-progress")).toBe(
      "0.7500",
    );
    expect(wrapper.dataset.framePosition).toBe("during");
    expect(wrapper.style.getPropertyValue("--hero-frame-offset")).toBe("250px");
    top = -750;
    window.dispatchEvent(new Event("scroll"));
    flush();
    expect(wrapper.style.getPropertyValue("--hero-frame-progress")).toBe(
      "1.0000",
    );
    expect(wrapper.dataset.framePosition).toBe("after");
    expect(wrapper.style.getPropertyValue("--hero-frame-offset")).toBe("500px");
    top = 100;
    window.dispatchEvent(new Event("scroll"));
    flush();
    expect(wrapper.style.getPropertyValue("--hero-frame-progress")).toBe(
      "0.0000",
    );
    expect(wrapper.dataset.framePosition).toBe("before");
    expect(container.querySelector("video")).toBe(video);
    expect(video?.getAttribute("src")).toBe("/unchanged.mp4");
    expect(getByRole("button", { name: "Existing action" })).toBeEnabled();
    expect(getByRole("heading").textContent).toBe("Existing headline");
  });

  it("coalesces repeated scroll events into one animation frame", () => {
    render(<Harness />);
    flush();
    for (let i = 0; i < 10; i++) window.dispatchEvent(new Event("scroll"));
    expect(frames.size).toBe(1);
  });

  it("keeps tall content in normal flow and reevaluates its size", () => {
    heroHeight = 1200;
    const { getByTestId } = render(<Harness />);
    const wrapper = getByTestId("wrapper");
    expect(wrapper.dataset.frameMode).toBe("flow");
    expect(wrapper.style.getPropertyValue("--hero-frame-distance")).toBe("0px");
    heroHeight = 950;
    act(() => resized?.());
    expect(wrapper.dataset.frameMode).toBe("pinned");
    vi.stubGlobal("innerHeight", 600);
    window.dispatchEvent(new Event("resize"));
    expect(wrapper.dataset.frameMode).toBe("flow");
  });

  it.each(["preference", "hook", "unsupported"])(
    "disables framing for %s",
    (mode) => {
      reduced = mode === "preference";
      supported = mode !== "unsupported";
      const { getByTestId } = render(
        <Harness reducedMotion={mode === "hook"} />,
      );
      expect(getByTestId("wrapper").dataset.frameMode).toBe("off");
      expect(frames.size).toBe(0);
    },
  );

  it("cleans up observers, queued frames and scroll listeners", () => {
    const { unmount, getByTestId } = render(<Harness />);
    const wrapper = getByTestId("wrapper");
    expect(frames.size).toBe(1);
    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    expect(wrapper.dataset.frameMode).toBe("off");
    window.dispatchEvent(new Event("scroll"));
    expect(frames.size).toBe(0);
  });

  it("removes extra scroll distance when reduced motion is switched on", () => {
    const { rerender, getByTestId } = render(<Harness />);
    flush();
    rerender(<Harness reducedMotion />);
    expect(getByTestId("wrapper").dataset.frameMode).toBe("off");
    expect(
      getByTestId("wrapper").style.getPropertyValue("--hero-frame-distance"),
    ).toBe("");
  });
});

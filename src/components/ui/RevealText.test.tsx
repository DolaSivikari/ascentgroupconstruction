import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { RevealText } from "./RevealText";
vi.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: () => false }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("keeps an animated heading readable to assistive technology", () => {
  const observe = vi.fn();
  vi.stubGlobal("IntersectionObserver", class {
    observe = observe;
    unobserve = vi.fn();
    disconnect = vi.fn();
  });
  render(<h2><RevealText>Restore and protect your building</RevealText></h2>);
  expect(screen.getByRole("heading", { name: "Restore and protect your building" })).toBeTruthy();
  expect(document.querySelector("[aria-label]")).toBeNull();
});

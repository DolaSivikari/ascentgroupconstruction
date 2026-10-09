import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import ScrollToTop from "./ScrollToTop";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("finds encoded fragment ids containing CSS selector characters", () => {
  const scroll = vi.fn();
  const target = document.createElement("section");
  target.id = "scope: exterior";
  target.scrollIntoView = scroll;
  document.body.append(target);
  render(
    <MemoryRouter initialEntries={["/services#scope%3A%20exterior"]}>
      <ScrollToTop />
    </MemoryRouter>,
  );
  expect(scroll).toHaveBeenCalledWith({ behavior: "smooth" });
  target.remove();
});
it("keeps malformed fragments harmless and respects reduced motion", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList);
  const scroll = vi.fn();
  const target = document.createElement("section");
  target.id = "%not-valid[";
  target.scrollIntoView = scroll;
  document.body.append(target);
  expect(() =>
    render(
      <MemoryRouter initialEntries={["/services#%not-valid["]}>
        <ScrollToTop />
      </MemoryRouter>,
    ),
  ).not.toThrow();
  expect(scroll).toHaveBeenCalledWith({ behavior: "auto" });
  target.remove();
});

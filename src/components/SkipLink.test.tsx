import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import SkipLink from "./SkipLink";
afterEach(cleanup);
it("moves keyboard focus to the actual main landmark when its id is absent", () => {
  render(
    <>
      <SkipLink />
      <nav>
        <a href="/">Home</a>
      </nav>
      <main>Content</main>
    </>,
  );
  const main = screen.getByRole("main");
  main.scrollIntoView = vi.fn();
  fireEvent.click(screen.getByRole("link", { name: "Skip to main content" }));
  expect(document.activeElement).toBe(main);
  expect(main.scrollIntoView).toHaveBeenCalledWith({
    behavior: "auto",
    block: "start",
  });
});
it("uses a heading on legacy pages without a main landmark", () => {
  render(
    <>
      <SkipLink />
      <h1>Project details</h1>
    </>,
  );
  const heading = screen.getByRole("heading");
  heading.scrollIntoView = vi.fn();
  fireEvent.click(screen.getByRole("link", { name: "Skip to main content" }));
  expect(document.activeElement).toBe(heading);
});

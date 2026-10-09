import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Progress } from "./progress";
afterEach(cleanup);
it("exposes the displayed completion value to assistive technology", () => {
  const { rerender } = render(<Progress value={25} aria-label="Estimate request progress" />);
  const progress = screen.getByRole("progressbar", { name: "Estimate request progress" });
  expect(progress).toHaveAttribute("aria-valuenow", "25");expect(progress).toHaveAttribute("data-state", "loading");
  rerender(<Progress value={100} aria-label="Estimate request progress" />);
  expect(progress).toHaveAttribute("aria-valuenow", "100");expect(progress).toHaveAttribute("data-state", "complete");
});

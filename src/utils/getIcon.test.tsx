import { render, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { getIcon } from "./getIcon";
import { BadgeCheck } from "lucide-react";
it("keeps common navigation icons synchronous", () => {
  const Icon = getIcon("Building2")!;
  const view = render(<Icon />);
  expect(view.container.querySelector(".lucide-building-2")).not.toBeNull();
});
it("loads uncommon CMS icons and normalizes numeric names", async () => {
  const Icon = getIcon("Grid3X3")!;
  const view = render(<Icon />);
  await waitFor(() => expect(view.container.querySelector(".lucide-grid-3x3")).not.toBeNull());
});
it("preserves the caller's fallback for an invalid name", async () => {
  const Icon = getIcon("InvalidFixtureIcon", BadgeCheck)!;
  const view = render(<Icon />);
  await waitFor(() => expect(view.container.querySelector(".lucide-badge-check")).not.toBeNull());
  const Hidden = getIcon("InvalidFixtureIcon", null)!;
  const hidden = render(<Hidden />);
  await waitFor(() => expect(hidden.container.querySelector("svg")).toBeNull());
});

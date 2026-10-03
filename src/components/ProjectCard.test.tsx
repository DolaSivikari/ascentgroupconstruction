import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import ProjectCard from "./ProjectCard";

afterEach(cleanup);
const CurrentPath = () => <output data-testid="path">{useLocation().pathname}</output>;
it("offers a native project link while Quick View stays on the directory", () => {
  const quickView = vi.fn();
  render(<MemoryRouter initialEntries={["/projects"]}>
    <ProjectCard title="Envelope restoration" slug="envelope-restoration" category="Restoration"
      location="Toronto" year="2026" size="1000" image="" description="Restoration project" onQuickView={quickView} />
    <CurrentPath />
  </MemoryRouter>);
  const link = screen.getByRole("link", { name: "View project: Envelope restoration" });
  expect(link).toHaveAttribute("href", "/projects/envelope-restoration");
  const button = screen.getByRole("button", { name: "Quick view: Envelope restoration" });
  expect(button.closest("a")).toBeNull();
  fireEvent.click(button);
  expect(quickView).toHaveBeenCalledWith("envelope-restoration");
  expect(screen.getByTestId("path")).toHaveTextContent("/projects");
  fireEvent.click(link, { ctrlKey: true });
  expect(screen.getByTestId("path")).toHaveTextContent("/projects");
  fireEvent.click(link);
  expect(screen.getByTestId("path")).toHaveTextContent("/projects/envelope-restoration");
});

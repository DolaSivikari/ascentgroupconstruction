import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import NotFound from "./NotFound";

const mock = vi.hoisted(() => ({ read: vi.fn(), seo: vi.fn() }));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SEO", () => ({
  default: (props: unknown) => {
    mock.seo(props);
    return null;
  },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ limit: mock.read }) }) }),
  },
}));
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}
beforeEach(() => {
  vi.clearAllMocks();
  mock.read.mockResolvedValue({
    data: [{ slug: "existing-project", title: "Existing project" }],
  });
});
afterEach(cleanup);
function mount(
  entries: ({ pathname: string; state?: { from: string } } | string)[],
  index = entries.length - 1,
) {
  render(
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      <LocationProbe />
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/services" element={<p>Services</p>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  );
}
it("goes to the previous page rather than linking to the missing page again", () => {
  mount(["/services", "/missing"]);
  fireEvent.click(screen.getByRole("button", { name: "Go Back" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/services");
});
it("offers a working home destination for a direct visit without in-app history", () => {
  mount(["/missing"]);
  fireEvent.click(screen.getByRole("button", { name: "Go Back" }));
  expect(screen.getByTestId("location").textContent).toBe("/");
});
it("honors an explicitly supplied local return page", () => {
  mount([{ pathname: "/missing", state: { from: "/services" } }]);
  fireEvent.click(screen.getByRole("button", { name: "Go Back" }));
  expect(screen.getByTestId("location").textContent).toBe("/services");
});
it("does not navigate to an external return URL", () => {
  mount([{ pathname: "/missing", state: { from: "//external.example" } }]);
  fireEvent.click(screen.getByRole("button", { name: "Go Back" }));
  expect(screen.getByTestId("location").textContent).toBe("/");
});
it("suggests actual project URLs and keeps unknown project routes non-indexable", async () => {
  mount(["/projects/missing"]);
  expect(
    await screen.findByRole("link", { name: "Existing project" }),
  ).toHaveAttribute("href", "/projects/existing-project");
  expect(mock.seo).toHaveBeenCalledWith(
    expect.objectContaining({ noindex: true }),
  );
  expect(screen.getByTestId("location").textContent).toBe("/projects/missing");
});

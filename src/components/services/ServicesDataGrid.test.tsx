import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ServicesDataGrid } from "./ServicesDataGrid";
import { SERVICE_REGISTRY } from "@/data/service-registry";
import type { PropsWithChildren } from "react";
vi.mock("@/components/animations/ScrollReveal", () => ({ ScrollReveal: ({ children }: PropsWithChildren) => <>{children}</> }));
vi.mock("@/components/ui/RevealText", () => ({ RevealText: ({ children }: PropsWithChildren) => <>{children}</> }));
const mock = vi.hoisted(() => ({ isError: false, full: false }));
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    isLoading: false,
    isError: mock.isError,
    data: mock.full ? SERVICE_REGISTRY.filter(entry => entry.source === "db").map(entry => ({slug: entry.slug, name: entry.navLabel, category: entry.category, short_description: entry.navDescription})) : [
      {
        slug: "painting-services",
        name: "Painting Services",
        category: "Interior",
        short_description: "Painting for properties",
      },
      {
        slug: "tile-flooring",
        name: "Tile & Flooring",
        category: "Interior",
        short_description: "Tile and flooring options",
      },
    ],
  }),
}));
function Location() {
  const location = useLocation();
  return <span data-testid="location">{location.search}</span>;
}
function mount(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/services${search}`]}>
      <Location />
      <ServicesDataGrid />
    </MemoryRouter>,
  );
}
afterEach(() => {
  cleanup();
  mock.isError = false;
  mock.full = false;
});
it("honours linked searches and preserves unrelated duplicate tracking parameters", () => {
  mount("?search=tile&utm_source=linkedin&tag=a&tag=b");
  expect(
    screen.queryByRole("link", { name: /^Painting Services/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /^Tile & Flooring/ }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "painting" },
  });
  const params = new URLSearchParams(
    screen.getByTestId("location").textContent!,
  );
  expect(params.get("search")).toBe("painting");
  expect(params.getAll("tag")).toEqual(["a", "b"]);
  expect(params.get("utm_source")).toBe("linkedin");
  expect(
    screen.getByRole("link", { name: /Commercial Painting/ }),
  ).toHaveAttribute("href", "/services/commercial-painting-gta");
});
it("provides an empty state and clears the filter without dropping attribution", () => {
  mount("?search=doesnotexist&utm_source=linkedin");
  expect(screen.getByRole("status")).toHaveTextContent("0 services");
  fireEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(
    screen.getByRole("link", { name: /^Painting Services/ }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent(
    "?utm_source=linkedin",
  );
});
it("keeps static services usable and reports a failed directory read", () => {
  mock.isError = true;
  mount("");
  expect(
    screen.getByText(/Some service details could not be loaded/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Tile Installation/ }),
  ).toHaveAttribute("href", "/services/tile-installation-toronto");
});

it("retains every published destination and places painting specialties after their hub", () => {
  mock.full = true;
  const { container } = mount("");
  const links = Array.from(container.querySelectorAll("a")).map(link => link.getAttribute("href"));
  expect(new Set(links)).toEqual(new Set(SERVICE_REGISTRY.map(entry => `/services/${entry.slug}`)));
  expect(links.length).toBe(SERVICE_REGISTRY.length);
  expect(links.indexOf("/services/painting-services")).toBeLessThan(links.indexOf("/services/commercial-painting-gta"));
});

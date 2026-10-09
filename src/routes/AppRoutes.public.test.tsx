import { Suspense, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { AppRoutes } from "./AppRoutes";

vi.mock("@/pages/Index", () => ({ default: () => <p>Home</p> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <p>Not found</p> }));
vi.mock("@/pages/ServiceDetail", () => ({ default: () => <p>Service</p> }));
vi.mock("@/pages/Contact", () => ({ default: () => <p>Contact</p> }));
vi.mock("@/pages/Blog", () => ({ default: () => <p>Blog</p> }));
vi.mock("@/components/animations/PageTransition", () => ({
  PageTransition: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
function LocationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="location">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button onClick={() => navigate(-1)}>Previous</button>
    </>
  );
}
afterEach(cleanup);

it.each([
  ["/services/eifs-stucco", "/services/eifs-stucco-systems"],
  ["/services/building-envelope", "/services/building-envelope-solutions"],
  ["/services/painting", "/services/painting-services"],
  ["/free-quote", "/contact"],
  ["/get-estimate", "/contact"],
  ["/insights", "/blog"],
  ["/case-studies", "/blog"],
])(
  "preserves campaign attribution and anchors on %s",
  async (oldPath, canonical) => {
    const suffix = "?utm_source=linkedin&utm_campaign=summer&tag=a&tag=b#scope";
    render(
      <MemoryRouter initialEntries={["/", oldPath + suffix]} initialIndex={1}>
        <LocationProbe />
        <Suspense fallback={<p>Loading</p>}>
          <AppRoutes />
        </Suspense>
      </MemoryRouter>,
    );
    await screen.findByText(/^(Service|Contact|Blog)$/);
    expect(screen.getByTestId("location").textContent).toBe(canonical + suffix);
    // The alias is replaced, so Back never loops through the redirect again.
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByTestId("location").textContent).toBe("/");
  },
);

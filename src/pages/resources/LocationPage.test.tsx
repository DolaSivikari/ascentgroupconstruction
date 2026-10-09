import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LocationPage from "./LocationPage";

const mocks = vi.hoisted(() => ({
  city: "toronto",
  from: vi.fn(),
  ilike: vi.fn(),
  limit: vi.fn(),
}));
vi.mock("react-router-dom", async (original) => ({
  ...(await original<typeof import("react-router-dom")>()),
  useParams: () => ({ city: mocks.city }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: mocks.from },
}));
vi.mock("@/hooks/usePageContent", () => ({
  usePageContent: (module: { defaults: Record<string, string> }) =>
    module.defaults,
}));
vi.mock("@/hooks/usePageAnalytics", () => ({ usePageAnalytics: () => {} }));
vi.mock("@/hooks/useScrollReveal", () => ({
  useScrollReveal: () => ({ ref: null, isVisible: true }),
}));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SEO", () => ({ default: () => null }));
vi.mock("@/components/shared/PageHero", () => ({
  PageHero: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.city = "toronto";
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: mocks.ilike.mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: mocks.limit,
  };
  mocks.from.mockReturnValue(query);
  mocks.limit.mockResolvedValue({
    error: null,
    data: [
      { id: "project-1", title: "Related project", slug: "related-project" },
    ],
  });
});
afterEach(cleanup);

it("loads related projects once per city instead of reloading after every state update", async () => {
  const view = () => (
    <MemoryRouter>
      <LocationPage />
    </MemoryRouter>
  );
  const { rerender } = render(view());
  await screen.findByRole("link", { name: /Related project/ });
  expect(mocks.from).toHaveBeenCalledTimes(1);
  expect(mocks.ilike).toHaveBeenLastCalledWith("location", "%Toronto%");

  rerender(view());
  expect(mocks.from).toHaveBeenCalledTimes(1);

  mocks.city = "mississauga";
  rerender(view());
  await waitFor(() => expect(mocks.from).toHaveBeenCalledTimes(2));
  expect(mocks.ilike).toHaveBeenLastCalledWith("location", "%Mississauga%");
});

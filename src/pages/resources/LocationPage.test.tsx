import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import LocationPage from "./LocationPage";
import type { ContentModule } from "@/content/types";

const mock = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("@/hooks/usePageContent", () => ({
  usePageContent: (module: ContentModule) => module.defaults,
}));
vi.mock("@/hooks/usePageAnalytics", () => ({
  usePageAnalytics: () => undefined,
}));
vi.mock("@/hooks/useScrollReveal", () => ({
  useScrollReveal: () => ({ ref: null, isVisible: true, skipAnimation: true }),
}));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SEO", () => ({ default: () => null }));
vi.mock("@/components/shared/PageHero", () => ({
  PageHero: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      let city: string;
      const query = {
        select: () => query,
        eq: () => query,
        ilike: (_field: string, value: string) => {
          city = value;
          return query;
        },
        order: () => query,
        limit: () => mock.read(city),
      };
      return query;
    },
  },
}));
const project = (title: string) => ({
  id: title,
  title,
  slug: title.toLowerCase().replace(/ /g, "-"),
  summary: "Fixture",
  location: "Fixture location",
  featured_image: null,
  category: "Restoration",
});
function Controls() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/service-areas/ajax")}>Change city</button>
  );
}
function mount() {
  return render(
    <MemoryRouter initialEntries={["/service-areas/toronto"]}>
      <Controls />
      <Routes>
        <Route path="/service-areas/:city" element={<LocationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
it("loads projects once instead of refetching when the result updates state", async () => {
  mock.read.mockResolvedValue({
    data: [project("Toronto project")],
    error: null,
  });
  mount();
  await screen.findByRole("link", { name: /Toronto project/ });
  expect(mock.read.mock.calls).toEqual([["%Toronto%"]]);
});
it("clears the previous city's projects while loading the next city", async () => {
  let finishAjax: (value: unknown) => void;
  mock.read.mockImplementation((city: string) =>
    city === "%Ajax%"
      ? new Promise((resolve) => {
          finishAjax = resolve;
        })
      : Promise.resolve({ data: [project("Toronto project")], error: null }),
  );
  mount();
  await screen.findByRole("link", { name: /Toronto project/ });
  fireEvent.click(screen.getByRole("button", { name: "Change city" }));
  await waitFor(() =>
    expect(
      screen.queryByRole("link", { name: /Toronto project/ }),
    ).not.toBeInTheDocument(),
  );
  await act(async () =>
    finishAjax({ data: [project("Ajax project")], error: null }),
  );
  await screen.findByRole("link", { name: /Ajax project/ });
  expect(mock.read.mock.calls).toEqual([["%Toronto%"], ["%Ajax%"]]);
});
it("ignores a late response from the previous city", async () => {
  let finishToronto: (value: unknown) => void;
  mock.read.mockImplementation((city: string) =>
    city === "%Toronto%"
      ? new Promise((resolve) => {
          finishToronto = resolve;
        })
      : Promise.resolve({ data: [project("Ajax project")], error: null }),
  );
  mount();
  await waitFor(() => expect(mock.read).toHaveBeenCalledWith("%Toronto%"));
  fireEvent.click(screen.getByRole("button", { name: "Change city" }));
  await screen.findByRole("link", { name: /Ajax project/ });
  await act(async () =>
    finishToronto({ data: [project("Toronto project")], error: null }),
  );
  expect(
    screen.queryByRole("link", { name: /Toronto project/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Ajax project/ }),
  ).toBeInTheDocument();
});

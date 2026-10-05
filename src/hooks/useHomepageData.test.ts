import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHeroSlides } from "./useHomepageData";
const mock = vi.hoisted(() => ({ response: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ order: mock.response }) }) }),
  },
}));
beforeEach(() => vi.clearAllMocks());
describe("homepage list contract", () => {
  it("returns an empty list for a null successful response", async () => {
    mock.response.mockResolvedValue({ data: null, error: null });
    expect(await fetchHeroSlides()).toEqual([]);
  });
  it("preserves returned slides", async () => {
    const rows = [{ id: "slide", headline: "Existing homepage text" }];
    mock.response.mockResolvedValue({ data: rows, error: null });
    expect(await fetchHeroSlides()).toBe(rows);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { invalidateHomepageQueries, saveHeroOrder } from "./homepageEditing";
const mock = vi.hoisted(() => ({
  write: vi.fn(),
  updates: [] as Array<{ id: string; order: number }>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      update: ({ display_order }: { display_order: number }) => ({
        eq: (_key: string, id: string) => ({
          select: () => ({
            single: () => {
              mock.updates.push({ id, order: display_order });
              return mock.write(id);
            },
          }),
        }),
      }),
    }),
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mock.updates = [];
  mock.write.mockResolvedValue({ data: { id: "slide" }, error: null });
});
describe("homepage order persistence and public cache", () => {
  it("checks every update and reports partial failure without abandoning the remaining slides", async () => {
    mock.write.mockImplementation(async (id) =>
      id === "second"
        ? { data: null, error: { code: "42501", message: "Denied" } }
        : { data: { id }, error: null },
    );
    await expect(
      saveHeroOrder([{ id: "first" }, { id: "second" }, { id: "third" }]),
    ).rejects.toThrow("2 of 3 updates saved");
    expect(mock.updates).toEqual([
      { id: "first", order: 1 },
      { id: "second", order: 2 },
      { id: "third", order: 3 },
    ]);
  });
  it("does not claim success for a zero-row order update", async () => {
    mock.write.mockResolvedValue({ data: null, error: null });
    await expect(saveHeroOrder([{ id: "missing" }])).rejects.toThrow(
      "0 of 1 updates saved",
    );
  });
  it("invalidates the documented keys and the actual Why Choose Us visitor key", () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    invalidateHomepageQueries(client);
    for (const key of ["hero-slides", "why-choose-us", "why-choose-us-public"])
      expect(invalidate).toHaveBeenCalledWith({ queryKey: [key] });
  });
});

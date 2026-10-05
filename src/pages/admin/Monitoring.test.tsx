import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import Monitoring from "./Monitoring";
vi.mock("@/components/admin/SiteHealthWorkspace", () => ({
  SiteHealthWorkspace: () => null,
}));
const mock = vi.hoisted(() => ({
  error: false,
  count: 0,
  cutoff: "",
  countProjection: null as unknown,
  rows: [] as Record<string, unknown>[],
}));
vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      let head = false;
      const query = {
        select: (_columns: string, options?: { head?: boolean }) => {
          head = !!options?.head;
          if (head) mock.countProjection = options;
          return query;
        },
        order: () => query,
        limit: () => query,
        gte: (_field: string, cutoff: string) => {
          mock.cutoff = cutoff;
          return query;
        },
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(
            mock.error
              ? { error: { code: "42501", message: "Denied" } }
              : {
                  error: null,
                  count: head ? mock.count : null,
                  data: table === "error_logs" ? mock.rows : [],
                },
          ).then(resolve),
      };
      return query;
    },
  },
}));
beforeEach(() => {
  mock.error = false;
  mock.count = 0;
  mock.rows = [];
});
afterEach(cleanup);
const open = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter>
        <Monitoring />
      </MemoryRouter>
    </QueryClientProvider>,
  );
describe("truthful monitoring", () => {
  it("uses a server count for the last 24 hours and shows reported errors", async () => {
    mock.count = 73;
    open();
    expect(await screen.findByText("Errors reported")).toBeInTheDocument();
    expect(screen.getByText("73")).toBeInTheDocument();
    expect(mock.countProjection).toEqual({ head: true, count: "exact" });
    expect(
      Math.abs(Date.parse(mock.cutoff) - (Date.now() - 24 * 60 * 60 * 1000)),
    ).toBeLessThan(5000);
    expect(screen.queryByText("Avg Load Time")).toBeNull();
    expect(screen.queryByText("0ms")).toBeNull();
    expect(screen.queryByText("Healthy")).toBeNull();
  });
  it("says no errors were reported only after a successful empty read", async () => {
    open();
    expect(
      await screen.findByText("No errors reported in 24 hours"),
    ).toBeInTheDocument();
  });
  it("shows failed reads as unavailable rather than zero or healthy", async () => {
    mock.error = true;
    open();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(1));
    expect(screen.getAllByText("Unavailable").length).toBe(3);
    expect(screen.queryByText("No errors logged")).toBeNull();
    expect(screen.queryByText("No errors reported in 24 hours")).toBeNull();
  });
});

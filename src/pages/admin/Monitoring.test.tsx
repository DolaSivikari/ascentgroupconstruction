import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
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
  rowCutoff: "",
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
      let rowCutoff = "";
      const query = {
        select: (_columns: string, options?: { head?: boolean }) => {
          head = !!options?.head;
          if (head) mock.countProjection = options;
          return query;
        },
        order: () => query,
        limit: () => query,
        gte: (_field: string, cutoff: string) => {
          if (head) mock.cutoff = cutoff;
          else {
            mock.rowCutoff = cutoff;
            rowCutoff = cutoff;
          }
          return query;
        },
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(
            mock.error
              ? { error: { code: "42501", message: "Denied" } }
              : {
                  error: null,
                  count: head ? mock.count : null,
                  data:
                    table === "error_logs"
                      ? mock.rows.filter(
                          (row) =>
                            !rowCutoff ||
                            Date.parse(String(row.created_at)) >=
                              Date.parse(rowCutoff),
                        )
                      : [],
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
  mock.rowCutoff = "";
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
  it("keeps older records accessible without presenting them as current failures", async () => {
    mock.rows = [
      {
        id: "old",
        message: "Old browser error",
        created_at: "2026-01-01T00:00:00Z",
        url: "/",
        user_agent: "Older browser",
        stack: "original.js:123",
        context: "{}",
      },
    ];
    open();
    await screen.findByText("No errors match the filter.");
    expect(screen.queryByText("Old browser error")).toBeNull();
    fireEvent.change(screen.getByLabelText("Recorded error period"), {
      target: { value: "all" },
    });
    expect(await screen.findByText("Old browser error")).toBeInTheDocument();
    expect(
      screen.getByText("Last recorded more than 24 hours ago."),
    ).toBeInTheDocument();
    expect(screen.getByText("original.js:123")).toBeInTheDocument();
    expect(
      screen.getByText("No errors reported in 24 hours"),
    ).toBeInTheDocument();
  });
});

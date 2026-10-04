import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHealthWorkspace, SiteHealthTile } from "./SiteHealthWorkspace";
import type { HealthResult, HealthRun } from "@/lib/admin/site-health/contract";
const mock = vi.hoisted(() => ({
  overview: vi.fn(),
  results: vi.fn(),
  states: vi.fn(),
  visitors: vi.fn(),
  save: vi.fn(),
  reset: vi.fn(),
  ping: vi.fn(),
}));
vi.mock("@/lib/admin/site-health/data", () => ({
  loadHealthOverview: mock.overview,
  loadHealthResults: mock.results,
  loadIssueStates: mock.states,
  loadVisitorErrors: mock.visitors,
  saveIssueState: mock.save,
  resetIssueState: mock.reset,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: mock.ping } },
}));
const run: HealthRun = {
  id: "current",
  started_at: "2026-10-04T07:00:00Z",
  finished_at: "2026-10-04T07:10:00Z",
  kind: "baseline",
  target_origin: "https://www.ascentgroupconstruction.com",
  commit_ref: null,
  pages_checked: 86,
  errors: 1,
  warnings: 0,
  status: "failed",
};
const row: HealthResult = {
  id: "r1",
  run_id: run.id,
  path: "/contact",
  viewport: "desktop",
  http_status: 200,
  load_ms: 100,
  title: "Contact",
  h1: "Contact",
  canonical: null,
  text_hash: null,
  console_errors: 0,
  failed_requests: 1,
  checked_at: run.finished_at!,
  issues: [
    {
      code: "broken_image",
      severity: "error",
      message: "Image failed",
      fingerprint: "a".repeat(64),
      target: "/image.jpg",
    },
  ],
};
const open = (tile = false) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {tile ? <SiteHealthTile /> : <SiteHealthWorkspace />}
    </QueryClientProvider>,
  );
beforeEach(() => {
  vi.clearAllMocks();
  mock.overview.mockResolvedValue({
    available: true,
    runs: [run, { ...run, id: "prior", started_at: "2026-10-03T07:00:00Z" }],
  });
  mock.results.mockImplementation((id) =>
    Promise.resolve(id === "current" ? [row] : []),
  );
  mock.states.mockResolvedValue([]);
  mock.visitors.mockResolvedValue({ groups: [], limited: false });
  mock.save.mockResolvedValue(undefined);
});
afterEach(cleanup);
describe("honest Site Health workspace", () => {
  it("shows setup required instead of a fabricated healthy state", async () => {
    mock.overview.mockResolvedValue({ available: false, runs: [] });
    open();
    expect(
      await screen.findByText("Site Health needs setup"),
    ).toBeInTheDocument();
    expect(mock.results).not.toHaveBeenCalled();
  });
  it("keeps permission failures visible", async () => {
    mock.overview.mockRejectedValue({ code: "42501" });
    open();
    expect(
      await screen.findByText(/Site Health is unavailable/),
    ).toBeInTheDocument();
  });
  it("highlights new findings and retains the reason after a failed save", async () => {
    mock.save.mockRejectedValue({ code: "42501" });
    open();
    expect(
      await screen.findByText("New since previous night"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mark ignored" }));
    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Known issue" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save decision" }));
    expect(
      await screen.findByText(/does not have permission/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Reason")).toHaveValue("Known issue");
  });
  it("keeps findings marked fixed visible if still detected", async () => {
    mock.states.mockResolvedValue([
      {
        fingerprint: "a".repeat(64),
        state: "fixed",
        reason: "Repaired",
        updated_at: "",
        updated_by: null,
      },
    ]);
    open();
    expect(
      await screen.findByText("Still detected · marked fixed"),
    ).toBeInTheDocument();
  });
  it("lets the owner review ignored findings", async () => {
    mock.states.mockResolvedValue([
      {
        fingerprint: "a".repeat(64),
        state: "ignored",
        reason: "Reviewed",
        updated_at: "",
        updated_by: null,
      },
    ]);
    open();
    await waitFor(() =>
      expect(
        screen.getByText(/All detected issues are ignored/),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByLabelText("Show ignored issues"));
    expect(screen.getByText("Reason: Reviewed")).toBeInTheDocument();
  });
  it("reports blocked runs as incomplete", async () => {
    mock.overview.mockResolvedValue({
      available: true,
      runs: [{ ...run, status: "blocked", pages_checked: 0 }],
    });
    open();
    expect(
      await screen.findByText(/coverage is incomplete/),
    ).toBeInTheDocument();
  });
  it("shows the measured tile and real workflow link", async () => {
    open(true);
    expect(
      await screen.findByText("1 errors · 0 warnings"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/admin/monitoring",
    );
  });
});

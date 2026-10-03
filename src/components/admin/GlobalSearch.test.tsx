import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminSearchResult } from "@/lib/adminSearch";
import { GlobalSearch } from "./GlobalSearch";
import { GlobalSearchDialog } from "./GlobalSearchDialog";

const mock = vi.hoisted(() => ({ search: vi.fn() }));
vi.mock("@/lib/adminSearch", () => ({ searchAdmin: mock.search }));
const result = (title: string): AdminSearchResult => ({ id: "00000000-0000-4000-8000-000000000001", kind: "rfp", label: "RFP", title, description: "Fixture details", url: "/admin/inbox?tab=rfp&highlight=00000000-0000-4000-8000-000000000001" });
function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  mock.search.mockResolvedValue({ results: [], failedSources: [] });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

async function enterSearch(query: string) {
  fireEvent.change(screen.getByLabelText("Search admin content and inquiries"), { target: { value: query } });
  await act(async () => { await vi.advanceTimersByTimeAsync(301); });
}

describe("shared global search dialog", () => {
  it("routes directly to the selected inquiry", async () => {
    mock.search.mockResolvedValue({ results: [result("Fixture RFP")], failedSources: [] });
    const close = vi.fn();
    render(<MemoryRouter><GlobalSearchDialog open onOpenChange={close} /><Location /></MemoryRouter>);
    await enterSearch("Fixture");
    fireEvent.click(screen.getByRole("button", { name: /Fixture RFP/ }));
    expect(screen.getByTestId("location")).toHaveTextContent(result("").url);
    expect(close).toHaveBeenCalledWith(false);
  });

  it("ignores an older completed search and aborts it when the query changes", async () => {
    let finishOld: (response: { results: AdminSearchResult[]; failedSources: string[] }) => void;
    const old = new Promise<{ results: AdminSearchResult[]; failedSources: string[] }>((resolve) => { finishOld = resolve; });
    mock.search.mockReturnValueOnce(old).mockResolvedValueOnce({ results: [result("Latest result")], failedSources: [] });
    render(<MemoryRouter><GlobalSearchDialog open onOpenChange={() => {}} /></MemoryRouter>);
    await enterSearch("Old query");
    const oldSignal = mock.search.mock.calls[0][1] as AbortSignal;
    await enterSearch("New query");
    expect(oldSignal.aborted).toBe(true);
    expect(screen.getByText("Latest result")).toBeVisible();
    await act(async () => { finishOld!({ results: [result("Stale result")], failedSources: [] }); });
    expect(screen.queryByText("Stale result")).toBeNull();
    expect(screen.getByText("Latest result")).toBeVisible();
  });

  it("shows partial-load errors and supports retry without reporting a false empty result", async () => {
    mock.search.mockResolvedValueOnce({ results: [], failedSources: ["RFP"] }).mockResolvedValueOnce({ results: [result("Retried result")], failedSources: [] });
    render(<MemoryRouter><GlobalSearchDialog open onOpenChange={() => {}} /></MemoryRouter>);
    await enterSearch("Fixture");
    expect(screen.getByRole("alert")).toHaveTextContent("Could not search: RFP");
    expect(screen.queryByText(/No results found/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Retry search" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(301); });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("Retried result")).toBeVisible();
  });

  it("cancels pending work when the dialog closes", async () => {
    mock.search.mockReturnValue(new Promise(() => {}));
    const tree = (open: boolean) => <MemoryRouter><GlobalSearchDialog open={open} onOpenChange={() => {}} /></MemoryRouter>;
    const view = render(tree(true));
    await enterSearch("Fixture");
    const signal = mock.search.mock.calls[0][1] as AbortSignal;
    view.rerender(tree(false));
    expect(signal.aborted).toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it.each(["ctrlKey", "metaKey"])("opens exactly one dialog with %s+K when the sidebar is collapsed", async (modifier) => {
    render(<MemoryRouter><GlobalSearch collapsed /></MemoryRouter>);
    fireEvent.keyDown(window, { key: "k", [modifier]: true });
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Search Everything" })).toBeVisible();
    fireEvent.keyDown(window, { key: "k", [modifier]: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

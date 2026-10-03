import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LeadsWorkspace } from "./LeadsWorkspace";
import { normalizeInboxItem } from "@/lib/inbox/model";
import { leadCursor } from "@/lib/leads/model";
const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  export: vi.fn(),
  channel: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@/lib/leads/api", () => ({ loadLeadPage: mocks.load }));
vi.mock("@/lib/inbox/workspace", () => ({ downloadInboxCsv: mocks.export }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { channel: mocks.channel, removeChannel: mocks.remove },
}));
vi.mock("./LeadDetailPanel", () => ({
  LeadDetailPanel: ({ id }: { id: string }) => <div>Detail {id}</div>,
}));
const item = normalizeInboxItem("contact", {
  id: "00000000-0000-4000-8000-000000000001",
  email: "fixture@example.test",
  name: "Fixture estimate",
  submission_type: "estimate",
  message: "Saved estimate message",
  status: "new",
  created_at: "2026-10-02T15:00:00Z",
});
const cursor = leadCursor(item);
beforeEach(() => {
  vi.clearAllMocks();
  const channel = { on: () => channel, subscribe: vi.fn() };
  mocks.channel.mockReturnValue(channel);
  mocks.load.mockResolvedValue({
    items: [item],
    failed: [],
    nextCursor: cursor,
  });
});
afterEach(cleanup);
function mount(props = {}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const onSelectionChange = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <LeadsWorkspace onSelectionChange={onSelectionChange} {...props} />
    </QueryClientProvider>,
  );
  return { onSelectionChange };
}
describe("Leads workspace behavior", () => {
  it("includes estimates filed under Contacts and opens a source-specific detail link", async () => {
    const { onSelectionChange } = mount();
    await screen.findAllByText("Fixture estimate");
    expect(screen.getAllByText("Estimate").length).toBeGreaterThan(0);
    fireEvent.click(
      screen.getAllByRole("button", { name: "View Fixture estimate" })[0],
    );
    expect(onSelectionChange).toHaveBeenCalledWith({
      id: item.id,
      source: "contact",
    });
    expect(mocks.load).toHaveBeenCalledWith(
      { search: "", status: "open", type: "all" },
      null,
      expect.any(AbortSignal),
    );
  });
  it("uses the continuation cursor, restores the previous page, and resets pagination when search changes", async () => {
    mount();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Older" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Older" }));
    await waitFor(() =>
      expect(mocks.load).toHaveBeenCalledWith(
        expect.anything(),
        cursor,
        expect.any(AbortSignal),
      ),
    );
    expect(await screen.findByText(/Page 2/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search leads" }), {
      target: { value: "Roof" },
    });
    expect(screen.getByRole("button", { name: "Older" })).toBeDisabled();
    await waitFor(() =>
      expect(mocks.load).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Roof" }),
        null,
        expect.any(AbortSignal),
      ),
    );
    expect(await screen.findByText(/Page 1/)).toBeInTheDocument();
  });
  it("keeps partial results visible and blocks export/advancing until the failed source recovers", async () => {
    mocks.load.mockResolvedValue({
      items: [item],
      failed: ["RFP"],
      nextCursor: cursor,
    });
    mount();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load RFP",
    );
    expect(screen.getAllByText("Fixture estimate").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Export this page" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Older" })).toBeDisabled();
    mocks.load.mockResolvedValue({
      items: [item],
      failed: [],
      nextCursor: null,
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Retry unavailable sources" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Export this page" }),
    ).toBeEnabled();
  });
  it("can open a bookmarked detail even when the filtered page is empty", async () => {
    mocks.load.mockResolvedValue({ items: [], failed: [], nextCursor: null });
    mount({ highlightId: item.id, source: "contact" });
    expect(await screen.findByText(`Detail ${item.id}`)).toBeInTheDocument();
    expect(
      await screen.findByText("No requests match these filters."),
    ).toBeInTheDocument();
  });
});

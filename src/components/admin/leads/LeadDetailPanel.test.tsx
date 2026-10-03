import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { normalizeInboxItem, type InboxItem } from "@/lib/inbox/model";
const mock = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock("@/lib/leads/api", () => ({ loadLeadDetail: mock.load }));
vi.mock("@/components/admin/inbox/InboxDetailDialog", () => ({
  InboxDetailDialog: ({ item }: { item: InboxItem }) => (
    <div>{String(item.admin_notes)}</div>
  ),
}));
const item = normalizeInboxItem("contact", {
  id: "00000000-0000-4000-8000-000000000001",
  email: "fixture@example.test",
  admin_notes: "Stale cached note",
  status: "new",
});
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(["lead-detail", "contact", item.id], item);
  render(
    <QueryClientProvider client={client}>
      <LeadDetailPanel
        id={item.id}
        source="contact"
        onClose={vi.fn()}
        onUpdate={vi.fn()}
      />
    </QueryClientProvider>,
  );
  return client;
}
describe("fresh detail baseline", () => {
  it("waits for the fresh saved record instead of opening an editor on cached notes", async () => {
    mock.load.mockResolvedValue({ ...item, admin_notes: "Current saved note" });
    mount();
    expect(screen.queryByText("Stale cached note")).not.toBeInTheDocument();
    expect(await screen.findByText("Current saved note")).toBeInTheDocument();
  });
  it("shows the fresh-read error instead of presenting stale cached details", async () => {
    mock.load.mockRejectedValue(new Error("Request unavailable"));
    mount();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Request unavailable",
    );
    expect(screen.queryByText("Stale cached note")).not.toBeInTheDocument();
  });
  it("retains the open editor's baseline through a later failed background refresh", async () => {
    mock.load.mockResolvedValue({
      ...item,
      admin_notes: "Initial saved baseline",
    });
    const client = mount();
    await screen.findByText("Initial saved baseline");
    mock.load.mockRejectedValue(new Error("Background unavailable"));
    await client.invalidateQueries({ queryKey: ["lead-detail"] });
    await waitFor(() => expect(mock.load).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Initial saved baseline")).toBeInTheDocument();
  });
});

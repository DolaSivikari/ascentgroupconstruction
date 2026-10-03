import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InboxTable } from "./InboxTable";
import { normalizeInboxItem, type InboxItem } from "@/lib/inbox/model";

const mock = vi.hoisted(() => ({
  load: vi.fn(),
  download: vi.fn(),
  toast: vi.fn(),
}));
vi.mock("@/lib/inbox/api", () => ({ loadInbox: mock.load }));
vi.mock("@/lib/inbox/workspace", async (original) => ({
  ...(await original<typeof import("@/lib/inbox/workspace")>()),
  torontoDate: () => "2026-10-02",
  downloadInboxCsv: mock.download,
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    channel: () => {
      const channel = { on: () => channel, subscribe: () => channel };
      return channel;
    },
    removeChannel: vi.fn(),
  },
}));
vi.mock("./InboxDetailDialog", () => ({
  InboxDetailDialog: ({ item }: { item: InboxItem }) => (
    <div>Opened request: {item.id}</div>
  ),
}));
// Exercise list filtering with native inputs; actual Radix interactions are checked in the browser.
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <select
      aria-label="Inbox selector"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: (props: ComponentProps<"option">) => <option {...props} />,
  SelectTrigger: () => null,
  SelectValue: () => null,
}));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());
function renderWorkspace() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <InboxTable type="work" />
    </QueryClientProvider>,
  );
}
const fixture = [
  normalizeInboxItem("rfp", {
    id: "rfp",
    email: "gc@example.test",
    contact_name: "RFP contact",
    company_name: "Fixture GC",
    project_name: "Building restoration",
    scope_of_work: "Brick repairs",
    project_start_date: "2026-01-01",
    status: "new",
    attachment_urls: ["private/plans.pdf"],
    created_at: "2026-10-02T15:00:00Z",
  }),
  normalizeInboxItem("quote", {
    id: "estimate",
    email: "owner@example.test",
    name: "Estimator contact",
    source: "estimator",
    target_deadline: "2026-10-03",
    project_address: "1 Fixture Road",
    scope_categories: ["Waterproofing"],
    status: "new",
    created_at: "2026-10-02T14:00:00Z",
  }),
  normalizeInboxItem("quote", {
    id: "quote",
    email: "quote@example.test",
    name: "Quote contact",
    target_deadline: "2026-10-01",
    scope_categories: ["Concrete"],
    status: "contacted",
    created_at: "2026-10-02T13:00:00Z",
  }),
  normalizeInboxItem("quote", {
    id: "won",
    email: "won@example.test",
    name: "Won contact",
    target_deadline: "2026-09-30",
    status: "won",
    created_at: "2026-10-02T12:00:00Z",
  }),
];

describe("existing-record Bids & Estimates workspace", () => {
  it("combines open commercial requests, sorts requested dates and retains complete details", async () => {
    mock.load.mockResolvedValue({ items: fixture, failed: [] });
    renderWorkspace();
    await screen.findByText("RFP contact");
    expect(mock.load).toHaveBeenCalledWith("work");
    const rows = screen.getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Quote contact")).toBeInTheDocument();
    expect(
      within(rows[0]).getByText("Requested date overdue"),
    ).toBeInTheDocument();
    expect(within(rows[1]).getByText("Estimate")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Brick repairs")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Not captured")).toBeInTheDocument();
    expect(
      within(rows[2]).queryByText("Requested date overdue"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Won contact")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View RFP contact" }));
    expect(screen.getByText("Opened request: rfp")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(mock.download).toHaveBeenCalledWith(
      [fixture[2], fixture[1], fixture[0]],
      "work",
    );
  });
  it("filters estimates separately and exports precisely the visible search/status results", async () => {
    mock.load.mockResolvedValue({ items: fixture, failed: [] });
    renderWorkspace();
    await screen.findByText("RFP contact");
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "estimate" },
    });
    expect(screen.getByText("Estimator contact")).toBeInTheDocument();
    expect(screen.queryByText("RFP contact")).not.toBeInTheDocument();
    expect(screen.queryByText("Quote contact")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(mock.download).toHaveBeenLastCalledWith([fixture[1]], "work");
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "all" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "all" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Search inbox" }), {
      target: { value: "won@example.test" },
    });
    expect(screen.getByText("Won contact")).toBeInTheDocument();
    expect(
      screen.queryByText("Requested date overdue"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(mock.download).toHaveBeenLastCalledWith([fixture[3]], "work");
  });
  it("shows partial-load warnings and prevents exporting an incomplete inbox", async () => {
    mock.load.mockResolvedValue({ items: [fixture[1]], failed: ["RFP"] });
    renderWorkspace();
    await screen.findByText("Estimator contact");
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load RFP");
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(mock.load).toHaveBeenCalledTimes(2));
  });
});

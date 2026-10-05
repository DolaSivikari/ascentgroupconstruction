import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import Dashboard from "./Dashboard";
import { normalizeInboxItem } from "@/lib/inbox/model";
import type {
  DashboardContent,
  LegacyLeadSummary,
} from "@/lib/inbox/dashboard-v2";
const mock = vi.hoisted(() => ({
  leads: vi.fn(),
  content: vi.fn(),
  channel: vi.fn(),
  on: vi.fn(),
  subscribe: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@/lib/inbox/dashboard-v2", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/inbox/dashboard-v2")>()),
  loadLegacyLeadSummary: mock.leads,
  loadDashboardContent: mock.content,
}));
vi.mock("@/lib/inquiry/summary", () => ({
  loadCombinedLeadSummary: mock.leads,
}));
// This suite exercises lead/content tiles; nightly health has its own suite.
vi.mock("@/components/admin/SiteHealthWorkspace", () => ({
  SiteHealthTile: () => <p>Nightly monitoring not configured</p>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { channel: mock.channel, removeChannel: mock.remove },
}));
vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({
    children,
    actions,
  }: {
    children: ReactNode;
    actions: ReactNode;
  }) => (
    <main>
      {actions}
      {children}
    </main>
  ),
}));
const summary = (): LegacyLeadSummary => ({
  newBySource: { contact: 2, rfp: 1, quote: 3, prequal: 4 },
  newTotal: 10,
  byStatus: { new: 10, contacted: 2, won: 5, lost: 1 },
  total: 18,
  activity: { items: [], failed: [] },
  failed: [],
});
const content = (): DashboardContent => ({
  projectsPublished: 11,
  projectsDraft: 2,
  services: 22,
  blogPublished: 6,
  blogDraft: 1,
  heroSlides: 4,
  whyChooseUs: 3,
  testimonials: 2,
  valuePillars: 4,
});
beforeEach(() => {
  vi.clearAllMocks();
  mock.leads.mockResolvedValue(summary());
  mock.content.mockResolvedValue(content());
  const channel = { on: mock.on, subscribe: mock.subscribe };
  mock.on.mockReturnValue(channel);
  mock.channel.mockReturnValue(channel);
});
afterEach(cleanup);
function Location() {
  const location = useLocation();
  return (
    <output aria-label="Current URL">
      {location.pathname}
      {location.search}
    </output>
  );
}
function mount(
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
  const view = render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Dashboard />
        <Location />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { ...view, client };
}
describe("P4a dashboard", () => {
  it("shows loading placeholders instead of zero before counts arrive", () => {
    mock.leads.mockReturnValue(new Promise(() => {}));
    mock.content.mockReturnValue(new Promise(() => {}));
    mount();
    expect(
      screen.getByRole("link", { name: "Unopened: —" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Published projects: —" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Loading activity...")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Unopened: 0" }),
    ).not.toBeInTheDocument();
  });
  it("includes all legacy new requests and navigates to their exact status/source filter", async () => {
    mount();
    const link = await screen.findByRole("link", {
      name: "Contact requests: 2",
    });
    fireEvent.click(link);
    const destination = new URL(
      screen.getByLabelText("Current URL").textContent!,
      "https://fixture.test",
    );
    expect(destination.pathname).toBe("/admin/inbox");
    expect(Object.fromEntries(destination.searchParams)).toEqual({
      tab: "leads",
      status: "new",
      lead_source: "contact",
    });
    expect(screen.getByRole("link", { name: "Unopened: 10" })).toHaveAttribute(
      "href",
      "/admin/inbox?tab=leads&status=new",
    );
    expect(
      screen.getByRole("link", { name: "Needs action: 10" }),
    ).toHaveAttribute("href", "/admin/inbox?tab=leads&status=new");
    expect(
      within(screen.getByRole("region", { name: "Pipeline" })).getByRole(
        "link",
        { name: "Won: 5" },
      ),
    ).toHaveAttribute("href", "/admin/inbox?tab=leads&status=won");
  });
  it("shows failed source totals as Unavailable and retains healthy sources and content", async () => {
    const data = summary();
    data.newBySource.rfp = null;
    data.newTotal = null;
    data.byStatus = null;
    data.total = null;
    data.failed = ["RFP"];
    mock.leads.mockResolvedValue(data);
    mount();
    expect(
      await screen.findByRole("link", { name: "Unopened: Unavailable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "RFP requests: Unavailable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Contact requests: 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Won: Unavailable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Published projects: 11" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("RFP");
  });
  it("recovers from a full request failure using the retry control", async () => {
    mock.leads
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValue(summary());
    mount();
    expect(
      await screen.findByRole("link", { name: "Unopened: Unavailable" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry request data" }));
    expect(
      await screen.findByRole("link", { name: "Unopened: 10" }),
    ).toBeInTheDocument();
    expect(mock.leads).toHaveBeenCalledTimes(2);
  });
  it("keeps actual zero counts while explaining metrics the legacy schema cannot provide", async () => {
    const data = summary();
    data.newTotal = 0;
    data.newBySource = { contact: 0, rfp: 0, quote: 0, prequal: 0 };
    data.byStatus = {};
    data.total = 0;
    mock.leads.mockResolvedValue(data);
    mount();
    expect(
      await screen.findByRole("link", { name: "Unopened: 0" }),
    ).toBeInTheDocument();
    for (const title of [
      "Due in 7 days",
      "Overdue",
      "Alerts needing attention",
      "Unassigned",
    ])
      expect(
        within(screen.getByRole("group", { name: title })).getByText(
          "Unavailable",
        ),
      ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Project start dates and requested deadlines are not bid closing times/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Bids due soon" }),
    ).toHaveTextContent("Unavailable");
  });
  it("shows ten recent requests with correct estimate labels and Toronto received times", async () => {
    const data = summary();
    data.activity.items = Array.from({ length: 10 }, (_, n) =>
      normalizeInboxItem("quote", {
        id: `fixture-${n}`,
        email: "fixture@example.test",
        name: `Request ${n}`,
        status: "new",
        created_at: "2026-10-03T17:00:00Z",
        quote_type: "trade_package",
        source: '{"utm_source":"google"}',
        additional_notes: "Saved estimate scope",
      }),
    );
    mock.leads.mockResolvedValue(data);
    mount();
    await screen.findByText("Request 9");
    const activity = screen.getByRole("region", { name: "Recent requests" });
    expect(within(activity).getAllByText("Estimate")).toHaveLength(10);
    expect(within(activity).getAllByText(/1:00 p.m. EDT/)).toHaveLength(10);
  });
  it("keeps healthy content when a content tile fails", async () => {
    mock.content.mockResolvedValue({ ...content(), services: null });
    mount();
    expect(
      await screen.findByRole("link", { name: "Services: Unavailable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Published projects: 11" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Other content tiles remain visible",
    );
  });
  it("subscribes to the four legacy tables and optional inquiries and does not refresh content for lead events", async () => {
    const { unmount } = mount();
    await screen.findByRole("link", { name: "Unopened: 10" });
    expect(mock.on.mock.calls.map((call) => call[1].table).sort()).toEqual([
      "contact_submissions",
      "inquiries",
      "prequalification_downloads",
      "quote_requests",
      "rfp_submissions",
    ]);
    expect(
      mock.on.mock.calls.every(
        (call) => call[1].schema === "public" && call[1].table,
      ),
    ).toBe(true);
    mock.on.mock.calls[0][2]();
    await waitFor(() => expect(mock.leads).toHaveBeenCalledTimes(2));
    expect(mock.content).toHaveBeenCalledTimes(1);
    unmount();
    expect(mock.remove).toHaveBeenCalledTimes(1);
  });
  it("reuses fresh content when returning to the dashboard while reloading lead counts", async () => {
    const first = mount();
    await screen.findByRole("link", { name: "Published projects: 11" });
    first.unmount();
    mount(first.client);
    await waitFor(() => expect(mock.leads).toHaveBeenCalledTimes(2));
    expect(mock.content).toHaveBeenCalledTimes(1);
  });
});

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InquiryDetailPanel } from "./InquiryDetailPanel";
import type { Inquiry } from "@/lib/inquiry/types";
const mock = vi.hoisted(() => ({
  save: vi.fn(),
  toast: vi.fn(),
  thread: vi.fn(),
}));
vi.mock("@/lib/inquiry/api", () => ({
  saveInquiry: mock.save,
  inquiryThread: mock.thread,
  loadAssignees: async () => [],
  loadInquiryDetail: vi.fn(),
  archiveInquiry: vi.fn(),
  addInquiryNote: vi.fn(),
  resendInquiryAlert: vi.fn(),
  maskedEmail: (email: string) => email,
}));
vi.mock("@/lib/inbox/api", () => ({ signRfpAttachment: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
const inquiry: Inquiry = {
  id: "fixture-inquiry",
  reference_code: "AGC-001",
  submission_key: null,
  created_at: "2026-10-08T14:00:00Z",
  updated_at: "2026-10-08T14:00:00Z",
  inquiry_type: "bid_invitation",
  status: "new",
  priority: "normal",
  contact_name: "Fixture client",
  email: "client@example.test",
  phone: "555-0100",
  company: "Fixture company",
  project_name: "Envelope repair",
  project_location: "Toronto",
  message: "Please review the full submitted scope.",
  bid_due_at: null,
  drawings_url: null,
  attachment_paths: [],
  assigned_to: null,
  bid_amount: null,
  first_viewed_at: null,
  archived_at: null,
  archived_by: null,
  alert_status: "pending",
  alert_attempts: 0,
  alert_last_error: null,
  alert_sent_at: null,
  alert_lease_until: null,
  confirmation_status: "pending",
  source_path: "/contact",
  details: { submission_hash: "private-fixture-hash" },
};
beforeEach(() => {
  vi.clearAllMocks();
  mock.thread.mockResolvedValue({ notes: [], events: [], deliveries: [] });
  mock.save.mockImplementation(
    async (_baseline: Inquiry, patch: Partial<Inquiry>) => ({
      ...inquiry,
      ...patch,
    }),
  );
});
afterEach(cleanup);
function open() {
  const onClose = vi.fn(),
    onUpdate = vi.fn();
  render(
    <MemoryRouter>
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <InquiryDetailPanel
          inquiry={inquiry}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      </QueryClientProvider>
    </MemoryRouter>,
  );
  return { onClose, onUpdate };
}
const section = (name: string) =>
  fireEvent.click(screen.getByRole("link", { name }));
describe("modern inquiry detail workspace", () => {
  it("shows contact actions and complete submitted information with honest empty states", async () => {
    open();
    expect(
      screen.getByRole("heading", { name: "Fixture client" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Email Fixture client" }),
    ).toHaveAttribute("href", "mailto:client@example.test");
    expect(
      screen.getByRole("link", { name: "Call Fixture client" }),
    ).toHaveAttribute("href", "tel:555-0100");
    expect(screen.getByText(inquiry.message!)).toBeVisible();
    expect(
      screen.getByText("No additional details or files were submitted."),
    ).toBeVisible();
    expect(screen.getAllByText(inquiry.phone!)).toHaveLength(1);
    section("History");
    expect(await screen.findByText("No history recorded yet.")).toBeVisible();
    section("Alert delivery");
    expect(
      await screen.findByText("No recipient delivery results recorded yet."),
    ).toBeVisible();
  });
  it("keeps workflow edits through section changes and saves their original payload from the footer", async () => {
    const { onUpdate } = open();
    section("Workflow");
    fireEvent.change(screen.getByRole("combobox", { name: "Status" }), {
      target: { value: "reviewing" },
    });
    section("Submitted request");
    fireEvent.click(
      within(screen.getByRole("contentinfo")).getByRole("button", {
        name: "Save changes",
      }),
    );
    await waitFor(() =>
      expect(mock.save).toHaveBeenCalledWith(inquiry, {
        status: "reviewing",
        priority: "normal",
        assigned_to: null,
        bid_due_at: null,
        bid_amount: null,
      }),
    );
    expect(onUpdate).toHaveBeenCalledOnce();
    section("Workflow");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "reviewing",
    );
  });
  it("preserves edits after a failed save and warns before discarding an unsent note", async () => {
    mock.save.mockRejectedValueOnce(new Error("Fixture save failed"));
    const { onClose } = open();
    section("Workflow");
    fireEvent.change(screen.getByRole("combobox", { name: "Status" }), {
      target: { value: "reviewing" },
    });
    fireEvent.click(
      within(screen.getByRole("contentinfo")).getByRole("button", {
        name: "Save changes",
      }),
    );
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Action could not be completed" }),
      ),
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "reviewing",
    );
    section("Notes");
    fireEvent.change(screen.getByRole("textbox", { name: "New lead note" }), {
      target: { value: "Retain this note" },
    });
    section("Submitted request");
    fireEvent.click(
      within(screen.getByRole("contentinfo")).getByRole("button", {
        name: "Close",
      }),
    );
    expect(await screen.findByRole("alertdialog")).toHaveTextContent(
      "Discard unsaved lead edits?",
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

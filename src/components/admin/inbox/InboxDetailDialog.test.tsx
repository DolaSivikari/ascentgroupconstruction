import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps, ReactNode } from "react";
import { InboxDetailDialog } from "./InboxDetailDialog";
import { normalizeInboxItem } from "@/lib/inbox/model";
const mock = vi.hoisted(() => ({
  save: vi.fn(),
  sign: vi.fn(),
  toast: vi.fn(),
}));
vi.mock("@/lib/inbox/api", () => ({
  saveInboxItem: mock.save,
  signRfpAttachment: mock.sign,
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
// Test form behavior with a native select; real Radix interactions are browser-checked.
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
    disabled,
  }: {
    children: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
  }) => (
    <select
      aria-label="Request status"
      value={value}
      disabled={disabled}
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
beforeEach(() => {
  vi.clearAllMocks();
  mock.save.mockResolvedValue(undefined);
});
const callbacks = () => ({ onClose: vi.fn(), onUpdate: vi.fn() });
const record = {
  id: "lead-1",
  email: "client@example.test",
  status: "new",
  created_at: "2026-10-02T15:00:00Z",
};
describe("request detail form", () => {
  it("protects unsaved notes when closing the detail panel and provides no hard-delete action", () => {
    const handlers = callbacks();
    render(
      <InboxDetailDialog
        item={normalizeInboxItem("contact", {
          ...record,
          name: "Fixture",
          submission_type: "estimate",
          admin_notes: "Original",
        })}
        open
        {...handlers}
        presentation="panel"
        allowDelete={false}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Admin notes"), {
      target: { value: "Unsaved follow-up" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Close" })[0]);
    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "Discard unsaved changes?",
    );
    expect(handlers.onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(screen.getByLabelText("Admin notes")).toHaveValue(
      "Unsaved follow-up",
    );
  });
  it("retains the original edit baseline if realtime supplies a newer record", async () => {
    const item = normalizeInboxItem("contact", {
      ...record,
      admin_notes: "Original",
    });
    const handlers = callbacks();
    const { rerender } = render(
      <InboxDetailDialog item={item} open {...handlers} />,
    );
    rerender(
      <InboxDetailDialog
        item={{ ...item, admin_notes: "Another staff member's change" }}
        open
        {...handlers}
      />,
    );
    fireEvent.change(screen.getByLabelText("Admin notes"), {
      target: { value: "My edit" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() =>
      expect(mock.save).toHaveBeenCalledWith(item, "new", "My edit"),
    );
  });
  it("shows stored RFP scope, requirements, files, and existing internal notes", async () => {
    const item = normalizeInboxItem("rfp", {
      ...record,
      contact_name: "Example client",
      company_name: "Fixture company",
      project_name: "Roof repair",
      scope_of_work: "Saved detailed scope",
      project_location: "Toronto",
      bonding_required: false,
      plans_available: true,
      additional_requirements: "Weekend access",
      admin_notes: "Already called",
      attachment_urls: ["drawings/roof-plan.pdf"],
    });
    const handlers = callbacks();
    render(<InboxDetailDialog item={item} open {...handlers} />);
    expect(screen.getByText("Saved detailed scope")).toBeInTheDocument();
    expect(screen.getByText("Weekend access")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin notes")).toHaveValue("Already called");
    expect(
      screen.getByRole("button", { name: "roof-plan.pdf" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "contacted" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() =>
      expect(mock.save).toHaveBeenCalledWith(
        item,
        "contacted",
        "Already called",
      ),
    );
    expect(handlers.onClose).toHaveBeenCalledOnce();
  });
  it.each(["quote", "prequal"] as const)(
    "allows status changes for %s without unsupported internal notes",
    async (kind) => {
      const item = normalizeInboxItem(kind, {
        ...record,
        additional_notes: "Original client notes",
        source: "estimator",
        target_deadline: "2026-10-20",
      });
      render(<InboxDetailDialog item={item} open {...callbacks()} />);
      expect(screen.queryByLabelText("Admin notes")).not.toBeInTheDocument();
      if (kind === "quote") {
        expect(screen.getByText("Original client notes")).toBeInTheDocument();
        expect(
          screen.getAllByRole("option").map((option) => option.textContent),
        ).toEqual(["New", "Contacted", "Quoted", "Won", "Lost"]);
      }
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "contacted" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
      await waitFor(() =>
        expect(mock.save).toHaveBeenCalledWith(item, "contacted", ""),
      );
    },
  );
  it("keeps unsaved edits visible after a failed save", async () => {
    mock.save.mockRejectedValueOnce(new Error("denied"));
    const handlers = callbacks();
    render(
      <InboxDetailDialog
        item={normalizeInboxItem("contact", {
          ...record,
          name: "Example",
          message: "Please call",
          admin_notes: "Old note",
        })}
        open
        {...handlers}
      />,
    );
    fireEvent.change(screen.getByLabelText("Admin notes"), {
      target: { value: "Unsaved follow-up" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Could not save" }),
      ),
    );
    expect(handlers.onClose).not.toHaveBeenCalled();
    expect(handlers.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Admin notes")).toHaveValue(
      "Unsaved follow-up",
    );
  });
  it("shows the actual stored resume cover letter", () => {
    render(
      <InboxDetailDialog
        item={normalizeInboxItem("resume", {
          ...record,
          cover_letter: "Saved cover letter",
          position_applied: "Estimator",
          admin_notes: null,
        })}
        open
        {...callbacks()}
      />,
    );
    expect(screen.getByText("Saved cover letter")).toBeInTheDocument();
    expect(screen.getByText("Estimator")).toBeInTheDocument();
  });
  it("provides an attachment link when popups are blocked", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    mock.sign.mockResolvedValueOnce("https://files.example.test/signed-plan");
    render(
      <InboxDetailDialog
        item={normalizeInboxItem("rfp", {
          ...record,
          attachment_urls: ["drawings/plan.pdf"],
        })}
        open
        {...callbacks()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "plan.pdf" }));
    expect(
      await screen.findByRole("link", { name: "Open plan.pdf" }),
    ).toHaveAttribute("href", "https://files.example.test/signed-plan");
    open.mockRestore();
  });
});

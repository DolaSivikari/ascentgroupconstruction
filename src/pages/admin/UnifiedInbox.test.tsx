import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import UnifiedInbox from "./UnifiedInbox";

vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({ children }: { children: ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("@/components/admin/inbox/InboxDashboard", () => ({
  InboxDashboard: () => <div>Inbox summary</div>,
}));
vi.mock("@/components/admin/inbox/InboxTable", () => ({
  InboxTable: ({
    type,
    highlightId,
  }: {
    type: string;
    highlightId?: string | null;
  }) => (
    <div>
      {type} inbox; highlighted {highlightId || "none"}
    </div>
  ),
}));

afterEach(cleanup);
function Location() {
  const location = useLocation();
  return (
    <output aria-label="Current inbox URL">
      {location.pathname}
      {location.search}
    </output>
  );
}
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <UnifiedInbox />
      <Location />
    </MemoryRouter>,
  );
}

describe("inbox tab URL compatibility", () => {
  it("keeps All as the default and adds the combined workspace before it", () => {
    renderAt("/admin/inbox");
    expect(
      screen.getByRole("tab", { name: "All", selected: true }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")[0]).toHaveTextContent("Bids & Estimates");
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Bids & Estimates" }), {
      button: 0,
    });
    expect(
      screen.getByText("work inbox; highlighted none"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Current inbox URL")).toHaveTextContent(
      "/admin/inbox?tab=work",
    );
  });
  it.each(["rfp", "quote", "contact", "resume", "prequal", "newsletter"])(
    "preserves existing %s notification links and highlighted records when changing tab",
    (tab) => {
      renderAt(`/admin/inbox?tab=${tab}&highlight=lead-123&extra=keep`);
      expect(
        screen.getByText(`${tab} inbox; highlighted lead-123`),
      ).toBeInTheDocument();
      fireEvent.mouseDown(
        screen.getByRole("tab", { name: "Bids & Estimates" }),
        { button: 0 },
      );
      expect(
        screen.getByText("work inbox; highlighted lead-123"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Current inbox URL")).toHaveTextContent(
        "tab=work&highlight=lead-123&extra=keep",
      );
      fireEvent.mouseDown(screen.getByRole("tab", { name: "All" }), {
        button: 0,
      });
      expect(screen.getByLabelText("Current inbox URL")).toHaveTextContent(
        "/admin/inbox?highlight=lead-123&extra=keep",
      );
    },
  );
  it("accepts direct workspace links and safely falls back for an unknown tab", () => {
    const first = renderAt("/admin/inbox?tab=work&highlight=quote-id");
    expect(
      screen.getByText("work inbox; highlighted quote-id"),
    ).toBeInTheDocument();
    first.unmount();
    renderAt("/admin/inbox?tab=unknown");
    expect(
      screen.getByRole("tab", { name: "All", selected: true }),
    ).toBeInTheDocument();
    expect(screen.getByText("all inbox; highlighted none")).toBeInTheDocument();
  });
});

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import Settings from "@/pages/admin/Settings";
const mock = vi.hoisted(() => ({
  rows: {} as Record<string, Record<string, unknown> | null>,
  save: vi.fn(),
  payload: null as unknown,
  success: vi.fn(),
  failure: vi.fn(),
}));
vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("sonner", () => ({
  toast: { success: mock.success, error: mock.failure },
}));
vi.mock("@/hooks/useSettingsData", () => ({
  useSettingsData: (table: string) => ({
    data: mock.rows[table],
    loading: false,
    error: null,
    refetch: async () => {},
  }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      update: (payload: unknown) => {
        mock.payload = payload;
        return { eq: () => ({ select: () => ({ single: mock.save }) }) };
      },
    }),
  },
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.rows = {
    site_settings: {
      id: "site",
      company_name: "Ascent Group Construction",
      phone: "647-528-6804",
      email: "info@ascentgroupconstruction.com",
      address: "Saved address",
      founded_year: null,
    },
    contact_page_settings: { id: "contact", weekday_hours: "Saved hours" },
    about_page_settings: null,
    footer_settings: null,
  };
  mock.save.mockResolvedValue({ data: { id: "saved" }, error: null });
});
const open = () =>
  render(
    <RouterProvider
      router={createMemoryRouter([{ path: "*", element: <Settings /> }], {
        initialEntries: ["/admin/settings"],
      })}
    />,
  );
describe("settings save and tab guards", () => {
  it("blocks tab changes with unsaved fields and keeps the editor mounted on Stay", async () => {
    open();
    fireEvent.change(screen.getByLabelText("Business Address"), {
      target: { value: "Unsaved address" },
    });
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Contact" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(await screen.findByRole("button", { name: "Stay" }));
    expect(screen.getByLabelText("Business Address")).toHaveValue(
      "Unsaved address",
    );
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Contact" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(await screen.findByRole("button", { name: "Leave" }));
    expect(await screen.findByDisplayValue("Saved hours")).toBeInTheDocument();
  });
  it("does not claim a settings save succeeded when no row was updated", async () => {
    mock.save.mockResolvedValue({ data: null, error: null });
    open();
    fireEvent.change(screen.getByLabelText("Business Address"), {
      target: { value: "Retained address" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save All Settings" }));
    await waitFor(() =>
      expect(mock.failure).toHaveBeenCalledWith(
        expect.stringContaining("could not be verified"),
      ),
    );
    expect(mock.success).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Contact" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(await screen.findByRole("alertdialog")).toBeVisible();
  });
  it("saves a cleared numeric field as null, without inventing a founded year", async () => {
    open();
    expect(screen.getByLabelText("Founded Year")).toHaveDisplayValue("");
    fireEvent.click(screen.getByRole("button", { name: "Save All Settings" }));
    await waitFor(() => expect(mock.success).toHaveBeenCalled());
    expect(mock.payload).toMatchObject({ founded_year: null });
  });
  it("hides Security and offers an explicit Create state for a missing About record", async () => {
    open();
    expect(screen.queryByRole("tab", { name: "Security" })).toBeNull();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "About" }), {
      button: 0,
      ctrlKey: false,
    });
    expect(
      await screen.findByRole("button", { name: "Create settings record" }),
    ).toBeVisible();
    expect(screen.queryByRole("button", { name: "Save Changes" })).toBeNull();
  });
});

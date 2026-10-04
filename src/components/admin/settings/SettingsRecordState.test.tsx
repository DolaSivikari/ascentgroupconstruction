import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsRecordState } from "./SettingsRecordState";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
} from "@/constants/company";
const mock = vi.hoisted(() => ({
  read: vi.fn(),
  create: vi.fn(),
  retry: vi.fn(),
  insert: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        limit: () => query,
        maybeSingle: mock.read,
        single: mock.create,
      };
      return {
        ...query,
        insert: (payload: unknown) => {
          mock.insert(payload);
          return query;
        },
      };
    },
  },
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.read.mockResolvedValue({ data: null, error: null });
  mock.create.mockResolvedValue({
    data: { id: "settings-record" },
    error: null,
  });
});
describe("missing settings records", () => {
  it.each([
    "site_settings",
    "footer_settings",
    "contact_page_settings",
    "about_page_settings",
  ] as const)(
    "creates a %s record without inventing business facts",
    async (table) => {
      render(
        <SettingsRecordState
          table={table}
          loading={false}
          error={null}
          onRetry={mock.retry}
        />,
      );
      expect(screen.getByText(/No settings record yet/)).toBeInTheDocument();
      fireEvent.click(screen.getByText("Create settings record"));
      await waitFor(() => expect(mock.retry).toHaveBeenCalled());
      expect(mock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: true }),
      );
      const payload = mock.insert.mock.calls[0][0];
      if (table === "site_settings")
        expect(payload).toMatchObject({
          company_name: COMPANY_NAME,
          phone: COMPANY_PHONE,
          email: COMPANY_EMAIL,
        });
      for (const [field, value] of Object.entries(payload)) {
        if (!["is_active", "company_name", "phone", "email"].includes(field))
          expect(value).toBeNull();
      }
    },
  );
  it("reuses a row created by another admin", async () => {
    mock.read.mockResolvedValue({ data: { id: "existing" }, error: null });
    render(
      <SettingsRecordState
        table="site_settings"
        loading={false}
        error={null}
        onRetry={mock.retry}
      />,
    );
    fireEvent.click(screen.getByText("Create settings record"));
    await waitFor(() => expect(mock.retry).toHaveBeenCalled());
    expect(mock.insert).not.toHaveBeenCalled();
  });
  it("reports permission errors without claiming creation succeeded", async () => {
    mock.create.mockResolvedValue({
      data: null,
      error: { code: "42501", message: "Denied" },
    });
    render(
      <SettingsRecordState
        table="site_settings"
        loading={false}
        error={null}
        onRetry={mock.retry}
      />,
    );
    fireEvent.click(screen.getByText("Create settings record"));
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
    expect(mock.retry).not.toHaveBeenCalled();
  });
  it("does not offer creation after a failed read", () => {
    render(
      <SettingsRecordState
        table="site_settings"
        loading={false}
        error={new Error("Read denied")}
        onRetry={mock.retry}
      />,
    );
    expect(
      screen.queryByText("Create settings record"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Read denied");
  });
});

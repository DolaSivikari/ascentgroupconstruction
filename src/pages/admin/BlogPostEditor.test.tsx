import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps, ReactNode } from "react";
import BlogPostEditor from "./BlogPostEditor";
const mock = vi.hoisted(() => ({
  load: vi.fn(),
  save: vi.fn(),
  toast: vi.fn(),
  navigate: vi.fn(),
  unsaved: false,
  payload: null as Record<string, unknown> | null,
}));
vi.mock("react-router-dom", async (original) => ({
  ...(await original<typeof import("react-router-dom")>()),
  useNavigate: () => mock.navigate,
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
vi.mock("@/hooks/useUnsavedChanges", () => ({
  useUnsavedChanges: ({
    hasUnsavedChanges,
  }: {
    hasUnsavedChanges: boolean;
  }) => {
    mock.unsaved = hasUnsavedChanges;
    return {
      showDialog: false,
      confirmNavigation: vi.fn(),
      cancelNavigation: vi.fn(),
      markSaved: vi.fn(),
      message: "",
    };
  },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: "admin" } } },
      }),
      getUser: async () => ({ data: { user: { id: "admin" } } }),
    },
    from: () => {
      let saving = false;
      const query = {
        select: () => query,
        eq: () => query,
        single: () => (saving ? mock.save() : mock.load()),
      };
      const write = (payload: Record<string, unknown>) => {
        saving = true;
        mock.payload = payload;
        return query;
      };
      return { ...query, insert: write, update: write };
    },
  },
}));
vi.mock("@/components/admin/ImageUploadField", () => ({
  ImageUploadField: () => null,
}));
vi.mock("@/components/admin/MultiImageUpload", () => ({
  MultiImageUpload: () => null,
}));
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
const row = {
  id: "post-1",
  title: "Fixture article",
  slug: "fixture-article",
  content: "Fixture article content",
  sector: "Buildings",
  source: "Fixture source",
  is_pinned: true,
  read_time_minutes: 7,
  publish_state: "draft",
};
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  mock.payload = null;
  mock.unsaved = false;
  mock.load.mockResolvedValue({ data: row, error: null });
  mock.save.mockResolvedValue({ data: { id: "post-1" }, error: null });
});
afterEach(cleanup);
const open = (id = "post-1") =>
  render(
    <MemoryRouter initialEntries={[`/admin/blog/${id}`]}>
      <Routes>
        <Route path="/admin/blog/:id" element={<BlogPostEditor />} />
      </Routes>
    </MemoryRouter>,
  );
describe("blog form save contract", () => {
  it("uses native form validation from the header Save button", () => {
    open("new");
    fireEvent.click(
      screen.getByRole("button", { name: /Save draft|Save & publish/ }),
    );
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.navigate).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /Save draft|Save & publish/ }),
    ).toHaveAttribute("form", "blog-editor-form");
  });
  it("saves the existing sector, attribution and pin flag and normalizes an empty read time", async () => {
    open();
    await screen.findByDisplayValue("Fixture article");
    fireEvent.change(screen.getByLabelText("Read Time (minutes)"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: " Façade / Repair?! " },
    });
    expect(screen.getByLabelText("Slug")).toHaveValue("facade-repair");
    fireEvent.click(
      screen.getByRole("button", { name: /Save draft|Save & publish/ }),
    );
    await waitFor(() => expect(mock.save).toHaveBeenCalled());
    expect(mock.payload).toMatchObject({
      sector: "Buildings",
      source: "Fixture source",
      is_pinned: true,
      read_time_minutes: null,
      slug: "facade-repair",
    });
  });
  it("keeps all edits dirty on a failed save and gives a duplicate-value reason", async () => {
    mock.save.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate" },
    });
    open();
    await screen.findByDisplayValue("Fixture article");
    fireEvent.change(screen.getByLabelText("Source Attribution"), {
      target: { value: "Edited source" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Save draft|Save & publish/ }),
    );
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.stringContaining("already in use"),
        }),
      ),
    );
    expect(mock.unsaved).toBe(true);
    expect(screen.getByLabelText("Source Attribution")).toHaveValue(
      "Edited source",
    );
    expect(mock.navigate).not.toHaveBeenCalled();
  });
});

vi.mock("@/hooks/useSlugAvailability", () => ({
  useSlugAvailability: () => ({
    checking: false,
    available: true,
    message: "Slug available",
  }),
}));

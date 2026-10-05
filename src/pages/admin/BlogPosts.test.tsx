import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import BlogPosts from "./BlogPosts";
const mock = vi.hoisted(() => ({ preview: vi.fn(), toast: vi.fn() }));
vi.mock("@/lib/admin/contentPreview", () => ({
  savePreviewLink: mock.preview,
}));
vi.mock("sonner", () => ({ toast: { error: mock.toast, success: vi.fn() } }));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminAuth: () => ({ isAdmin: true, isLoading: false }),
}));
vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: async () => ({
          data: [
            {
              id: "draft-post",
              title: "Fixture draft",
              slug: "fixture-draft",
              publish_state: "draft",
            },
          ],
          error: null,
        }),
      }),
    }),
  },
}));
beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("blog list preview", () => {
  it("opens only after the preview link has been persisted", async () => {
    let resolve!: (value: string) => void;
    mock.preview.mockImplementation(
      () =>
        new Promise<string>((done) => {
          resolve = done;
        }),
    );
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(
      <MemoryRouter>
        <BlogPosts />
      </MemoryRouter>,
    );
    await screen.findByText("Fixture draft");
    fireEvent.keyDown(
      screen.getByRole("button", { name: "Actions for Fixture draft" }),
      { key: "Enter" },
    );
    fireEvent.click(await screen.findByRole("menuitem", { name: "Preview" }));
    expect(mock.preview).toHaveBeenCalledWith(
      "blog_posts",
      "draft-post",
      "fixture-draft",
    );
    expect(open).not.toHaveBeenCalled();
    resolve("/blog/fixture-draft?preview=true&token=saved");
    await waitFor(() =>
      expect(open).toHaveBeenCalledWith(
        "/blog/fixture-draft?preview=true&token=saved",
        "_blank",
        "noopener,noreferrer",
      ),
    );
  });
  it("does not open a broken tab on a failed token save", async () => {
    mock.preview.mockRejectedValue({ code: "42501", message: "Denied" });
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(
      <MemoryRouter>
        <BlogPosts />
      </MemoryRouter>,
    );
    await screen.findByText("Fixture draft");
    fireEvent.keyDown(
      screen.getByRole("button", { name: "Actions for Fixture draft" }),
      { key: "Enter" },
    );
    fireEvent.click(await screen.findByRole("menuitem", { name: "Preview" }));
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith(
        expect.stringContaining("permission"),
      ),
    );
    expect(open).not.toHaveBeenCalled();
  });
});

import { useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMemoryRouter,
  RouterProvider,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "./AdminSectionWorkspace";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "./ConfirmDialog";
import { validateSectionForm } from "@/lib/admin/sectionValidation";

const save = vi.fn();
function Workspace() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const guard = useUnsavedChanges({
    hasUnsavedChanges: !!(title || body),
    preserveDraftQueryKeys: ["section"],
  });
  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (validateSectionForm(event.currentTarget, navigate)) save();
        }}
      >
        <AdminSectionWorkspace
          items={[
            { id: "overview", title: "Overview" },
            { id: "content", title: "Content" },
          ]}
        >
          <AdminSectionScreen id="overview" title="Overview">
            <label>
              Title
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
          </AdminSectionScreen>
          <AdminSectionScreen id="content" title="Content">
            <label>
              Body
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </label>
          </AdminSectionScreen>
        </AdminSectionWorkspace>
        <button>Save</button>
      </form>
      <Link to="?tab=contact">Other settings</Link>
      <Link to="?tab=about&record=other&section=content">Other record</Link>
      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={guard.cancelNavigation}
        onConfirm={guard.confirmNavigation}
        title="Unsaved changes"
        description={guard.message}
        confirmText="Leave"
        cancelText="Stay"
      />
    </>
  );
}
function open(url = "/settings?tab=about") {
  const router = createMemoryRouter(
    [{ path: "/settings", element: <Workspace /> }],
    { initialEntries: [url] },
  );
  render(<RouterProvider router={router} />);
  return router;
}
afterEach(() => {
  cleanup();
  save.mockClear();
});
describe("Admin section screens", () => {
  it("keeps drafts mounted across section links and browser Back, while preserving the parent URL", async () => {
    const router = open();
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Keep this title" },
    });
    fireEvent.click(screen.getByRole("link", { name: "Content" }));
    await waitFor(() =>
      expect(router.state.location.search).toBe("?tab=about&section=content"),
    );
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(screen.getByLabelText("Title")).not.toBeVisible();
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "Keep this content" },
    });
    await router.navigate(-1);
    await waitFor(() => expect(screen.getByLabelText("Title")).toBeVisible());
    expect(screen.getByLabelText("Title")).toHaveValue("Keep this title");
    expect(screen.getByLabelText("Body")).toHaveValue("Keep this content");
    expect(screen.getByLabelText("Body")).not.toBeVisible();
  });
  it.each(["Other settings", "Other record"])(
    "still guards leaving the draft through %s",
    async (name) => {
      open();
      fireEvent.change(screen.getByLabelText("Title"), {
        target: { value: "Retain me" },
      });
      fireEvent.click(screen.getByRole("link", { name }));
      expect(await screen.findByRole("alertdialog")).toBeVisible();
      fireEvent.click(screen.getByRole("button", { name: "Stay" }));
      expect(screen.getByLabelText("Title")).toHaveValue("Retain me");
    },
  );
  it("opens a section directly, supports the mobile selector, and falls back for unknown sections", async () => {
    const router = open("/settings?tab=about&section=content");
    expect(screen.getByLabelText("Body")).toBeVisible();
    expect(screen.getByLabelText("Title")).not.toBeVisible();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Editor sections" }),
      {
        target: { value: "overview" },
      },
    );
    await waitFor(() => expect(screen.getByLabelText("Title")).toBeVisible());
    await router.navigate("?tab=about&section=missing");
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
        "aria-current",
        "page",
      ),
    );
  });
  it("blocks saving invalid hidden fields, reveals their screen, and focuses the field", async () => {
    const router = open("/settings?tab=about&section=content");
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "Draft text" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(router.state.location.search).toBe("?tab=about&section=overview"),
    );
    expect(save).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByLabelText("Title")).toHaveFocus());
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Valid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(save).toHaveBeenCalledOnce();
  });
});

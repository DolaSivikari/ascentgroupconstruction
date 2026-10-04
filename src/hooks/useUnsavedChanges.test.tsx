import { useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  createMemoryRouter,
  Link,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useUnsavedChanges } from "./useUnsavedChanges";

function Editor() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const guard = useUnsavedChanges({ hasUnsavedChanges: !!value });
  return (
    <>
      <label>
        Draft
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate("/destination?tab=leads#selected")}>
        Cancel editing
      </button>
      <Link to="/destination?tab=leads#selected">Sidebar destination</Link>
      <button onClick={() => guard.requestDiscard(() => setValue(""))}>
        Discard fields
      </button>
      <button
        onClick={() => {
          setValue("");
          guard.markSaved();
          navigate("/destination?saved=true");
        }}
      >
        Save and leave
      </button>
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
function Destination() {
  const location = useLocation();
  return <output>{location.pathname + location.search + location.hash}</output>;
}
const open = () =>
  render(
    <RouterProvider
      router={createMemoryRouter(
        [
          { path: "/edit", element: <Editor /> },
          { path: "/destination", element: <Destination /> },
        ],
        { initialEntries: ["/destination?origin=back", "/edit"] },
      )}
    />,
  );
afterEach(cleanup);
describe("React Router unsaved editing guard", () => {
  it.each(["Cancel editing", "Sidebar destination"])(
    "blocks %s and preserves edits on Stay and the full target on Leave",
    async (name) => {
      open();
      fireEvent.change(screen.getByLabelText("Draft"), {
        target: { value: "Retain this edit" },
      });
      fireEvent.click(screen.getByText(name));
      expect(await screen.findByRole("alertdialog")).toBeVisible();
      fireEvent.click(screen.getByRole("button", { name: "Stay" }));
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
      expect(screen.getByLabelText("Draft")).toHaveValue("Retain this edit");
      fireEvent.click(screen.getByText(name));
      fireEvent.click(await screen.findByRole("button", { name: "Leave" }));
      expect(
        await screen.findByText("/destination?tab=leads#selected"),
      ).toBeInTheDocument();
    },
  );
  it("blocks browser-history navigation and supports a local Cancel action", async () => {
    open();
    fireEvent.change(screen.getByLabelText("Draft"), {
      target: { value: "Local edit" },
    });
    fireEvent.click(screen.getByText("Back"));
    fireEvent.click(await screen.findByRole("button", { name: "Stay" }));
    fireEvent.click(screen.getByText("Discard fields"));
    fireEvent.click(await screen.findByRole("button", { name: "Stay" }));
    expect(screen.getByLabelText("Draft")).toHaveValue("Local edit");
    fireEvent.click(screen.getByText("Back"));
    fireEvent.click(await screen.findByRole("button", { name: "Leave" }));
    expect(
      await screen.findByText("/destination?origin=back"),
    ).toBeInTheDocument();
  });
  it("allows navigation immediately after a successful save", async () => {
    open();
    fireEvent.change(screen.getByLabelText("Draft"), {
      target: { value: "Saved edit" },
    });
    fireEvent.click(screen.getByText("Save and leave"));
    expect(
      await screen.findByText("/destination?saved=true"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
  it("retains reload/close protection only while dirty", () => {
    open();
    const clean = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(clean);
    expect(clean.defaultPrevented).toBe(false);
    fireEvent.change(screen.getByLabelText("Draft"), {
      target: { value: "Unsaved" },
    });
    const dirty = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(dirty);
    expect(dirty.defaultPrevented).toBe(true);
  });
});

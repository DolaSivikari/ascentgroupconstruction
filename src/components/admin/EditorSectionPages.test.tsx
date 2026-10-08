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
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { EditorSectionPages } from "./EditorSectionPages";
import { ConfirmDialog } from "./ConfirmDialog";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const base = "/admin/projects/fixture";
function PendingImage() {
  const [caption, setCaption] = useState("");
  return (
    <label>
      Pending image caption
      <input
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
    </label>
  );
}
function Editor() {
  const [title, setTitle] = useState("Existing project");
  const guard = useUnsavedChanges({
    hasUnsavedChanges: title !== "Existing project",
    preserveDraftPaths: [base, `${base}/overview`, `${base}/images`],
  });
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <output>{location.pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Forward
      </button>
      <EditorSectionPages
        basePath={base}
        sections={[
          {
            id: "overview",
            path: "overview",
            title: "Overview",
            content: (
              <label>
                Project title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            ),
          },
          {
            id: "images",
            path: "images",
            title: "Images",
            content: <PendingImage />,
          },
        ]}
      />
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
const open = (path = base) =>
  render(
    <RouterProvider
      router={createMemoryRouter(
        [
          { path: "/admin/projects/fixture/:section?", element: <Editor /> },
          { path: "/admin/projects", element: <p>Projects list</p> },
        ],
        { initialEntries: [path] },
      )}
    />,
  );
afterEach(cleanup);

describe("project section screens", () => {
  it("shows one screen, preserves form and pending-image state through links and Back/Forward, and protects leaving the project", async () => {
    open();
    fireEvent.change(screen.getByRole("textbox", { name: "Project title" }), {
      target: { value: "Unsaved title" },
    });
    fireEvent.click(screen.getByRole("link", { name: "Images" }));
    expect(
      await screen.findByRole("heading", { name: "Images" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Project title" })).toBeNull();
    expect(screen.queryByRole("alertdialog")).toBeNull();
    fireEvent.change(
      screen.getByRole("textbox", { name: "Pending image caption" }),
      { target: { value: "Pending caption" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(
      await screen.findByRole("textbox", { name: "Project title" }),
    ).toHaveValue("Unsaved title");
    fireEvent.click(screen.getByRole("button", { name: "Forward" }));
    expect(
      await screen.findByRole("textbox", { name: "Pending image caption" }),
    ).toHaveValue("Pending caption");
    fireEvent.click(screen.getByRole("link", { name: /All projects/ }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stay" }));
    expect(
      screen.getByRole("textbox", { name: "Pending image caption" }),
    ).toHaveValue("Pending caption");
    fireEvent.click(screen.getByRole("link", { name: /All projects/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Leave" }));
    expect(await screen.findByText("Projects list")).toBeInTheDocument();
  });
  it("opens a section directly and supports the mobile section selector", async () => {
    open(`${base}/images`);
    expect(screen.getByRole("heading", { name: "Images" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Images" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Project section" }),
      { target: { value: "overview" } },
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Overview" })).toHaveFocus(),
    );
    expect(screen.getByRole("textbox", { name: "Project title" })).toHaveValue(
      "Existing project",
    );
  });
  it("gives an unknown section a recovery link without showing every section", () => {
    open(`${base}/unknown`);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Project section not found",
    );
    expect(
      screen.getByRole("link", { name: "Go to Overview" }),
    ).toHaveAttribute("href", `${base}/overview`);
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});

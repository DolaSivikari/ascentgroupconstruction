import { act } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectEditor from "./ProjectEditor";
import type { ProjectFormData } from "@/lib/admin/projectEditor";

const mock = vi.hoisted(() => ({
  load: vi.fn(), update: vi.fn(), insert: vi.fn(), joins: vi.fn(), saveJoins: vi.fn(), cleanup: vi.fn(), toast: vi.fn(), navigate: vi.fn(), unsaved: false,
}));
vi.mock("react-router-dom", async (original) => ({ ...(await original<typeof import("react-router-dom")>()), useNavigate: () => mock.navigate }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: () => {
    const query = { select: (columns: string) => columns === "id, slug" ? { eq: async () => ({ data: [], error: null }) } : query,
      eq: () => query, single: mock.load };
    return { ...query,
      update: (value: unknown) => ({ eq: (column: string, id: string) => ({ select: () => ({ single: () => mock.update(value, column, id) }) }) }),
      insert: (value: unknown) => ({ select: () => ({ single: () => mock.insert(value) }) }),
    };
  },
  auth: { getUser: async () => ({ data: { user: { id: "fixture-admin" } }, error: null }) },
} }));
vi.mock("@/lib/admin/projectPersistence", () => ({ loadProjectRelationships: mock.joins, saveProjectRelationships: mock.saveJoins, removeSavedGalleryFiles: mock.cleanup }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mock.toast }) }));
vi.mock("@/hooks/useUnsavedChanges", () => ({ useUnsavedChanges: ({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) => {
  mock.unsaved = hasUnsavedChanges; return { showDialog: false, cancelNavigation: vi.fn(), confirmNavigation: vi.fn(), message: "", markSaved: vi.fn() };
} }));
vi.mock("@/hooks/useFormCompletion", () => ({ useFormCompletion: () => ({ tabs: {}, overall: { percentage: 0 } }) }));
vi.mock("@/components/admin/CompletionChecklist", () => ({ CompletionChecklist: () => null }));
vi.mock("@/components/admin/project-tabs/BasicInfoTab", () => ({ BasicInfoTab: ({ formData, onFormChange }: { formData: ProjectFormData; onFormChange: (updates: Partial<ProjectFormData>) => void }) => <label>Project title<input value={formData.title} onChange={(event) => onFormChange({ title: event.target.value })} /></label> }));
vi.mock("@/components/admin/project-tabs/ImagesTab", () => ({ ImagesTab: () => null }));
vi.mock("@/components/admin/project-tabs/ProjectDetailsTab", () => ({ ProjectDetailsTab: () => null }));
vi.mock("@/components/admin/project-tabs/ServicesTab", () => ({ ServicesTab: () => null }));
vi.mock("@/components/admin/project-tabs/MetricsTab", () => ({ MetricsTab: () => null }));
vi.mock("@/components/admin/project-tabs/SEOTab", () => ({ SEOTab: () => null }));

const related = { images: [{ id: "stored-image", url: "https://assets.example.test/image.jpg", category: "gallery", order: 0, featured: false }], serviceIds: ["stored-service"] };
beforeEach(() => {
  vi.clearAllMocks(); localStorage.clear(); mock.unsaved = false;
  mock.load.mockResolvedValue({ data: { id: "project-1", title: "Fixture project", slug: "fixture-project", publish_state: "draft" }, error: null });
  mock.update.mockResolvedValue({ data: { id: "project-1" }, error: null }); mock.insert.mockResolvedValue({ data: { id: "created-project" }, error: null });
  mock.joins.mockResolvedValue(related); mock.saveJoins.mockResolvedValue(related); mock.cleanup.mockResolvedValue(null);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });
const open = (id = "project-1") => render(<MemoryRouter initialEntries={[`/admin/projects/${id}`]}><Routes><Route path="/admin/projects/:id" element={<ProjectEditor />} /></Routes></MemoryRouter>);
describe("safe project-editor saves", () => {
  it("blocks editing, manual saving and autosave when relationship loading fails, then permits retry", async () => {
    vi.useFakeTimers(); mock.joins.mockRejectedValue(new Error("Could not load project services"));
    open(); await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByRole("alert")).toHaveTextContent("Editing is unavailable");
    expect(screen.queryByLabelText("Project title")).not.toBeInTheDocument(); expect(screen.getByRole("button", { name: "Save Project" })).toBeDisabled();
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(mock.update).not.toHaveBeenCalled(); expect(mock.saveJoins).not.toHaveBeenCalled();
    mock.joins.mockResolvedValue(related); fireEvent.click(screen.getByRole("button", { name: "Retry loading project" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByLabelText("Project title")).toHaveValue("Fixture project"); expect(screen.getByRole("button", { name: "Save Project" })).toBeEnabled();
  });
  it("retains unsaved edits and shows no Success after a relationship write failure", async () => {
    mock.saveJoins.mockRejectedValue(new Error("Could not add project services")); open(); await screen.findByLabelText("Project title");
    fireEvent.change(screen.getByLabelText("Project title"), { target: { value: "Unsaved fixture edit" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Project" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("full save is incomplete");
    expect(screen.getByLabelText("Project title")).toHaveValue("Unsaved fixture edit"); expect(mock.unsaved).toBe(true);
    expect(mock.toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Success" }));
    expect(mock.saveJoins).toHaveBeenCalledWith("project-1", related, related); expect(mock.cleanup).not.toHaveBeenCalled();
  });
  it("retries a partially created project using its saved ID instead of inserting it again", async () => {
    mock.saveJoins.mockRejectedValueOnce(new Error("Fixture relationship failure"));
    mock.update.mockResolvedValue({ data: { id: "created-project" }, error: null });
    open("new");
    fireEvent.change(screen.getByLabelText("Project title"), { target: { value: "New fixture project" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Project" })); await screen.findByRole("alert");
    expect(mock.insert).toHaveBeenCalledOnce(); expect(mock.navigate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Save Project" }));
    await waitFor(() => expect(mock.navigate).toHaveBeenCalledWith("/admin/projects/created-project"));
    expect(mock.insert).toHaveBeenCalledOnce(); expect(mock.update).toHaveBeenCalledWith(expect.any(Object), "id", "created-project");
  });
  it("autosaves published-project edits on this device without any database write", async () => {
    vi.useFakeTimers(); mock.load.mockResolvedValue({ data: { id: "project-1", title: "Fixture project", slug: "fixture-project", publish_state: "published" }, error: null });
    open(); await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    fireEvent.change(screen.getByLabelText("Project title"), { target: { value: "Unsaved local edit" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
    expect(mock.update).not.toHaveBeenCalled(); expect(mock.saveJoins).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("project-draft-project-1")!).data.title).toBe("Unsaved local edit");
    expect(screen.getByText(/Draft saved on this device/)).toBeInTheDocument(); expect(mock.unsaved).toBe(true);
  });
  it("offers a local draft without silently replacing the saved project", async () => {
    localStorage.setItem("project-draft-project-1", JSON.stringify({ timestamp: new Date().toISOString(), data: { title: "Restorable edit", slug: "fixture-project", project_images: [], service_ids: [] } }));
    open(); await screen.findByLabelText("Project title");
    expect(screen.getByLabelText("Project title")).toHaveValue("Fixture project");
    fireEvent.click(screen.getByRole("button", { name: "Restore unsaved changes" }));
    expect(screen.getByLabelText("Project title")).toHaveValue("Restorable edit"); expect(mock.unsaved).toBe(true); expect(mock.update).not.toHaveBeenCalled();
  });
  it("clears the local draft only after a successful complete save", async () => {
    open(); await screen.findByLabelText("Project title");
    fireEvent.change(screen.getByLabelText("Project title"), { target: { value: "Explicitly saved edit" } });
    expect(localStorage.getItem("project-draft-project-1")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Save Project" }));
    await waitFor(() => expect(mock.cleanup).toHaveBeenCalled());
    await waitFor(() => expect(localStorage.getItem("project-draft-project-1")).toBeNull());
    expect(mock.unsaved).toBe(false);
  });
});

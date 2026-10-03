import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ComponentProps, ReactNode } from "react";
import ServiceEditor from "./ServiceEditor";

const mock = vi.hoisted(() => ({
  load: vi.fn(), update: vi.fn(), insert: vi.fn(), toast: vi.fn(), navigate: vi.fn(), unsaved: false,
}));
vi.mock("react-router-dom", async (original) => ({ ...(await original<typeof import("react-router-dom")>()), useNavigate: () => mock.navigate }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: () => ({ select: () => ({ eq: () => ({ single: mock.load }) }), update: (data: unknown) => ({ eq: (column: string, id: string) => mock.update(data, column, id) }), insert: mock.insert }),
  auth: { getUser: async () => ({ data: { user: { id: "fixture-admin" } }, error: null }) },
} }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mock.toast }) }));
vi.mock("@/hooks/useUnsavedChanges", () => ({ useUnsavedChanges: ({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) => {
  mock.unsaved = hasUnsavedChanges;
  return { showDialog: false, confirmNavigation: vi.fn(), cancelNavigation: vi.fn(), message: "" };
} }));
vi.mock("@/components/admin/ImageUploadField", () => ({ ImageUploadField: ({ value, onChange }: { value: string; onChange: (url: string) => void }) => <div><span data-testid="image-preview">{value}</span><button type="button" onClick={() => onChange("https://assets.example.test/upload.jpg")}>Upload fixture</button><button type="button" onClick={() => onChange("")}>Clear image</button></div> }));
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: { children: ReactNode; value: string; onValueChange: (value: string) => void }) => <select aria-label="Publishing status" value={value} onChange={(event) => onValueChange(event.target.value)}>{children}</select>,
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>, SelectItem: (props: ComponentProps<"option">) => <option {...props} />, SelectTrigger: () => null, SelectValue: () => null,
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks(); mock.unsaved = false;
  mock.load.mockResolvedValue({ data: { id: "service-1", name: "Fixture service", slug: "fixture-service", featured_image: "https://assets.example.test/current.jpg", publish_state: "published" }, error: null });
  mock.update.mockResolvedValue({ error: null }); mock.insert.mockResolvedValue({ error: null });
});
const open = (id = "service-1") => render(<MemoryRouter initialEntries={[`/admin/services/${id}`]}><Routes><Route path="/admin/services/:id" element={<ServiceEditor />} /></Routes></MemoryRouter>);
const ready = async () => { open(); await screen.findByDisplayValue("Fixture service"); };
describe("service featured-image editing", () => {
  it("loads and preserves the stored image on an existing-service save", async () => {
    await ready();
    expect(screen.getByTestId("image-preview")).toHaveTextContent("https://assets.example.test/current.jpg");
    fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(expect.objectContaining({ featured_image: "https://assets.example.test/current.jpg" }), "id", "service-1"));
  });
  it("writes the uploaded image URL and clears the field as null", async () => {
    await ready(); fireEvent.click(screen.getByRole("button", { name: "Upload fixture" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(expect.objectContaining({ featured_image: "https://assets.example.test/upload.jpg" }), "id", "service-1"));
    await screen.findByRole("button", { name: "Save Service" });
    fireEvent.click(screen.getByRole("button", { name: "Clear image" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.update).toHaveBeenLastCalledWith(expect.objectContaining({ featured_image: null }), "id", "service-1"));
  });
  it("warns on an existing source path and rejects it before any write", async () => {
    mock.load.mockResolvedValue({ data: { name: "Fixture service", slug: "fixture-service", featured_image: "/src/assets/legacy.jpg" }, error: null });
    await ready(); expect(screen.getByRole("alert")).toHaveTextContent("will not work after publishing");
    fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    expect(mock.update).not.toHaveBeenCalled(); expect(mock.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Invalid image URL" }));
  });
  it("rejects executable and protocol-relative URLs; accepts a public asset path", async () => {
    await ready();
    for (const value of ["javascript:alert(1)", "//assets.example.test/image.jpg"]) {
      fireEvent.change(screen.getByLabelText("Image URL"), { target: { value } }); fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
      expect(mock.update).not.toHaveBeenCalled();
    }
    fireEvent.change(screen.getByLabelText("Image URL"), { target: { value: "/public-photo.webp" } }); fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.update).toHaveBeenCalledWith(expect.objectContaining({ featured_image: "/public-photo.webp" }), "id", "service-1"));
  });
  it("keeps unsaved-change protection and stays in the editor after a failed save", async () => {
    await ready(); mock.update.mockResolvedValue({ error: { message: "Fixture write failure" } });
    fireEvent.change(screen.getByLabelText("Image URL"), { target: { value: "/new-photo.webp" } }); fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.toast).toHaveBeenCalledWith(expect.objectContaining({ description: "Fixture write failure", variant: "destructive" })));
    expect(mock.navigate).not.toHaveBeenCalled(); expect(mock.unsaved).toBe(true);
  });
  it("includes a featured image in the create contract", async () => {
    open("new"); fireEvent.change(screen.getByLabelText("Service Name *"), { target: { value: "New fixture" } }); fireEvent.change(screen.getByLabelText("Slug *"), { target: { value: "new-fixture" } });
    fireEvent.change(screen.getByLabelText("Image URL"), { target: { value: "/new-photo.webp" } }); fireEvent.click(screen.getByRole("button", { name: "Save Service" }));
    await waitFor(() => expect(mock.insert).toHaveBeenCalledWith([expect.objectContaining({ featured_image: "/new-photo.webp", created_by: "fixture-admin" })]));
  });
});

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import type { ReactNode } from "react";
import DocumentsLibrary from "@/pages/admin/DocumentsLibrary";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import { FeaturedServicesManager } from "./FeaturedServicesManager";
import { ServicesListManager } from "./ServicesListManager";
import { WhyChooseUsManager } from "./WhyChooseUsManager";

const mock = vi.hoisted(() => ({
  rows: {} as Record<string, unknown[]>, remove: vi.fn(), deleteRow: vi.fn(), toast: vi.fn(), success: vi.fn(), error: vi.fn(),
  featuredDelete: vi.fn(), serviceDelete: vi.fn(), whyDelete: vi.fn(),
}));
vi.mock("@/hooks/useAdminAuth", () => ({ useAdminAuth: () => ({ isLoading: false, isAdmin: true }) }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mock.toast }) }));
vi.mock("sonner", () => ({ toast: { success: mock.success, error: mock.error } }));
vi.mock("@/components/admin/AdminPageLayout", () => ({ AdminPageLayout: ({ children, actions, title }: { children: ReactNode; actions?: ReactNode; title: string }) => <section><h1>{title}</h1>{actions}{children}</section> }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: (table: string) => {
    const query = { select: () => query, order: () => query, then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: mock.rows[table] || [], error: null }).then(resolve) };
    return { ...query, delete: () => ({ eq: (column: string, id: string) => mock.deleteRow(table, column, id) }) };
  },
  storage: { from: (bucket: string) => ({ remove: (paths: string[]) => mock.remove(bucket, paths) }) },
} }));
vi.mock("@/hooks/useFeaturedServices", () => ({ useFeaturedServicesAdmin: () => ({ allFeaturedServices: [{ id: "featured-1", service_name: "Fixture featured", service_link: "/services/fixture", is_active: true, display_order: 0 }], isLoading: false, createFeaturedService: vi.fn(), updateFeaturedService: vi.fn(), deleteFeaturedService: mock.featuredDelete }) }));
vi.mock("@/hooks/useServicesAdmin", () => ({ useServicesAdmin: () => ({ services: [{ id: "service-1", name: "Fixture service", publish_state: "draft" }], isLoading: false, deleteService: { mutate: mock.serviceDelete, isPending: false } }) }));
vi.mock("@/hooks/useWhyChooseUsAdmin", () => ({ useWhyChooseUsAdmin: () => ({ items: [{ id: "why-1", title: "Fixture item", description: "Fixture description", is_active: true }], isLoading: false, createItem: { mutateAsync: vi.fn() }, updateItem: { mutate: vi.fn() }, deleteItem: { mutate: mock.whyDelete, isPending: false }, reorderItems: { mutate: vi.fn() } }) }));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.rows = {
    documents_library: [{ id: "document-1", title: "Fixture document", category: "other", file_url: "https://assets.example.test/storage/v1/object/public/documents/fixture.pdf", file_name: "fixture.pdf", is_active: true, version: "1", download_count: 0 }],
    email_templates: [{ id: "template-1", name: "Fixture template", subject: "Fixture subject", category: "general", is_active: true }],
  };
  mock.deleteRow.mockImplementation(async (table: string) => { mock.rows[table] = []; return { error: null }; });
  mock.remove.mockResolvedValue({ error: null });
});
const cases = [
  { name: "documents", component: DocumentsLibrary, button: "Delete Fixture document", check: () => expect(mock.deleteRow).toHaveBeenCalledWith("documents_library", "id", "document-1") },
  { name: "email templates", component: EmailTemplates, button: "Delete", check: () => expect(mock.deleteRow).toHaveBeenCalledWith("email_templates", "id", "template-1") },
  { name: "featured services", component: FeaturedServicesManager, button: "Delete Fixture featured", check: () => expect(mock.featuredDelete).toHaveBeenCalledWith("featured-1", expect.any(Object)) },
  { name: "services", component: ServicesListManager, button: "Delete Fixture service", check: () => expect(mock.serviceDelete).toHaveBeenCalledWith("service-1") },
  { name: "why choose us", component: WhyChooseUsManager, button: "Delete Fixture item", check: () => expect(mock.whyDelete).toHaveBeenCalledWith("why-1") },
];
describe("admin delete confirmation", () => {
  it.each(cases)("requires confirmation and supports cancellation for $name", async ({ component: Component, button, check }) => {
    render(<RouterProvider router={createMemoryRouter([{ path: "*", element: <Component /> }])} />);
    fireEvent.click(await screen.findByRole("button", { name: button }));
    expect(await screen.findByRole("alertdialog")).toBeVisible();
    expect(mock.deleteRow).not.toHaveBeenCalled(); expect(mock.featuredDelete).not.toHaveBeenCalled(); expect(mock.serviceDelete).not.toHaveBeenCalled(); expect(mock.whyDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(mock.deleteRow).not.toHaveBeenCalled(); expect(mock.featuredDelete).not.toHaveBeenCalled(); expect(mock.serviceDelete).not.toHaveBeenCalled(); expect(mock.whyDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: button }));
    const dialog = await screen.findByRole("alertdialog");
    fireEvent.click(dialog.querySelector('button:last-child')!);
    await waitFor(check);
  });
  it("waits for mutation success before reporting a featured-service deletion", async () => {
    render(<RouterProvider router={createMemoryRouter([{ path: "*", element: <FeaturedServicesManager /> }])} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete Fixture featured" }));
    fireEvent.click(screen.getByRole("button", { name: /^Delete$/ }));
    expect(mock.success).not.toHaveBeenCalled();
    const callbacks = mock.featuredDelete.mock.calls[0][1];
    callbacks.onError(new Error("Fixture mutation failure"));
    expect(mock.error).toHaveBeenCalledWith("Failed to delete featured service"); expect(mock.success).not.toHaveBeenCalled();
  });
  it("reports partial document cleanup after a record is deleted but storage fails", async () => {
    mock.remove.mockResolvedValue({ error: { message: "Fixture storage failure" } });
    render(<RouterProvider router={createMemoryRouter([{ path: "*", element: <DocumentsLibrary /> }])} />);
    fireEvent.click(await screen.findByRole("button", { name: "Delete Fixture document" })); fireEvent.click(screen.getByRole("button", { name: /^Delete$/ }));
    await waitFor(() => expect(mock.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Document record deleted", description: expect.stringContaining("stored file could not be removed"), variant: "destructive" })));
    expect(mock.remove).toHaveBeenCalledWith("documents", ["fixture.pdf"]);
    expect(mock.toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Success" }));
  });
  it("preserves the record and reports an error when document deletion fails", async () => {
    mock.deleteRow.mockResolvedValue({ error: { message: "Fixture delete failure" } });
    render(<RouterProvider router={createMemoryRouter([{ path: "*", element: <DocumentsLibrary /> }])} />);
    fireEvent.click(await screen.findByRole("button", { name: "Delete Fixture document" })); fireEvent.click(screen.getByRole("button", { name: /^Delete$/ }));
    await waitFor(() => expect(mock.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Error", description: "Fixture delete failure" })));
    expect(mock.remove).not.toHaveBeenCalled(); expect(screen.getByText("Fixture document")).toBeInTheDocument();
  });
});

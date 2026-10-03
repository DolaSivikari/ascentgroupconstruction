import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import PageHeaders from "./PageHeaders";
import type { HeaderMetadata } from "@/data/page-headers";
import { SERVICE_REGISTRY } from "@/data/service-registry";

const mock = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock("@/lib/admin/pageHeaders", () => ({ loadHeaderMetadata: mock.load }));
const clients: QueryClient[] = [];

function metadata(): HeaderMetadata {
  return {
    services: SERVICE_REGISTRY.filter(service => service.source === "db").map(service => ({
      id: `id-${service.slug}`, slug: service.slug, name: service.navLabel,
      category: service.category, featured_image: null,
    })),
    projects: [], articles: [], slides: [], failed: [],
  };
}
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><MemoryRouter initialEntries={["/admin/page-headers"]}><PageHeaders /></MemoryRouter></QueryClientProvider>);
  return client;
}
function pageRow(path: string): HTMLTableRowElement {
  const row = screen.getByText(path).closest("tr");
  if (!row) throw new Error(`Missing inventory row for ${path}`);
  return row;
}
beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); });

describe("page-header administration", () => {
  it("keeps an open shared-image preview usable when a metadata refresh replaces that image", async () => {
    const initial = metadata();
    const sharedSlugs = ["building-envelope-solutions", "interior-buildouts-finishing"];
    for (const service of initial.services) if (sharedSlugs.includes(service.slug)) service.featured_image = "/media/shared-original.jpg";
    mock.load.mockResolvedValueOnce(initial);
    const client = mount();
    await waitFor(() => expect(screen.getByText("Canonical page inventory:", { exact: false })).toHaveTextContent("68 pages"));
    const envelopeRow = pageRow("/services/building-envelope-solutions");
    expect(within(envelopeRow).getByText("Shared by 2 pages")).toBeInTheDocument();
    fireEvent.click(within(envelopeRow).getByRole("button", { name: "Preview" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Also used on:", { exact: false })).toHaveTextContent("/services/interior-buildouts-finishing");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/media/shared-original.jpg");

    const updated = metadata();
    updated.services.find(service => service.slug === "building-envelope-solutions")!.featured_image = "/media/replacement-envelope.jpg";
    mock.load.mockResolvedValueOnce(updated);
    // Real query refresh represents refetching while the modal is open, including focus-driven updates.
    await act(async () => { await client.invalidateQueries({ queryKey: ["page-header-inventory"] }); });
    await waitFor(() => expect(mock.load).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/media/shared-original.jpg");
    expect(within(dialog).queryByText("Also used on:", { exact: false })).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    const currentRow = pageRow("/services/building-envelope-solutions");
    expect(within(currentRow).queryByText("Shared by 2 pages")).not.toBeInTheDocument();
    expect(within(currentRow).getByRole("link", { name: "Open editor" })).toHaveAttribute("href", "/admin/services/id-building-envelope-solutions");
    mock.load.mockResolvedValueOnce(updated);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(mock.load).toHaveBeenCalledTimes(3));
    expect(screen.getByRole("button", { name: "Refresh" })).not.toBeDisabled();
  });

  it("filters truthful image sources and exposes editors only for database-managed service pages", async () => {
    const data = metadata();
    data.services.find(service => service.slug === "building-envelope-solutions")!.featured_image = "/media/envelope.jpg";
    data.services.find(service => service.slug === "interior-buildouts-finishing")!.featured_image = "/src/assets/unbuilt.jpg";
    data.services.push({ id: "ignored-static-record", slug: "commercial-painting-gta", name: "Static specialty", category: "interior", featured_image: "/media/ignored-static.jpg" });
    mock.load.mockResolvedValueOnce(data);
    mount();
    await waitFor(() => expect(screen.getByRole("button", { name: "Refresh" })).not.toBeDisabled());
    const search = screen.getByRole("textbox", { name: "Search page headers" });
    fireEvent.change(search, { target: { value: "commercial-painting-gta" } });
    const specialty = pageRow("/services/commercial-painting-gta");
    expect(within(specialty).getByText("Service image registry")).toBeInTheDocument();
    expect(within(specialty).getByText("Managed in code")).toBeInTheDocument();
    expect(within(specialty).queryByRole("link", { name: "Open editor" })).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: "building-envelope-solutions" } });
    const envelope = pageRow("/services/building-envelope-solutions");
    expect(within(envelope).getByText("Service editor")).toBeInTheDocument();
    expect(within(envelope).getByRole("link", { name: "Open editor" })).toHaveAttribute("href", "/admin/services/id-building-envelope-solutions");
    fireEvent.change(screen.getByRole("combobox", { name: "Image coverage" }), { target: { value: "attention" } });
    expect(screen.getByText("No pages match these filters.")).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "interior-buildouts-finishing" } });
    expect(within(pageRow("/services/interior-buildouts-finishing")).getByText("Stored image is unusable; showing the service fallback.")).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Image coverage" }), { target: { value: "all" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Page group" }), { target: { value: "Cities" } });
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(18);
    expect(screen.getAllByText("Illustrated regional map")).toHaveLength(17);
  });

  it("shows partial-source failures and retries without hiding healthy service editor links", async () => {
    const partial = metadata();
    partial.failed = ["Published projects", "Published articles"];
    mock.load.mockResolvedValueOnce(partial);
    mount();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Published projects, Published articles");
    expect(alert).toHaveTextContent("Counts and image sources are incomplete.");
    expect(screen.getByText("Partial inventory:", { exact: false })).toHaveTextContent("68 pages");
    expect(within(pageRow("/services/building-envelope-solutions")).getByRole("link", { name: "Open editor" })).toBeInTheDocument();
    mock.load.mockResolvedValueOnce(metadata());
    fireEvent.click(within(alert).getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(screen.getByText("Canonical page inventory:", { exact: false })).toHaveTextContent("68 pages");
  });
});

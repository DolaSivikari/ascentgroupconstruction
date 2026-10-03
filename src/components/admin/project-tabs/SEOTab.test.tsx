import { act, useState, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SEOTab } from "./SEOTab";
import type { ProjectFormData } from "@/lib/admin/projectEditor";

const mock = vi.hoisted(() => ({ invoke: vi.fn(), toast: vi.fn(), change: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: mock.invoke } } }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mock.toast }) }));
vi.mock("@/components/ui/select", () => {
  const Wrapper = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return { Select: Wrapper, SelectContent: Wrapper, SelectItem: Wrapper, SelectTrigger: Wrapper, SelectValue: () => null };
});
const existing: ProjectFormData = {
  title: "Fixture project", slug: "fixture-project", summary: "Fixture project summary",
  project_images: [], service_ids: [], publish_state: "draft",
  seo_title: "Manually written title", seo_description: "Manually written description",
};
const generated = { seo_title: "Generated fixture title", seo_description: "Generated fixture description" };
function Harness() {
  const [form, setForm] = useState(existing);
  return <SEOTab formData={form} onFormChange={(updates) => { mock.change(updates); setForm((current) => ({ ...current, ...updates })); }} />;
}
const generate = () => fireEvent.click(screen.getByRole("button", { name: "Generate SEO Content" }));
const assertManualFields = () => {
  expect(screen.getByLabelText("SEO Title")).toHaveValue(existing.seo_title);
  expect(screen.getByLabelText("SEO Description")).toHaveValue(existing.seo_description);
};
beforeEach(() => { vi.clearAllMocks(); mock.invoke.mockResolvedValue({ data: generated, error: null }); });
afterEach(cleanup);

describe("reviewing AI SEO suggestions", () => {
  it("stages valid suggestions and changes metadata only after explicit Apply", async () => {
    render(<Harness />); generate();
    expect(await screen.findByRole("region", { name: "Generated SEO suggestions" })).toBeVisible();
    assertManualFields(); expect(mock.change).not.toHaveBeenCalled();
    expect(mock.invoke).toHaveBeenCalledWith("generate-seo-content", { body: { title: "Fixture project", subtitle: "", summary: "Fixture project summary", description: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply suggestions" }));
    expect(mock.change).toHaveBeenCalledOnce(); expect(mock.change).toHaveBeenCalledWith(generated);
    expect(screen.getByLabelText("SEO Title")).toHaveValue(generated.seo_title);
    expect(screen.queryByRole("region", { name: "Generated SEO suggestions" })).not.toBeInTheDocument();
  });
  it("discards suggestions without altering manual metadata", async () => {
    render(<Harness />); generate(); await screen.findByRole("button", { name: "Discard suggestions" });
    fireEvent.click(screen.getByRole("button", { name: "Discard suggestions" }));
    assertManualFields(); expect(mock.change).not.toHaveBeenCalled();
  });
  it.each([
    null,
    { error: "Unexpected response" },
    { seo_title: "", seo_description: "Description" },
    { seo_title: "Title", seo_description: "   " },
    { seo_title: 42, seo_description: "Description" },
    { seo_title: "x".repeat(61), seo_description: "Description" },
  ])("preserves manual metadata after a malformed successful response %#", async (data) => {
    mock.invoke.mockResolvedValue({ data, error: null }); render(<Harness />); generate();
    expect(await screen.findByRole("alert")).toHaveTextContent("invalid SEO suggestions");
    assertManualFields(); expect(mock.change).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Apply suggestions" })).not.toBeInTheDocument();
  });
  it.each([
    { status: 402, message: "additional credits" },
    { status: 429, message: "rate limited" },
  ])("shows useful guidance for HTTP $status while preserving fields", async ({ status, message }) => {
    mock.invoke.mockResolvedValue({ data: null, error: Object.assign(new Error("Edge Function returned a non-2xx status code"), { context: { status } }) });
    render(<Harness />); generate();
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    assertManualFields(); expect(mock.change).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("button", { name: "Generate SEO Content" })).toBeEnabled());
  });
  it("keeps manually entered fields when the gateway rejects", async () => {
    mock.invoke.mockRejectedValue(new Error("Fixture gateway unavailable"));
    render(<Harness />); generate();
    expect(await screen.findByRole("alert")).toHaveTextContent("Fixture gateway unavailable");
    assertManualFields(); expect(mock.change).not.toHaveBeenCalled();
  });
  it("does not overwrite edits made while generation is pending", async () => {
    let finish: (value: { data: typeof generated; error: null }) => void;
    mock.invoke.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    render(<Harness />); generate();
    expect(screen.getByRole("button", { name: "Generating..." })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("SEO Title"), { target: { value: "New manual title" } });
    fireEvent.change(screen.getByLabelText("SEO Description"), { target: { value: "New manual description" } });
    await act(async () => { finish({ data: generated, error: null }); });
    expect(screen.getByLabelText("SEO Title")).toHaveValue("New manual title");
    expect(screen.getByLabelText("SEO Description")).toHaveValue("New manual description");
    expect(mock.change).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: "Apply suggestions" }));
    expect(mock.change).toHaveBeenLastCalledWith(generated);
  });
});

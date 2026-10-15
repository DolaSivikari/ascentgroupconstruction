import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import contentModule, {
  homeRepairGuide,
} from "@/content/pages/home-repair-guide";
import { HomepageDocumentationPreview } from "./HomepageDocumentationPreview";

const content = vi.hoisted(() => ({ overrides: {} as Record<string, string> }));
vi.mock("@/lib/content/store", () => ({
  useResolvedContent: () => ({
    ...contentModule.defaults,
    ...content.overrides,
  }),
}));
afterEach(() => {
  cleanup();
  content.overrides = {};
});
const renderSection = () =>
  render(
    <MemoryRouter>
      <HomepageDocumentationPreview />
    </MemoryRouter>,
  );

describe("homepage repair scope walkthrough", () => {
  it("explains a single example without presenting a diagnosis or completed project", () => {
    renderSection();
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      homeRepairGuide.documents.drawingLabel,
    );
    expect(screen.getByText(/AI-generated reference image/)).toBeVisible();
    expect(
      screen.getByText(/does not establish the source of the leak/),
    ).toBeVisible();
    fireEvent.click(screen.getByText("Read the scope checklist"));
    expect(
      screen.getByText(
        /Window replacement and concealed wall repairs are outside/,
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Discuss your repair scope" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: "Explore the documentation examples" }),
    ).toHaveAttribute("href", "/company/technology");
  });

  it("keeps location, evidence and owner decisions connected through the three stages", () => {
    renderSection();
    for (const stage of homeRepairGuide.documents.stages) {
      fireEvent.mouseDown(screen.getByRole("tab", { name: stage.label }), {
        button: 0,
        ctrlKey: false,
      });
      expect(screen.getByRole("tabpanel")).toHaveTextContent(stage.recordTitle);
      expect(screen.getByRole("tabpanel")).toHaveTextContent(stage.decision);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("W-01");
      fireEvent.click(screen.getByText(stage.detailLabel));
    }
    expect(screen.getByText("Applicable warranty documents")).toBeVisible();
    expect(
      screen.getByText(homeRepairGuide.documents.stages[2].note),
    ).toBeVisible();
  });

  it("uses existing saved content keys alongside new defaults", () => {
    content.overrides = {
      documents_title: "Saved scope heading",
      documents_stages_0_title: "Saved scope title",
      documents_drawingcaption: "Saved reference caption",
    };
    renderSection();
    expect(
      screen.getByRole("heading", { name: "Saved scope heading" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Saved scope title" }),
    ).toBeVisible();
    expect(screen.getByText("Saved reference caption")).toBeVisible();
    expect(screen.getByText("Scope outline")).toBeVisible();
  });
});

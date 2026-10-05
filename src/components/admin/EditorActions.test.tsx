import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditorActions } from "./EditorActions";
afterEach(cleanup);
describe("staged publication control", () => {
  it("requires confirmation and only stages the status, leaving writes to Save", () => {
    const change = vi.fn();
    render(
      <EditorActions
        title="Project"
        state="draft"
        onStateChange={change}
        formId="form"
      />,
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "Use Save to apply",
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByRole("button", { name: "Stage status" }));
    expect(change).toHaveBeenCalledExactlyOnceWith("published");
    expect(screen.getByRole("button", { name: "Save draft" })).toHaveAttribute(
      "form",
      "form",
    );
  });
  it("summarizes native required-field errors without allowing a save", () => {
    render(
      <>
        <EditorActions
          title="Post"
          state="draft"
          onStateChange={vi.fn()}
          formId="post"
        />
        <form id="post">
          <label htmlFor="title">Title *</label>
          <input id="title" required />
        </form>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Fix before saving: Title *",
    );
    fireEvent.input(screen.getByLabelText("Title *"), {
      target: { value: "Valid title" },
    });
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

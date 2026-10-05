import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageUploadField } from "./ImageUploadField";
const mock = vi.hoisted(() => ({ remove: vi.fn() }));
const root =
  "https://storage.example.test/storage/v1/object/public/project-images/";
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: root } }),
        remove: mock.remove,
      }),
    },
  },
}));
vi.mock("./MediaPicker", () => ({ MediaPicker: () => null }));
afterEach(cleanup);
describe("image replacement cleanup", () => {
  it("offers the latest replaced image for separate reference-checked deletion and never deletes while editing", () => {
    const { rerender } = render(
      <ImageUploadField value={root + "folder/a.jpg"} onChange={vi.fn()} />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    rerender(
      <ImageUploadField value={root + "folder/b.jpg"} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/admin/media?folder=folder&search=a.jpg",
    );
    rerender(
      <ImageUploadField value={root + "folder/c.jpg"} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/admin/media?folder=folder&search=b.jpg",
    );
    expect(mock.remove).not.toHaveBeenCalled();
  });
});

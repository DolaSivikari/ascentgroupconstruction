import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageUploadField } from "./ImageUploadField";
const mock = vi.hoisted(() => ({
  remove: vi.fn(),
  normalize: vi.fn(),
  upload: vi.fn(),
  validate: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
}));
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
vi.mock("@/utils/image-normalizer", () => ({
  normalizeImageFile: mock.normalize,
}));
vi.mock("@/utils/imageResolver", () => ({ uploadImage: mock.upload }));
vi.mock("@/utils/image-optimizer", () => ({
  validateImageFile: mock.validate,
  validateAspectRatio: () => true,
  calculateAspectRatio: () => "4/3",
}));
vi.mock("sonner", () => ({
  toast: { error: mock.error, success: mock.success },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mock.validate.mockResolvedValue(null);
  mock.upload.mockResolvedValue({ url: root + "processed.jpg" });
  mock.normalize.mockImplementation(async (file: File) => ({
    file,
    didResize: false,
    didCrop: false,
  }));
});
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

describe("automatic cover preparation", () => {
  it("honours the minimum dimensions even without a requested crop", async () => {
    const processed = new File(["processed"], "processed.webp", {
        type: "image/webp",
      }),
      change = vi.fn();
    mock.normalize.mockResolvedValue({
      file: processed,
      didResize: true,
      didCrop: false,
      outputWidth: 800,
      outputHeight: 1067,
    });
    render(
      <ImageUploadField onChange={change} minWidth={800} minHeight={600} />,
    );
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: {
        files: [new File(["input"], "input.png", { type: "image/png" })],
      },
    });
    await waitFor(() =>
      expect(change).toHaveBeenCalledWith(root + "processed.jpg"),
    );
    expect(mock.normalize).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({
        targetAspectRatio: null,
        minWidth: 800,
        minHeight: 600,
      }),
    );
    expect(mock.upload).toHaveBeenCalledWith(processed, "project-images");
    expect(screen.getByText(/resized to 800×1067/)).toBeVisible();
  });
  it("prioritizes the requested cover ratio and passes its minima to the processor", async () => {
    render(
      <ImageUploadField
        onChange={vi.fn()}
        minWidth={1200}
        minHeight={675}
        minAspectRatio={1.33}
        targetAspectRatio="16/9"
      />,
    );
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: {
        files: [new File(["input"], "input.jpg", { type: "image/jpeg" })],
      },
    });
    await waitFor(() => expect(mock.upload).toHaveBeenCalled());
    expect(mock.normalize).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({
        targetAspectRatio: 16 / 9,
        minWidth: 1200,
        minHeight: 675,
        forceExactRatio: true,
      }),
    );
  });
  it("does not upload a file that still fails the final dimension check", async () => {
    mock.validate.mockResolvedValue("Image is too small");
    render(<ImageUploadField onChange={vi.fn()} minWidth={800} />);
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: {
        files: [new File(["input"], "input.jpg", { type: "image/jpeg" })],
      },
    });
    await waitFor(() =>
      expect(mock.error).toHaveBeenCalledWith("Image is too small"),
    );
    expect(mock.upload).not.toHaveBeenCalled();
  });
});

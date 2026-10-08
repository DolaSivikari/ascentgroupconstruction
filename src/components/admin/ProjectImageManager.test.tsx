import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectImageManager } from "./ProjectImageManager";
import type { ProjectImage } from "@/lib/admin/projectEditor";
const mock = vi.hoisted(() => ({
  upload: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  normalize: vi.fn(),
  validate: vi.fn(),
}));
vi.mock("@/utils/image-optimizer", () => ({
  validateImageFile: mock.validate,
}));
vi.mock("@/utils/image-normalizer", () => ({
  normalizeImageFile: mock.normalize,
}));
vi.mock("sonner", () => ({
  toast: { error: mock.error, success: mock.success },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({ limit: async () => ({ data: [], error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: mock.upload,
        remove: mock.remove,
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://storage.example.test/${path}` },
        }),
      }),
    },
  },
}));
const image: ProjectImage = {
  id: "old-image",
  url: "https://storage.example.test/old.jpg",
  category: "gallery",
  order: 0,
  featured: false,
};
const QueryWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.upload.mockResolvedValue({ data: {}, error: null });
  mock.validate.mockResolvedValue(null);
  mock.normalize.mockImplementation(async (file: File) => ({
    file,
    didResize: false,
  }));
});
describe("staged gallery editing", () => {
  it("requires confirmation and stages removal without deleting any storage file", async () => {
    render(
      <ProjectImageManager
        projectId="project-1"
        images={[image]}
        onImagesUpdate={mock.update}
      />,
      { wrapper: QueryWrapper },
    );
    fireEvent.click(screen.getByTitle("Remove gallery image"));
    expect(await screen.findByRole("alertdialog")).toHaveTextContent(
      "when you save",
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mock.update).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTitle("Remove gallery image"));
    fireEvent.click(screen.getByRole("button", { name: "Stage removal" }));
    expect(mock.update).toHaveBeenCalledWith([]);
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("keeps new images and caption edits made while an upload is in flight", async () => {
    let resolve!: (result: unknown) => void;
    mock.upload.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { rerender } = render(
      <ProjectImageManager
        projectId="project-1"
        images={[image]}
        onImagesUpdate={mock.update}
      />,
      { wrapper: QueryWrapper },
    );
    const zone =
      document.querySelector<HTMLInputElement>(
        "#upload-gallery",
      )!.parentElement!;
    fireEvent.drop(zone, {
      dataTransfer: {
        files: [new File(["image"], "fixture.jpg", { type: "image/jpeg" })],
      },
    });
    await waitFor(() => expect(mock.upload).toHaveBeenCalled());
    const second = {
      ...image,
      id: "second-image",
      url: "https://storage.example.test/second.jpg",
      order: 1,
    };
    const edited = { ...image, caption: "Latest caption" };
    rerender(
      <ProjectImageManager
        projectId="project-1"
        images={[edited, second]}
        onImagesUpdate={mock.update}
      />,
    );
    resolve({ data: {}, error: null });
    await waitFor(() => expect(mock.update).toHaveBeenCalled());
    const saved = mock.update.mock.calls[0][0];
    expect(saved).toHaveLength(3);
    expect(saved[0]).toEqual(edited);
    expect(saved[1]).toEqual(second);
  });
});

describe("gallery upload preparation", () => {
  it("uploads the processed photo and preserves the existing gallery", async () => {
    const processed = new File(["processed"], "photo.webp", {
      type: "image/webp",
    });
    mock.normalize.mockResolvedValue({
      file: processed,
      didResize: true,
      didPad: false,
      outputWidth: 800,
      outputHeight: 1067,
    });
    render(
      <ProjectImageManager
        projectId="old-project"
        images={[image]}
        onImagesUpdate={mock.update}
      />,
      { wrapper: QueryWrapper },
    );
    fireEvent.change(document.querySelector("#upload-gallery")!, {
      target: {
        files: [new File(["original"], "photo.png", { type: "image/png" })],
      },
    });
    await waitFor(() => expect(mock.upload).toHaveBeenCalled());
    expect(mock.normalize).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({
        targetAspectRatio: null,
        minWidth: 800,
        minHeight: 600,
        preserveUnchanged: true,
      }),
    );
    expect(mock.validate).toHaveBeenCalledWith(processed, {
      minWidth: 800,
      minHeight: 600,
    });
    expect(mock.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^old-project\/gallery\/.+\.webp$/),
      processed,
      expect.any(Object),
    );
    await waitFor(() => expect(mock.update).toHaveBeenCalled());
    expect(mock.update.mock.calls[0][0][0]).toEqual(image);
    expect(mock.success).toHaveBeenCalledWith(
      expect.stringContaining("800×1067"),
    );
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("skips a corrupt file and continues processing the rest of a batch", async () => {
    mock.normalize
      .mockRejectedValueOnce(new Error("Could not decode image"))
      .mockResolvedValueOnce({
        file: new File(["good"], "good.jpg", { type: "image/jpeg" }),
        didResize: false,
      });
    render(
      <ProjectImageManager
        projectId="old-project"
        images={[image]}
        onImagesUpdate={mock.update}
      />,
      { wrapper: QueryWrapper },
    );
    fireEvent.drop(document.querySelector("#upload-gallery")!.parentElement!, {
      dataTransfer: {
        files: [
          new File(["bad"], "bad.jpg", { type: "image/jpeg" }),
          new File(["good"], "good.jpg", { type: "image/jpeg" }),
        ],
      },
    });
    await waitFor(() => expect(mock.update).toHaveBeenCalled());
    expect(mock.upload).toHaveBeenCalledTimes(1);
    expect(mock.update.mock.calls[0][0]).toHaveLength(2);
    expect(mock.error).toHaveBeenCalledWith(
      expect.stringContaining("Could not decode image"),
    );
  });
  it("does not upload when final validation still fails", async () => {
    mock.validate.mockResolvedValue("Image is too small");
    render(
      <ProjectImageManager
        projectId="old-project"
        images={[image]}
        onImagesUpdate={mock.update}
      />,
      { wrapper: QueryWrapper },
    );
    fireEvent.change(document.querySelector("#upload-gallery")!, {
      target: { files: [new File(["bad"], "bad.jpg", { type: "image/jpeg" })] },
    });
    await waitFor(() => expect(mock.error).toHaveBeenCalled());
    expect(mock.upload).not.toHaveBeenCalled();
  });
});

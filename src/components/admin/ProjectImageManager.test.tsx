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
}));
vi.mock("@/utils/image-optimizer", () => ({
  validateImageFile: async () => null,
}));
vi.mock("sonner", () => ({ toast: { error: mock.error } }));
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

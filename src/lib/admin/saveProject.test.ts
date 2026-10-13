import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { saveProject, writableProject } from "./saveProject";
import type { ProjectFormData } from "./projectEditor";
const mock = vi.hoisted(() => ({
  rpc: vi.fn(),
  from: vi.fn(),
  relationships: vi.fn(),
  writes: [] as Array<{ action: string; payload: unknown }>,
  results: [] as unknown[],
}));
vi.mock("./projectPersistence", () => ({
  saveProjectRelationships: mock.relationships,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: mock.rpc,
    from: mock.from,
    auth: {
      getUser: async () => ({ data: { user: { id: "admin" } }, error: null }),
    },
  },
}));
const id = "00000000-0000-4000-8000-000000000001";
const form: ProjectFormData = {
  slug: "fixture",
  title: "Fixture",
  publish_state: "published",
  project_images: [],
  service_ids: [],
};
const input = () => ({
  id: null,
  expectedUpdatedAt: null,
  form,
  baseline: { images: [], serviceIds: [] },
  onReserved: vi.fn(),
});
beforeEach(() => {
  vi.clearAllMocks();
  mock.writes = [];
  mock.results = [];
  vi.stubEnv("VITE_ATOMIC_PROJECT_SAVE_ENABLED", "false");
  mock.relationships.mockResolvedValue({ images: [], serviceIds: [] });
  mock.from.mockImplementation(() => {
    const query = {
      insert: (payload: unknown) => {
        mock.writes.push({ action: "insert", payload });
        return query;
      },
      update: (payload: unknown) => {
        mock.writes.push({ action: "update", payload });
        return query;
      },
      select: () => query,
      eq: () => query,
      is: () => query,
      single: async () => mock.results.shift(),
      maybeSingle: async () => mock.results.shift(),
    };
    return query;
  });
});
afterEach(() => vi.unstubAllEnvs());
it("retains new projects as drafts if relationship saving fails", async () => {
  mock.results.push({
    data: { id, updated_at: "2026-10-10T10:00:00Z" },
    error: null,
  });
  mock.relationships.mockRejectedValue(new Error("Gallery unavailable"));
  await expect(saveProject(input())).rejects.toThrow("Gallery unavailable");
  expect(mock.writes).toEqual([
    {
      action: "insert",
      payload: expect.objectContaining({ publish_state: "draft" }),
    },
  ]);
});
it("publishes a new project only after relationships save", async () => {
  mock.results.push(
    ...[1, 2].map(() => ({
      data: { id, updated_at: "2026-10-10T10:00:00Z" },
      error: null,
    })),
  );
  await saveProject(input());
  expect(mock.writes[0].payload).toMatchObject({ publish_state: "draft" });
  expect(mock.writes[1].payload).toMatchObject({ publish_state: "published" });
});
it("rejects a stale project before writing relationships", async () => {
  mock.results.push({ data: null, error: null });
  await expect(
    saveProject({ ...input(), id, expectedUpdatedAt: "old" }),
  ).rejects.toThrow("changed");
  expect(mock.relationships).not.toHaveBeenCalled();
});
it("never falls back to multi-request writes when the atomic RPC is enabled but missing", async () => {
  vi.stubEnv("VITE_ATOMIC_PROJECT_SAVE_ENABLED", "true");
  mock.rpc.mockResolvedValue({ data: null, error: { code: "PGRST202" } });
  await expect(saveProject(input())).rejects.toThrow("backend setup");
  expect(mock.from).not.toHaveBeenCalled();
  expect(mock.relationships).not.toHaveBeenCalled();
});
it("does not send identity, version or preview-token fields from loaded form records", () => {
  const payload = writableProject({
    ...form,
    id,
    created_by: "other",
    updated_at: "old",
    preview_token: "private",
  });
  for (const key of ["id", "created_by", "updated_at", "preview_token"])
    expect(payload).not.toHaveProperty(key);
  expect(payload).toMatchObject({
    title: "Fixture",
    publish_state: "published",
  });
});
